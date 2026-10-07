from datetime import datetime
from typing import NotRequired, TypedDict

from bson import ObjectId


class ProductMetadataDocument(TypedDict):
    material: str
    weight: str


class ProductDocument(TypedDict):
    _id: NotRequired[ObjectId]
    id: str
    name: str
    categoryId: ObjectId
    color: str
    basePrice: int
    multiplier: float
    metadata: ProductMetadataDocument
    updatedAt: datetime


class CategoryDocument(TypedDict):
    _id: NotRequired[ObjectId]
    name: str
    updatedAt: datetime


class ProductWithCategoryDocument(ProductDocument):
    category: CategoryDocument