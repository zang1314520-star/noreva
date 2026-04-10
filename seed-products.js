// Run this via: npx ts-node seed-products.js
// Or copy the products array to admin panel

const products = [
  {
    id: "bag-001",
    name: "Le Sac Nerveux",
    nameCn: "神经感手提包",
    category: "bags",
    categoryName: "Bags",
    price: 890,
    currency: "EUR",
    description: "Handcrafted in Milan from full-grain Italian leather. Features a minimalist clasp closure and suede-lined interior.",
    descriptionCn: "米兰全粒面皮革手工制作。极简搭扣设计，绒面内衬。",
    mainImage: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80",
    specs: [
      { id: "1", color: "Black", size: "One Size", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80", stock: 5 },
      { id: "2", color: "Brown", size: "One Size", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80", stock: 3 },
    ],
    detailImages: [
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80",
      "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&q=80",
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: "clothing-001",
    name: "Silk Blouse",
    nameCn: "真丝衬衫",
    category: "clothing",
    categoryName: "Clothing",
    price: 450,
    currency: "EUR",
    description: "Selected Italian silk fabric. Relaxed fit with pearl buttons.",
    descriptionCn: "精选意大利真丝面料。宽松版型，珍珠扣设计。",
    mainImage: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80",
    specs: [
      { id: "1", color: "White", size: "S", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80", stock: 8 },
      { id: "2", color: "White", size: "M", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80", stock: 6 },
      { id: "3", color: "Beige", size: "S", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80", stock: 4 },
      { id: "4", color: "Beige", size: "M", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80", stock: 5 },
    ],
    detailImages: [
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80",
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: "watch-001",
    name: "Calibre 01",
    nameCn: "卡利伯01腕表",
    category: "watches",
    categoryName: "Watches",
    price: 2400,
    currency: "EUR",
    description: "Swiss automatic movement. 40mm case in brushed steel. Sapphire crystal.",
    descriptionCn: "瑞士自动机芯。40mm精钢表壳。蓝宝石水晶镜面。",
    mainImage: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    specs: [
      { id: "1", color: "Silver", size: "One Size", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80", stock: 3 },
    ],
    detailImages: [
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80",
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: "pants-001",
    name: "Tailored Trousers",
    nameCn: "定制长裤",
    category: "pants",
    categoryName: "Pants",
    price: 320,
    currency: "EUR",
    description: "Italian wool blend. High-waisted wide leg silhouette.",
    descriptionCn: "意大利羊毛混纺。高腰宽腿版型。",
    mainImage: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80",
    specs: [
      { id: "1", color: "Black", size: "S", image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80", stock: 6 },
      { id: "2", color: "Black", size: "M", image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80", stock: 8 },
      { id: "3", color: "Beige", size: "S", image: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&q=80", stock: 4 },
      { id: "4", color: "Beige", size: "M", image: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&q=80", stock: 5 },
    ],
    detailImages: [
      "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&q=80",
    ],
    createdAt: new Date().toISOString(),
  },
];

console.log("Copy these products to your admin panel at https://noreva.cc/admin");
console.log("Navigate to Products tab and add each product manually.");
console.log("\n--- JSON for API ---\n");
console.log(JSON.stringify(products, null, 2));
