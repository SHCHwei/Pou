from typing import Generic, TypeVar

from pydantic import BaseModel

T = TypeVar("T")


class ProductMetadata(BaseModel):
    material: str
    weight: str


class ProductOut(BaseModel):
    """Product output schema"""
    id: str  # 商品貨號 (非 Mongo _id)
    name: str
    categoryId: str
    categoryName: str
    color: str
    basePrice: int
    multiplier: float
    metadata: ProductMetadata


class ProductUpdate(BaseModel):
    color: str
    basePrice: int
    multiplier: float


class ProductListData(BaseModel):
    product: list[ProductOut]



class ApiResponse(BaseModel, Generic[T]):
    status: bool
    data: T
