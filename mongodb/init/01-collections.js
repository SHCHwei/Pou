
db.createCollection("categories", {
    validator: { 
        $jsonSchema: { 
            bsonType: "object", 
            required: ["name", "updatedAt"], 
            properties: { 
                name: { bsonType: "string", description: "must be a string and is required" },
                updatedAt: { bsonType: "date", description: "must be a date and is required" }
            } 
        } 
    },
    collation: { locale: "en", strength: 2 }

})

db.categories.createIndex(
    { name: 1 },
    { unique: true, collation: { locale: "en", strength: 2 } }
)



db.createCollection("products", {
    validator: { 
        $jsonSchema: { 
            bsonType: "object", 
            required: ["id", "name", "categoryId", "color", "basePrice", "multiplier", "metadata", "updatedAt"], 
            properties: {
                id: { bsonType: "string", description: "must be an string and is required" },
                name: { bsonType: "string", description: "must be a string and is required" },
                categoryId: { bsonType: "objectId", description: "must be an ObjectId and is required" },
                color: { bsonType: "string", pattern: "^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$", description: "must be a hex color code like #fff or #ffffff and is required" },
                basePrice: { bsonType: ["int", "long"], minimum: 1, description: "must be a positive integer and is required" },
                multiplier: { bsonType: "number", description: "must be a number (float allowed) and is required" },
                metadata: {
                    bsonType: "object",
                    required: ["material", "weight"],
                    properties: {
                        material: { bsonType: "string", description: "must be a string and is required" },
                        weight: { bsonType: "string", description: "must be a string and is required" }
                    },
                    description: "must be an object and is required"
                },
                updatedAt: { bsonType: "date", description: "must be a date and is required" }
            } 
        } 
    },
    collation: { locale: "en", strength: 2 }
})


db.products.createIndex({ id: 1}, { unique: true, collation: { locale: "en", strength: 2 } })
db.products.createIndex({ categoryId: 1})
db.products.createIndex({ updatedAt: -1})



