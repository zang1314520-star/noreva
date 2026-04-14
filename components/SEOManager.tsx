"use client";

// SEO 多语言元数据管理器
export const SEO_CONFIG = {
  siteName: "NOREVA",
  siteUrl: "https://www.noreva.cc",
  
  titles: {
    en: {
      home: "NOREVA — Premium Fashion House | Quiet Luxury",
      products: "The Collection — NOREVA | Carefully Chosen Pieces",
      productDetail: "NOREVA | Premium Fashion",
      about: "Our Story — NOREVA | Shanghai × Milan",
      contact: "Contact — NOREVA | Personal Styling Service",
    },
    zh: {
      home: "NOREVA — 高端时尚品牌 | 静谧奢华",
      products: "系列臻品 — NOREVA | 精心挑选",
      productDetail: "NOREVA | 高端时尚",
      about: "品牌故事 — NOREVA | 上海 × 米兰",
      contact: "联系我们 — NOREVA | 私人造型服务",
    },
    fr: {
      home: "NOREVA — Maison de Mode Premium | Luxe Silencieux",
      products: "La Collection — NOREVA | Pièces Soigneusement Choisies",
      productDetail: "NOREVA | Maison de Mode Premium",
      about: "Notre Histoire — NOREVA | Shanghai × Milan",
      contact: "Contact — NOREVA | Service de Stylisme Personnel",
    },
    it: {
      home: "NOREVA — Casa di Moda Premium | Lusso Silenzioso",
      products: "La Collezione — NOREVA | Pezzi Scelti con Cura",
      productDetail: "NOREVA | Casa di Moda Premium",
      about: "La Nostra Storia — NOREVA | Shanghai × Milano",
      contact: "Contatto — NOREVA | Servizio di Stilismo Personale",
    },
    de: {
      home: "NOREVA — Premium Modehaus | Stille Eleganz",
      products: "Die Kollektion — NOREVA | Sorgfältig Ausgewählte Stücke",
      productDetail: "NOREVA | Premium Modehaus",
      about: "Unsere Geschichte — NOREVA | Shanghai × Mailand",
      contact: "Kontakt — NOREVA | Persönlicher Styling-Service",
    },
    es: {
      home: "NOREVA — Casa de Moda Premium | Lujo Tranquilo",
      products: "La Colección — NOREVA | Piezas Cuidadoamente Elegidas",
      productDetail: "NOREVA | Casa de Moda Premium",
      about: "Nuestra Historia — NOREVA | Shanghai × Milán",
      contact: "Contacto — NOREVA | Servicio de Estilismo Personal",
    },
  },
  
  descriptions: {
    en: "NOREVA is a premium fashion house offering carefully chosen clothing, bags, watches, and accessories. Experience quiet luxury crafted in Shanghai and Milan.",
    zh: "NOREVA 高端时尚品牌，提供精心挑选的服装、包包、手表和配饰。源自上海与米兰的静谧奢华体验。",
    fr: "NOREVA est une maison de mode premium offrant des vêtements, sacs, montres et accessoires soigneusement sélectionnés.",
    it: "NOREVA è una casa di moda premium che offre abbigliamento, borse, orologi e accessori scelti con cura.",
    de: "NOREVA ist ein Premium-Modehaus mit sorgfältig ausgewählter Kleidung, Taschen, Uhren und Accessoires.",
    es: "NOREVA es una casa de moda premium que ofrece ropa, bolsos, relojes y accesorios cuidadosamente elegidos.",
  },
};

type PageKey = keyof typeof SEO_CONFIG.titles.en;
type LangKey = keyof typeof SEO_CONFIG.titles;

export function getPageTitle(page: PageKey, lang: LangKey): string {
  return SEO_CONFIG.titles[lang]?.[page] || SEO_CONFIG.titles.en.home;
}

export function getDescription(lang: LangKey): string {
  return SEO_CONFIG.descriptions[lang] || SEO_CONFIG.descriptions.en;
}

// SEO Meta 组件
export default function SEOManager({ 
  page = "home", 
  lang = "en",
}: { 
  page?: PageKey;
  lang?: string;
}) {
  const title = getPageTitle(page, lang as LangKey);
  const description = getDescription(lang as LangKey);
  
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://www.noreva.cc" />
      <meta property="og:site_name" content="NOREVA" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <link rel="canonical" href="https://www.noreva.cc" />
    </>
  );
}
