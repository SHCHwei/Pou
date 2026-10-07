import unittest
from datetime import datetime, timezone

from bson import ObjectId

from app.services.product_service import _to_out


class ProductServiceTests(unittest.TestCase):
    def test_document_is_converted_to_response_schema(self) -> None:
        product = _to_out(
            {
                "_id": ObjectId(),
                "id": "msh-001",
                "name": "Example product",
                "categoryId": ObjectId(),
                "category": {
                    "name": "Components",
                    "updatedAt": datetime.now(timezone.utc),
                },
                "color": "#ffffff",
                "basePrice": 100,
                "multiplier": 1.2,
                "metadata": {"material": "Aluminum", "weight": "1kg"},
                "updatedAt": datetime.now(timezone.utc),
            }
        )

        self.assertEqual(product.id, "msh-001")
        self.assertEqual(product.name, "Example product")
        self.assertEqual(product.categoryName, "Components")


if __name__ == "__main__":
    unittest.main()