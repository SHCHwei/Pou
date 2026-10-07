const now = new Date();

db.categories.insertMany([
    { name: "結構組件", updatedAt: now },
    { name: "外部面板", updatedAt: now },
    { name: "電子元件", updatedAt: now }
]);

const categoryId = (name) => db.categories.findOne({ name: name })._id;

// price 來源資料未提供，以 basePrice * multiplier 計算
const products = [
    {
        id: "msh-001",
        name: "高強度鋁合金支架",
        category: "結構組件",
        color: "#A5A9B4",
        basePrice: 1250,
        multiplier: 1.2,
        metadata: { material: "Aluminum 6061", weight: "1.5kg" }
    },
    {
        id: "msh-002",
        name: "強化玻璃視窗",
        category: "外部面板",
        color: "#1E293B",
        basePrice: 850,
        multiplier: 1.0,
        metadata: { material: "Tempered Glass", weight: "2.2kg" }
    },
    {
        id: "msh-003",
        name: "散熱模組風扇",
        category: "電子元件",
        color: "#FF4D4D",
        basePrice: 450,
        multiplier: 1.5,
        metadata: { material: "PBT Plastic", weight: "0.3kg" }
    },
    {
        id: "msh-004",
        name: "陽極氧化底座",
        category: "結構組件",
        color: "#2D3436",
        basePrice: 2100,
        multiplier: 2.0,
        metadata: { material: "Steel", weight: "5.0kg" }
    }
];

db.products.insertMany(
    products.map(({ category, ...p }) => ({
        ...p,
        categoryId: categoryId(category),
        updatedAt: now
    }))
);
