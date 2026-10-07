from fastapi import APIRouter, Depends, HTTPException
from pymongo.asynchronous.database import AsyncDatabase

from app.dependencies import get_db
from app.schemas.item import ApiResponse, ProductListData, ProductOut, ProductUpdate
from app.services import product_service

router = APIRouter(prefix="/pou", tags=["pou"])


@router.get("/Parts/list", response_model=ApiResponse[ProductListData])
async def list_parts(db: AsyncDatabase = Depends(get_db)):
    products = await product_service.list_products(db)
    return ApiResponse(status=True, data=ProductListData(product=products))


@router.get("/Parts/{product_id}", response_model=ApiResponse[ProductOut])
async def get_part(product_id: str, db: AsyncDatabase = Depends(get_db)):
    product = await product_service.get_product(db, product_id)
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return ApiResponse(status=True, data=product)


@router.put("/Parts/{product_id}", response_model=ApiResponse[ProductOut])
async def update_part(product_id: str, payload: ProductUpdate, db: AsyncDatabase = Depends(get_db)):
    product = await product_service.update_product(db, product_id, payload)
    if product is None:
        return ApiResponse(status=False, data="Update Error")
    return ApiResponse(status=True, data=product)
