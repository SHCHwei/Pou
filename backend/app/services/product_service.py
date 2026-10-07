import time

from pymongo.asynchronous.database import AsyncDatabase

from app.models.product import ProductWithCategoryDocument
from app.schemas.item import ProductOut, ProductUpdate

_WITH_CATEGORY = [
    {
        "$lookup": {
            "from": "categories",
            "localField": "categoryId",
            "foreignField": "_id",
            "as": "category",
        }
    },
    {"$unwind": "$category"},
]


def _to_out(doc: ProductWithCategoryDocument) -> ProductOut:
    return ProductOut(
        id=doc["id"],
        name=doc["name"],
        categoryId=str(doc["categoryId"]),
        categoryName=doc["category"]["name"],
        color=doc["color"],
        basePrice=doc["basePrice"],
        multiplier=doc["multiplier"],
        metadata=doc["metadata"],
    )


async def list_products(db: AsyncDatabase) -> list[ProductOut]:
    cursor = await db.products.aggregate([*_WITH_CATEGORY, {"$sort": {"_id": 1}}])
    return [_to_out(doc) async for doc in cursor]


async def get_product(db: AsyncDatabase, product_id: str) -> ProductOut | None:
    cursor = await db.products.aggregate(
        [{"$match": {"id": product_id}}, *_WITH_CATEGORY]
    )
    docs = await cursor.to_list(length=1)
    return _to_out(docs[0]) if docs else None


async def update_product(
    db: AsyncDatabase, product_id: str, payload: ProductUpdate
) -> ProductOut | None:
    print(f"Updating product {product_id}, simulating long operation...")
    time.sleep(60)
    print(f"Finished simulating long operation for product {product_id}")

    result = await db.products.update_one(
        {"id": product_id}, {"$set": payload.model_dump()}
    )
    if result.matched_count == 0:
        return None
    return await get_product(db, product_id)