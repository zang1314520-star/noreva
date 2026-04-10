// 示例产品数据 - 复制到管理后台添加

const sampleProducts = [
  // 包袋
  {
    name: "Le Sac Nerveux",
    nameCn: "神经感手提包",
    category: "bags",
    price: 890,
    currency: "EUR",
    description: "Handcrafted in Milan from full-grain Italian leather. Features a minimalist clasp closure and suede-lined interior.",
    descriptionCn: "米兰全粒面皮革手工制作。极简搭扣设计，绒面内衬。",
    mainImage: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80",
    specs: [
      { color: "Black", size: "One Size", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80", stock: 5 },
      { color: "Brown", size: "One Size", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80", stock: 3 },
    ],
    detailImages: [
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80",
    ],
  },
  // 服装
  {
    name: "Silk Blouse Atelier",
    nameCn: "真丝衬衫",
    category: "clothing",
    price: 450,
    currency: "EUR",
    description: "Woven from grade 6A mulberry silk in Como, Italy. Oversized fit with mother-of-pearl buttons.",
    descriptionCn: "意大利科莫6A级桑蚕丝面料。宽松版型，珍珠母贝纽扣。",
    mainImage: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80",
    specs: [
      { color: "White", size: "S", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80", stock: 4 },
      { color: "White", size: "M", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80", stock: 6 },
      { color: "White", size: "L", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80", stock: 3 },
      { color: "Black", size: "S", image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80", stock: 2 },
      { color: "Black", size: "M", image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80", stock: 5 },
    ],
    detailImages: [
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80",
    ],
  },
  // 手表
  {
    name: "Calibre 01",
    nameCn: "卡利伯01腕表",
    category: "watches",
    price: 2400,
    currency: "EUR",
    description: "Swiss automatic movement. Sapphire crystal. 40mm case in brushed steel with gold PVD bezel.",
    descriptionCn: "瑞士自动机芯。蓝宝石水晶表镜。40mm精钢表壳配金色PVD表圈。",
    mainImage: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    specs: [
      { color: "Silver", size: "40mm", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80", stock: 2 },
      { color: "Black", size: "40mm", image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&q=80", stock: 3 },
    ],
    detailImages: [
      "https://images.unsplash.com/photo-1539874754764-5a96559165b0?w=800&q=80",
    ],
  },
  // 裤子
  {
    name: "Tailored Trousers",
    nameCn: "定制长裤",
    category: "pants",
    price: 320,
    currency: "EUR",
    description: "Made in Portugal from Italian wool blend. High-waisted with pressed crease. True to size.",
    descriptionCn: "葡萄牙制造，意大利羊毛混纺。高腰设计，挺括裤线。尺码正。",
    mainImage: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80",
    specs: [
      { color: "Navy", size: "S", image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80", stock: 4 },
      { color: "Navy", size: "M", image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80", stock: 5 },
      { color: "Navy", size: "L", image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80", stock: 3 },
      { color: "Black", size: "S", image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80", stock: 4 },
      { color: "Black", size: "M", image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80", stock: 6 },
    ],
    detailImages: [
      "https://images.unsplash.com/photo-1624378519385-2b11f2038d54?w=800&q=80",
    ],
  },
];

console.log("产品数据:");
console.log(JSON.stringify(sampleProducts, null, 2));
