"use client";

import { useState, useEffect, useCallback, useRef } from "react";

// ========== Types ==========
interface Spec { id: string; color: string; size: string; image: string; stock: number; }
interface Product {
  id: string; name: string; nameCn?: string; brand: string;
  category: string; categoryName: string; categoryNameCn?: string;
  price: number; currency: string; description: string; descriptionCn?: string;
  mainImage: string; specs: Spec[]; detailImages: string[];
  featured?: boolean; createdAt: string;
  sourceTag?: string; searchCode?: string; sourceId?: string;
}
interface SiteImages {
  hero: { image: string; title: string; };
  newArrivals: { left: string; right: string; };
  womenswear: { main: string; secondary: string; };
  menswear: { main: string; secondary: string; };
  journal: { post1: string; post2: string; post3: string; };
}

const CATEGORY_TREE: Record<string, { name: string; nameCn: string; subcategories: Record<string, { name: string; nameCn: string }> }> = {
  accessories: {
    name: "Accessories", nameCn: "配饰",
    subcategories: {
      belts: { name: "Belts", nameCn: "皮带" },
      scarves: { name: "Scarves", nameCn: "丝巾/围巾" },
      jewelry: { name: "Jewelry", nameCn: "珠宝" },
      sunglasses: { name: "Sunglasses", nameCn: "太阳镜" },
    },
  },
  clothing: {
    name: "Clothing", nameCn: "服装",
    subcategories: {
      tops: { name: "Tops", nameCn: "上装" },
      pants: { name: "Pants", nameCn: "裤装" },
      dresses: { name: "Dresses", nameCn: "裙装" },
      outerwear: { name: "Outerwear", nameCn: "外套" },
    },
  },
  bags: {
    name: "Bags & Luggage", nameCn: "箱包",
    subcategories: {
      handbags: { name: "Handbags", nameCn: "手提包" },
      crossbody: { name: "Crossbody", nameCn: "斜挎包" },
      backpacks: { name: "Backpacks", nameCn: "双肩包" },
      wallets: { name: "Wallets", nameCn: "钱包" },
    },
  },
  shoes: {
    name: "Shoes", nameCn: "鞋靴",
    subcategories: {
      sneakers: { name: "Sneakers", nameCn: "运动鞋" },
      "leather Shoes": { name: "Leather Shoes", nameCn: "皮鞋" },
      sandals: { name: "Sandals", nameCn: "凉鞋/拖鞋" },
      boots: { name: "Boots", nameCn: "靴子" },
    },
  },
};

// ========== Helper: Auto-categorize from tag/description ==========
function autoCategorizeCn(tag: string, desc: string): { category: string; categoryName: string; categoryNameCn: string; brand: string } {
  let brand = "Unknown";
  const brandText = (tag + " " + desc);
  if (/ferragamo|菲拉格慕/i.test(brandText)) brand = "Ferragamo";
  else if (/gucci|古驰/i.test(brandText)) brand = "Gucci";
  else if (/louis\s*vuitton|\blv\b/i.test(brandText)) brand = "Louis Vuitton";
  else if (/hermes|hermès|爱马仕/i.test(brandText)) brand = "Hermès";
  else if (/chanel|香奈儿/i.test(brandText)) brand = "Chanel";
  else if (/dior|迪奥/i.test(brandText)) brand = "Dior";
  else if (/prada|普拉达/i.test(brandText)) brand = "Prada";
  else if (/burberry|巴宝莉/i.test(brandText)) brand = "Burberry";
  else if (/versace|范思哲/i.test(brandText)) brand = "Versace";
  else if (/fendi|芬迪/i.test(brandText)) brand = "Fendi";
  else if (/celine|赛琳/i.test(brandText)) brand = "Celine";
  else if (/bottega|葆蝶家/i.test(brandText)) brand = "Bottega Veneta";
  else if (/valentino|华伦天奴/i.test(brandText)) brand = "Valentino";
  else if (/armani|阿玛尼/i.test(brandText)) brand = "Armani";
  else if (/coach|蔻驰/i.test(brandText)) brand = "Coach";

  const text = (tag + " " + desc).toLowerCase();
  if (/丝巾|围巾|twilly|scarf|shawl/i.test(text)) {
    return { category: "scarves", categoryName: "Scarves", categoryNameCn: "丝巾/围巾", brand };
  }
  if (/皮带|腰带|belt/i.test(text)) {
    return { category: "belts", categoryName: "Belts", categoryNameCn: "皮带", brand };
  }
  if (/手提包|包(?![盆盆])|bag|handbag|钱包|wallet/i.test(text)) {
    if (/钱包|wallet/i.test(text)) {
      return { category: "wallets", categoryName: "Wallets", categoryNameCn: "钱包", brand };
    }
    return { category: "handbags", categoryName: "Handbags", categoryNameCn: "手提包", brand };
  }
  if (/手表|腕表|watch/i.test(text)) {
    return { category: "watches", categoryName: "Watches", categoryNameCn: "手表", brand };
  }
  if (/珠宝|首饰|jewelry|ring|necklace/i.test(text)) {
    return { category: "jewelry", categoryName: "Jewelry", categoryNameCn: "珠宝", brand };
  }
  if (/眼镜|太阳镜|sunglasses/i.test(text)) {
    return { category: "sunglasses", categoryName: "Sunglasses", categoryNameCn: "太阳镜", brand };
  }
  // 鞋类检测 - 优先于默认皮带
  if (/鞋|靴|shoe|sneaker|运动鞋|皮鞋|凉鞋|拖鞋|休闲鞋|正装鞋|马丁靴|切尔西靴/i.test(text)) {
    if (/运动鞋|sneaker|跑步鞋/i.test(text)) {
      return { category: "sneakers", categoryName: "Sneakers", categoryNameCn: "运动鞋", brand };
    }
    if (/靴|boot|马丁|切尔西/i.test(text)) {
      return { category: "boots", categoryName: "Boots", categoryNameCn: "靴子", brand };
    }
    if (/凉鞋|拖鞋|sandal|沙滩鞋/i.test(text)) {
      return { category: "sandals", categoryName: "Sandals", categoryNameCn: "凉鞋/拖鞋", brand };
    }
    if (/皮鞋|正装鞋|loafer|牛津鞋|德比鞋/i.test(text)) {
      return { category: "leather Shoes", categoryName: "Leather Shoes", categoryNameCn: "皮鞋", brand };
    }
    // 默认鞋类
    return { category: "sneakers", categoryName: "Sneakers", categoryNameCn: "运动鞋", brand };
  }
  return { category: "belts", categoryName: "Belts", categoryNameCn: "皮带", brand };
}

// ========== Helper: Parse product name from description ==========
function parseProductName(desc: string, tag: string): { name: string; nameCn: string; descClean: string } {
  const lines = desc.split("\n").map(l => l.trim()).filter(Boolean);
  let nameCn = "";
  let name = "";

  // Extract brand from tag (e.g. "Ferragamo Belt | 菲拉格慕皮带")
  const tagParts = tag.split("|").map(s => s.trim());
  const brandEn = tagParts[0] || "";
  const brandCn = tagParts[1] || "";

  // Try to get name from first line (品名：xxx)
  for (const line of lines) {
    if (line.startsWith("品名") || line.startsWith("品名：")) {
      nameCn = line.replace(/^品名[：:]?\s*/, "").replace(/[✈️🐂🌈✨👏❤️🎁]+/g, "").trim();
      break;
    }
  }

  if (!nameCn && lines[0]) {
    nameCn = lines[0].replace(/[✈️🐂🌈✨👏❤️🎁]+/g, "").trim().substring(0, 60);
  }

  name = brandEn || nameCn;

  // Clean description - remove emoji clutter
  const descClean = desc.replace(/[✈️🐂🌈✨👏❤️🎁💪🏻]+/g, "").trim();

  return { name, nameCn, descClean };
}

// ========== Image Uploader Component ==========
function ImageUploader({ value, onChange, label }: { value: string; onChange: (url: string) => void; label: string }) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadFile(file: File) {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) onChange(data.url);
    } catch (e) { console.error("Upload failed", e); }
    setUploading(false);
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div
        className={`relative border-2 border-dashed rounded-lg p-4 transition-colors cursor-pointer ${dragOver ? "border-[#C9A96E] bg-amber-50" : "border-gray-300 hover:border-[#C9A96E]"}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f?.type.startsWith("image/")) uploadFile(f); }}
        onClick={() => inputRef.current?.click()}
      >
        {uploading ? (
          <div className="py-6 text-center">
            <div className="animate-spin h-8 w-8 border-2 border-[#C9A96E] border-t-transparent rounded-full mx-auto mb-2" />
            <p className="text-sm text-gray-500">上传中...</p>
          </div>
        ) : value ? (
          <div className="relative">
            <img src={value} alt="" className="max-h-40 mx-auto object-contain rounded" />
            <button onClick={(e) => { e.stopPropagation(); onChange(""); }} className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded">删除</button>
          </div>
        ) : (
          <div className="py-6 text-center">
            <svg className="w-10 h-10 mx-auto text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <p className="text-sm text-gray-500">拖拽或点击上传图片</p>
          </div>
        )}
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadFile(f); }} />
      </div>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder="或直接粘贴图片URL" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
    </div>
  );
}

// ========== Excel + HD Images Import Component ==========
function HDImageImporter({ onImportComplete }: { onImportComplete: () => void }) {
  const [step, setStep] = useState<"excel" | "folder" | "preview" | "importing">("excel");
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [parsedProducts, setParsedProducts] = useState<any[]>([]);
  const [folderProducts, setFolderProducts] = useState<any[]>([]);
  const [matchedProducts, setMatchedProducts] = useState<any[]>([]);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, phase: "" });
  const [result, setResult] = useState<any>(null);
  const [clearExisting, setClearExisting] = useState(true);
  const [scanningFolder, setScanningFolder] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const excelRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  // Step 1: Parse Excel file
  async function parseExcel(file: File) {
    setExcelFile(file);
    setProgress({ current: 0, total: 0, phase: "解析Excel文件..." });

    const arrayBuffer = await file.arrayBuffer();
    const XLSX = (await import("xlsx")).default;
    const JSZip = (await import("jszip")).default;

    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json<any>(sheet, { header: 1 });

    setProgress({ current: 0, total: 0, phase: "提取产品图片..." });
    const zip = await JSZip.loadAsync(arrayBuffer);

    const relsFile = zip.file("xl/drawings/_rels/drawing1.xml.rels");
    const ridToImage: Record<string, string> = {};
    if (relsFile) {
      const relsXml = await relsFile.async("text");
      const parser = new DOMParser();
      const relsDoc = parser.parseFromString(relsXml, "application/xml");
      relsDoc.querySelectorAll("Relationship").forEach((rel) => {
        const id = rel.getAttribute("Id") || "";
        const target = rel.getAttribute("Target") || "";
        if (target.includes("image")) ridToImage[id] = target.replace("../media/", "");
      });
    }

    const drawingFile = zip.file("xl/drawings/drawing1.xml");
    const rowToRid: Record<number, string> = {};
    if (drawingFile) {
      const drawingXml = await drawingFile.async("text");
      const parser = new DOMParser();
      const drawingDoc = parser.parseFromString(drawingXml, "application/xml");
      const anchors = drawingDoc.querySelectorAll("twoCellAnchor, oneCellAnchor");
      let anchorList: Element[] = Array.from(anchors);
      if (anchorList.length === 0) {
        const allElements = drawingDoc.getElementsByTagName("*");
        for (let i = 0; i < allElements.length; i++) {
          const el = allElements[i];
          if (el.localName === "twoCellAnchor" || el.localName === "oneCellAnchor") anchorList.push(el);
        }
      }
      anchorList.forEach((anchor) => {
        let rowVal = -1;
        const fromElements = anchor.getElementsByTagName("*");
        for (let i = 0; i < fromElements.length; i++) {
          const el = fromElements[i];
          if (el.localName === "from") {
            const children = el.getElementsByTagName("*");
            for (let j = 0; j < children.length; j++) {
              if (children[j].localName === "row") rowVal = parseInt(children[j].textContent || "-1");
            }
          }
        }
        for (let i = 0; i < fromElements.length; i++) {
          const el = fromElements[i];
          if (el.localName === "blip") {
            const embed = el.getAttribute("r:embed") || el.getAttributeNS("http://schemas.openxmlformats.org/officeDocument/2006/relationships", "embed") || "";
            if (embed && rowVal >= 0) rowToRid[rowVal] = embed;
          }
        }
      });
    }

    const rowToImageBase64: Record<number, { data: string; mime: string }> = {};
    for (const [rowStr, rid] of Object.entries(rowToRid)) {
      const imageFile = ridToImage[rid];
      if (imageFile) {
        const zipEntry = zip.file(`xl/media/${imageFile}`);
        if (zipEntry) {
          const base64 = await zipEntry.async("base64");
          const ext = imageFile.split(".").pop()?.toLowerCase() || "jpeg";
          const mime = ext === "png" ? "image/png" : "image/jpeg";
          rowToImageBase64[parseInt(rowStr)] = { data: base64, mime };
        }
      }
    }

    const products: any[] = [];
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row || !row[1]) continue;
      const desc = String(row[1] || "");
      const tag = String(row[5] || "");
      const sourceId = String(row[4] || "");
      const searchCode = String(row[20] || "");
      const catInfo = autoCategorizeCn(tag, desc);
      const { name, nameCn, descClean } = parseProductName(desc, tag);
      const imgData = rowToImageBase64[i];
      products.push({
        name, nameCn, brand: catInfo.brand,
        category: catInfo.category, categoryName: catInfo.categoryName, categoryNameCn: catInfo.categoryNameCn,
        description: descClean, descriptionCn: descClean,
        sourceTag: tag, sourceId, searchCode,
        imageBase64: imgData?.data || "", imageMimeType: imgData?.mime || "image/jpeg", hasImage: !!imgData,
        excelIndex: i,
      });
    }

    setParsedProducts(products);
    setProgress({ current: 0, total: products.length, phase: `解析完成，共 ${products.length} 个产品（已记录Excel中的产品信息）` });
  }

  // Step 2: Handle folder selection (client-side reading)
  async function handleFolderSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setScanningFolder(true);
    setProgress({ current: 0, total: 0, phase: "正在读取文件夹..." });

    // Group files by their parent folder name using webkitRelativePath
    const folderMap: Record<string, { folderName: string; images: File[] }> = {};
    let processedCount = 0;

    for (const file of Array.from(files)) {
      // webkitRelativePath gives us the full path within the selected folder
      // e.g., "Ashley Luxury/20260504/品名：Ferrgamo../img_001.jpg"
      const relativePath = file.webkitRelativePath || file.name;
      const pathParts = relativePath.split("/").filter(Boolean);

      // Determine folder name: if path has 3+ parts, take the product folder (2nd from end)
      // e.g., ["Ashley Luxury", "20260504", "品名：Ferrgamo...", "img_001.jpg"] -> "品名：Ferrgamo..."
      let folderName: string;
      if (pathParts.length >= 3) {
        folderName = pathParts[pathParts.length - 2];
      } else if (pathParts.length === 2) {
        // Just "FolderName/img.jpg" - use parent folder
        folderName = pathParts[0];
      } else {
        folderName = "Root";
      }

      if (!folderMap[folderName]) {
        folderMap[folderName] = { folderName, images: [] };
      }
      // Add image files
      if (file.type.startsWith("image/") || /\.(jpg|jpeg|png|webp)$/i.test(file.name)) {
        folderMap[folderName].images.push(file);
      }

      processedCount++;
      if (processedCount % 100 === 0) {
        setProgress({ current: 0, total: 0, phase: `已读取 ${processedCount} 个文件...` });
      }
    }

    const products = Object.values(folderMap)
      .filter((fp) => fp.images.length > 0)
      .sort((a, b) => a.folderName.localeCompare(b.folderName));

    console.log("Folder read complete:", products.length, "folders with images");
    products.forEach((p) => {
      console.log(`  - ${p.folderName}: ${p.images.length} images`);
    });

    setFolderProducts(products);
    setScanningFolder(false);
    setProgress({ current: 0, total: products.length, phase: `读取完成，发现 ${products.length} 个产品文件夹` });

    // Reset input so same folder can be selected again
    if (folderInputRef.current) {
      folderInputRef.current.value = "";
    }
  }

  // Handle folder drag and drop
  async function handleFolderDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);

    const items = e.dataTransfer.items;
    if (!items) return;

    setScanningFolder(true);
    setProgress({ current: 0, total: 0, phase: "正在读取文件夹..." });

    const folderMap: Record<string, { folderName: string; images: File[] }> = {};

    // First, collect all top-level directories from dropped items
    const dirEntries: FileSystemDirectoryEntry[] = [];

    for (const item of Array.from(items)) {
      if (item.kind === "file") {
        const entry = item.webkitGetAsEntry ? item.webkitGetAsEntry() : null;
        if (entry && entry.isDirectory) {
          dirEntries.push(entry as FileSystemDirectoryEntry);
        }
      }
    }

    // Read each directory recursively
    for (const dirEntry of dirEntries) {
      await readDirectoryRecursive(dirEntry, folderMap);
    }

    const products = Object.values(folderMap)
      .filter((fp) => fp.images.length > 0)
      .sort((a, b) => a.folderName.localeCompare(b.folderName));

    console.log("Folder drop read complete:", products.length, "folders with images");

    setFolderProducts(products);
    setScanningFolder(false);
    setProgress({ current: 0, total: products.length, phase: `读取完成，发现 ${products.length} 个产品文件夹` });
  }

  // Helper to read directory recursively - properly handles readEntries pagination
  function readDirectoryRecursive(dirEntry: FileSystemDirectoryEntry, folderMap: Record<string, { folderName: string; images: File[] }>): Promise<void> {
    return new Promise((resolve, reject) => {
      const reader = dirEntry.createReader();
      const allEntries: FileSystemEntry[] = [];

      // Collect all entries first (readEntries may return partial results)
      const collectEntries = (): Promise<void> => {
        return new Promise((res) => {
          reader.readEntries((entries: FileSystemEntry[]) => {
            if (entries.length > 0) {
              allEntries.push(...entries);
              collectEntries().then(res);
            } else {
              res();
            }
          });
        });
      };

      collectEntries().then(() => {
        const subFolders: FileSystemDirectoryEntry[] = [];

        const processEntries = async () => {
          for (const entry of allEntries) {
            if (entry.isFile) {
              try {
                const file = await new Promise<File>((res, rej) => {
                  (entry as FileSystemFileEntry).file(res, rej);
                });
                if (file.type.startsWith("image/") || /\.(jpg|jpeg|png|webp)$/i.test(file.name)) {
                  const folderName = dirEntry.name;
                  if (!folderMap[folderName]) {
                    folderMap[folderName] = { folderName, images: [] };
                  }
                  folderMap[folderName].images.push(file);
                }
              } catch (e) {
                // Skip files we can't read
              }
            } else if (entry.isDirectory) {
              subFolders.push(entry as FileSystemDirectoryEntry);
            }
          }

          // Process subfolders
          for (const subFolder of subFolders) {
            await readDirectoryRecursive(subFolder, folderMap);
          }
          resolve();
        };

        processEntries();
      });
    });
  }

  // Step 3: Match Excel products with folder products
  function doMatch() {
    console.log("=== Starting Match ===");
    console.log("Excel products:", parsedProducts.length);
    console.log("Folder products:", folderProducts.length);

    const matched: any[] = [];
    const usedFolderIdx = new Set<number>();

    for (let ei = 0; ei < parsedProducts.length; ei++) {
      const excelProd = parsedProducts[ei];
      // Create a normalized search key from Excel product
      const excelKey = normalizeKey(excelProd.nameCn || excelProd.name || excelProd.sourceTag || "");
      console.log(`Excel[${ei}]: "${excelKey.substring(0, 30)}..."`);

      let bestMatch: any = null;
      let bestScore = 0;

      for (let i = 0; i < folderProducts.length; i++) {
        if (usedFolderIdx.has(i)) continue;
        const folderProd = folderProducts[i];
        const folderKey = normalizeKey(folderProd.folderName);
        const score = calculateMatchScore(excelKey, folderKey);

        if (score > bestScore) {
          bestScore = score;
          console.log(`  Folder[${i}] "${folderKey.substring(0, 20)}..." score: ${score.toFixed(2)}`);
          bestMatch = { ...folderProd, folderIndex: i, matchScore: score };
        }
      }

      if (bestMatch && bestScore > 0.5) {
        usedFolderIdx.add(bestMatch.folderIndex);
        matched.push({
          ...excelProd,
          folderName: bestMatch.folderName,
          hdImages: bestMatch.images,
          matchedScore: bestMatch.matchScore,
        });
        console.log(`  => MATCHED with score ${bestMatch.matchScore.toFixed(2)}`);
      } else {
        matched.push({ ...excelProd, folderName: null, hdImages: [], matchedScore: 0 });
        console.log(`  => NO MATCH (best score: ${bestScore.toFixed(2)})`);
      }
    }

    const matchedCount = matched.filter(m => m.hdImages && m.hdImages.length > 0).length;
    console.log(`=== Match Complete: ${matchedCount}/${matched.length} products matched ===`);

    setMatchedProducts(matched);
    setStep("preview");
  }

  function normalizeKey(text: string): string {
    return text
      .replace(/[✈️🐂🌈✨👏❤️🎁💪🏻]+/g, "")
      .replace(/[^\w\u4e00-\u9fff]/g, "")
      .toLowerCase();
  }

  function calculateMatchScore(key1: string, key2: string): number {
    if (!key1 || !key2) return 0;
    // Check if key1 is contained in key2 or vice versa
    if (key2.includes(key1) || key1.includes(key2)) return 0.9;
    // Word overlap scoring
    const words1 = key1.split("").filter(Boolean);
    const words2 = key2.split("").filter(Boolean);
    const overlap = words1.filter(w => words2.includes(w)).length;
    const maxLen = Math.max(words1.length, words2.length);
    return maxLen > 0 ? overlap / maxLen : 0;
  }

  // Step 4: Start import with HD images
  async function startImport() {
    if (matchedProducts.length === 0) return;
    setStep("importing");
    setImporting(true);
    setResult(null);

    const productsWithHD = matchedProducts.filter(p => p.hdImages && p.hdImages.length > 0);
    const BATCH_SIZE = 5;
    let totalSuccess = 0;
    let totalFailed = 0;
    let hdUploaded = 0;
    const allErrors: string[] = [];

    for (let i = 0; i < matchedProducts.length; i += BATCH_SIZE) {
      const batch = matchedProducts.slice(i, i + BATCH_SIZE);
      setProgress({
        current: i,
        total: matchedProducts.length,
        phase: `上传中 ${i + 1}-${Math.min(i + BATCH_SIZE, matchedProducts.length)} / ${matchedProducts.length}${productsWithHD.length > 0 ? ` (已匹配 ${hdUploaded} 个高清图)` : ""}`
      });

      try {
        // Check if any product in batch has File objects (hdImages)
        const hasFileImages = batch.some((p: any) => p.hdImages && p.hdImages.length > 0 && p.hdImages[0] instanceof File);

        if (hasFileImages) {
          // Use FormData to send files
          const formData = new FormData();
          formData.append("products", JSON.stringify(batch));
          formData.append("clearExisting", i === 0 && clearExisting ? "true" : "false");

          // Add image files with indexed keys
          batch.forEach((product: any, prodIdx: number) => {
            if (product.hdImages) {
              product.hdImages.slice(0, 10).forEach((imgFile: File, imgIdx: number) => {
                formData.append(`image_${prodIdx}_${imgIdx}`, imgFile);
              });
            }
          });

          const res = await fetch("/api/bulk-import-hd", {
            method: "POST",
            body: formData,
          });
          const data = await res.json();
          if (data.success) {
            totalSuccess += data.imported || 0;
            totalFailed += data.failed || 0;
            hdUploaded += data.hdUploaded || 0;
            if (data.errors) allErrors.push(...data.errors);
          } else {
            totalFailed += batch.length;
            allErrors.push(data.error || "Unknown error");
          }
        } else {
          // Fallback to JSON (no files to upload)
          const res = await fetch("/api/bulk-import-hd", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              products: batch,
              clearExisting: i === 0 && clearExisting,
            }),
          });
          const data = await res.json();
          if (data.success) {
            totalSuccess += data.imported || 0;
            totalFailed += data.failed || 0;
            hdUploaded += data.hdUploaded || 0;
            if (data.errors) allErrors.push(...data.errors);
          } else {
            totalFailed += batch.length;
            allErrors.push(data.error || "Unknown error");
          }
        }
      } catch (err: any) {
        totalFailed += batch.length;
        allErrors.push(err.message);
      }
    }

    setResult({ success: totalSuccess, failed: totalFailed, hdUploaded, errors: allErrors });
    setProgress({ current: matchedProducts.length, total: matchedProducts.length, phase: "导入完成！" });
    setImporting(false);
    onImportComplete();
  }

  return (
    <div className="space-y-6">
      {/* Step indicators */}
      <div className="flex items-center gap-4 mb-6">
        {["excel", "folder", "preview", "importing"].map((s, idx) => (
          <div key={s} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === s ? "bg-[#C9A96E] text-white" : "bg-gray-200 text-gray-500"}`}>
              {idx + 1}
            </div>
            <span className={`ml-2 text-sm ${step === s ? "text-[#C9A96E] font-medium" : "text-gray-400"}`}>
              {s === "excel" ? "上传Excel" : s === "folder" ? "选择图片文件夹" : s === "preview" ? "确认匹配" : "导入中"}
            </span>
            {idx < 3 && <div className="w-8 h-0.5 bg-gray-200 ml-4" />}
          </div>
        ))}
      </div>

      {/* Step 1: Excel Upload */}
      {step === "excel" && (
        <div className="bg-white rounded-xl p-8 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-[#C9A96E]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            步骤1: 上传微购相册导出的Excel文件
          </h3>
          <p className="text-sm text-gray-500 mb-4">上传包含产品信息的Excel文件，系统会解析产品名称、型号等信息用于匹配高清图片</p>
          <div
            className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-[#C9A96E] transition-colors cursor-pointer"
            onClick={() => excelRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f?.name.endsWith(".xlsx")) { parseExcel(f); setStep("folder"); } }}
          >
            {excelFile ? (
              <div>
                <svg className="w-12 h-12 mx-auto text-green-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <p className="font-medium text-gray-800">{excelFile.name}</p>
                <p className="text-sm text-gray-500 mt-1">{(excelFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            ) : (
              <div>
                <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                <p className="text-gray-600 font-medium">点击或拖拽上传 Excel 文件</p>
                <p className="text-sm text-gray-400 mt-1">支持 .xlsx 格式</p>
              </div>
            )}
            <input ref={excelRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) { parseExcel(f); setStep("folder"); } }} />
          </div>
        </div>
      )}

      {/* Step 2: Folder Selection */}
      {step === "folder" && (
        <div className="bg-white rounded-xl p-8 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-[#C9A96E]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            步骤2: 选择高清图片所在文件夹
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            点击下方按钮，选择微购相册批量下载的高清图片文件夹（会读取所有子文件夹内的图片）
          </p>

          {/* Hidden folder picker */}
          <input
            type="file"
            ref={(el: HTMLInputElement | null) => {
              folderInputRef.current = el;
              if (el) el.setAttribute("webkitdirectory", "");
            }}
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleFolderSelect}
          />

          <div className="flex gap-3 mb-4">
            <button
              onClick={() => folderInputRef.current?.click()}
              className="px-6 py-3 bg-[#C9A96E] text-white rounded-lg hover:bg-[#B8944E] font-medium flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
              选择图片文件夹
            </button>
          </div>

          {/* Drag and drop zone */}
          <div
            className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#C9A96E] transition-colors cursor-pointer"
            onClick={() => folderInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleFolderDrop}
          >
            <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
            <p className="text-gray-600 font-medium">或将整个文件夹拖拽到此处</p>
            <p className="text-sm text-gray-400 mt-1">支持 jpg、png、webp 图片</p>
          </div>

          {scanningFolder && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="animate-spin h-5 w-5 border-2 border-[#C9A96E] border-t-transparent rounded-full" />
                <p className="text-sm text-gray-600">正在读取文件夹...</p>
              </div>
            </div>
          )}

          {folderProducts.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-medium mb-3">
                读取到的产品图片 ({folderProducts.length} 个文件夹，共 {folderProducts.reduce((acc: number, fp: any) => acc + (fp.images?.length || 0), 0)} 张图)
              </h4>
              <div className="max-h-60 overflow-y-auto border rounded-lg p-3 space-y-2">
                {folderProducts.map((fp: any, i: number) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">{fp.images?.length || 0}张图</span>
                    <span className="truncate text-gray-600 flex-1">{fp.folderName.substring(0, 60)}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={doMatch}
                className="mt-4 px-8 py-3 bg-[#1A1A1A] text-white rounded-lg hover:bg-[#333] font-medium"
              >
                开始匹配产品
              </button>
            </div>
          )}
        </div>
      )}

      {/* Step 3: Preview & Confirm */}
      {step === "preview" && (
        <div className="bg-white rounded-xl p-8 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">步骤3: 确认匹配结果</h3>
          <p className="text-sm text-gray-500 mb-4">
            已将Excel中的 {parsedProducts.length} 个产品与本地 {folderProducts.length} 个图片文件夹进行匹配
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-[#1A1A1A]">{parsedProducts.length}</p>
              <p className="text-xs text-gray-500">Excel产品</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-[#1A1A1A]">{folderProducts.length}</p>
              <p className="text-xs text-gray-500">图片文件夹</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-green-600">{matchedProducts.filter(p => p.hdImages?.length > 0).length}</p>
              <p className="text-xs text-gray-500">已匹配高清图</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-yellow-600">{matchedProducts.filter(p => !p.hdImages?.length).length}</p>
              <p className="text-xs text-gray-500">未匹配(用原图)</p>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto border rounded-lg mb-6">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-2 text-left">#</th>
                  <th className="px-4 py-2 text-left">产品名称</th>
                  <th className="px-4 py-2 text-left">匹配状态</th>
                  <th className="px-4 py-2 text-left">高清图</th>
                </tr>
              </thead>
              <tbody>
                {matchedProducts.slice(0, 20).map((p: any, i: number) => (
                  <tr key={i} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2 text-gray-400">{i + 1}</td>
                    <td className="px-4 py-2 max-w-[200px] truncate">{p.nameCn || p.name}</td>
                    <td className="px-4 py-2">
                      {p.hdImages?.length > 0 ? (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">
                          ✓ {Math.round(p.matchedScore * 100)}%
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs">使用原图</span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-gray-500">
                      {p.hdImages?.length > 0 ? `${p.hdImages.length}张高清图` : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {matchedProducts.length > 20 && (
              <p className="text-center text-sm text-gray-400 py-2">... 还有 {matchedProducts.length - 20} 个产品</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={clearExisting} onChange={(e) => setClearExisting(e.target.checked)} className="rounded" />
              清除现有产品（推荐首次导入时勾选）
            </label>
            <button
              onClick={startImport}
              className="px-8 py-3 bg-[#C9A96E] text-white rounded-lg hover:bg-[#B8944E] disabled:opacity-50 font-medium"
            >
              开始导入 {matchedProducts.length} 个产品
            </button>
          </div>
        </div>
      )}

      {/* Progress */}
      {(importing || (progress.phase && progress.total > 0)) && (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">{progress.phase}</span>
            <span className="text-sm text-gray-500">{progress.current}/{progress.total}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="bg-[#C9A96E] h-3 rounded-full transition-all duration-300" style={{ width: `${progress.total > 0 ? (progress.current / progress.total) * 100 : 0}%` }} />
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className={`rounded-xl p-6 shadow-sm ${result.failed === 0 ? "bg-green-50 border border-green-200" : "bg-yellow-50 border border-yellow-200"}`}>
          <h3 className="font-semibold mb-2">{result.failed === 0 ? "导入成功！" : "导入完成（部分失败）"}</h3>
          <div className="flex gap-6 text-sm">
            <span className="text-green-600">成功: {result.success}</span>
            <span className="text-blue-600">使用高清图: {result.hdUploaded}</span>
            {result.failed > 0 && <span className="text-red-600">失败: {result.failed}</span>}
          </div>
          {result.errors.length > 0 && (
            <div className="mt-3 text-sm text-red-600">
              {result.errors.slice(0, 5).map((e: string, i: number) => <p key={i}>{e}</p>)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ========== Original Excel Import Component (kept for reference) ==========
function ExcelImporter({ onImportComplete }: { onImportComplete: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [parsedProducts, setParsedProducts] = useState<any[]>([]);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, phase: "" });
  const [result, setResult] = useState<any>(null);
  const [clearExisting, setClearExisting] = useState(true);
  const fileRef = useRef<HTMLInputElement>(null);

  async function parseExcel(file: File) {
    setProgress({ current: 0, total: 0, phase: "解析Excel文件..." });

    const arrayBuffer = await file.arrayBuffer();

    // Dynamically import libraries
    const XLSX = (await import("xlsx"));
    const JSZip = (await import("jszip")).default;

    // Parse cell data with XLSX
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json<any>(sheet, { header: 1 });

    // Extract images from the xlsx zip structure
    setProgress({ current: 0, total: 0, phase: "提取产品图片..." });
    const zip = await JSZip.loadAsync(arrayBuffer);

    // Parse drawing relationships to map rId -> image filename
    const relsFile = zip.file("xl/drawings/_rels/drawing1.xml.rels");
    const ridToImage: Record<string, string> = {};
    if (relsFile) {
      const relsXml = await relsFile.async("text");
      const parser = new DOMParser();
      const relsDoc = parser.parseFromString(relsXml, "application/xml");
      const rels = relsDoc.querySelectorAll("Relationship");
      rels.forEach((rel) => {
        const id = rel.getAttribute("Id") || "";
        const target = rel.getAttribute("Target") || "";
        if (target.includes("image")) {
          ridToImage[id] = target.replace("../media/", "");
        }
      });
    }

    // Parse drawing XML to map row -> rId
    const drawingFile = zip.file("xl/drawings/drawing1.xml");
    const rowToRid: Record<number, string> = {};
    if (drawingFile) {
      const drawingXml = await drawingFile.async("text");
      const parser = new DOMParser();
      const drawingDoc = parser.parseFromString(drawingXml, "application/xml");

      // Find all anchor elements - use getElementsByTagName since namespace prefixes vary
      const anchors = drawingDoc.querySelectorAll("twoCellAnchor, oneCellAnchor");
      // Fallback: try with namespace-agnostic approach
      let anchorList: Element[] = Array.from(anchors);
      if (anchorList.length === 0) {
        // Try to find by local name
        const allElements = drawingDoc.getElementsByTagName("*");
        for (let i = 0; i < allElements.length; i++) {
          const el = allElements[i];
          if (el.localName === "twoCellAnchor" || el.localName === "oneCellAnchor") {
            anchorList.push(el);
          }
        }
      }

      anchorList.forEach((anchor) => {
        // Find the row in <from> element
        let rowVal = -1;
        const fromElements = anchor.getElementsByTagName("*");
        for (let i = 0; i < fromElements.length; i++) {
          const el = fromElements[i];
          if (el.localName === "from") {
            const children = el.getElementsByTagName("*");
            for (let j = 0; j < children.length; j++) {
              if (children[j].localName === "row") {
                rowVal = parseInt(children[j].textContent || "-1");
              }
            }
          }
        }

        // Find the blip embed reference
        for (let i = 0; i < fromElements.length; i++) {
          const el = fromElements[i];
          if (el.localName === "blip") {
            const embed = el.getAttribute("r:embed") || el.getAttributeNS("http://schemas.openxmlformats.org/officeDocument/2006/relationships", "embed") || "";
            if (embed && rowVal >= 0) {
              rowToRid[rowVal] = embed;
            }
          }
        }
      });
    }

    // Build row -> image base64 mapping
    const rowToImageBase64: Record<number, { data: string; mime: string }> = {};
    for (const [rowStr, rid] of Object.entries(rowToRid)) {
      const imageFile = ridToImage[rid];
      if (imageFile) {
        const zipEntry = zip.file(`xl/media/${imageFile}`);
        if (zipEntry) {
          const base64 = await zipEntry.async("base64");
          const ext = imageFile.split(".").pop()?.toLowerCase() || "jpeg";
          const mime = ext === "png" ? "image/png" : "image/jpeg";
          rowToImageBase64[parseInt(rowStr)] = { data: base64, mime };
        }
      }
    }

    // Process products (skip header row)
    const products: any[] = [];
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row || !row[1]) continue; // Skip empty rows (no description)

      const desc = String(row[1] || "");
      const tag = String(row[5] || "");
      const sourceId = String(row[4] || "");
      const searchCode = String(row[20] || "");

      // Auto-categorize
      const catInfo = autoCategorizeCn(tag, desc);
      const { name, nameCn, descClean } = parseProductName(desc, tag);

      // Get image for this row (row index in drawing is 0-based, row 0 = header, so data row i maps to drawing row i)
      const imgData = rowToImageBase64[i];

      products.push({
        name,
        nameCn,
        brand: catInfo.brand,
        category: catInfo.category,
        categoryName: catInfo.categoryName,
        categoryNameCn: catInfo.categoryNameCn,
        description: descClean,
        descriptionCn: descClean,
        sourceTag: tag,
        sourceId,
        searchCode,
        imageBase64: imgData?.data || "",
        imageMimeType: imgData?.mime || "image/jpeg",
        hasImage: !!imgData,
      });
    }

    setProgress({ current: 0, total: products.length, phase: `解析完成，共 ${products.length} 个产品` });
    setParsedProducts(products);
  }

  async function startImport() {
    if (parsedProducts.length === 0) return;

    setImporting(true);
    setResult(null);

    const BATCH_SIZE = 10;
    let totalSuccess = 0;
    let totalFailed = 0;
    const allErrors: string[] = [];

    for (let i = 0; i < parsedProducts.length; i += BATCH_SIZE) {
      const batch = parsedProducts.slice(i, i + BATCH_SIZE);
      setProgress({
        current: i,
        total: parsedProducts.length,
        phase: `上传中 ${i + 1}-${Math.min(i + BATCH_SIZE, parsedProducts.length)} / ${parsedProducts.length}...`
      });

      try {
        const res = await fetch("/api/bulk-import", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            products: batch,
            clearExisting: i === 0 && clearExisting,
          }),
        });
        const data = await res.json();
        if (data.success) {
          totalSuccess += data.imported || 0;
          totalFailed += data.failed || 0;
          if (data.errors) allErrors.push(...data.errors);
        } else {
          totalFailed += batch.length;
          allErrors.push(data.error || "Unknown error");
        }
      } catch (err: any) {
        totalFailed += batch.length;
        allErrors.push(err.message);
      }
    }

    setResult({ success: totalSuccess, failed: totalFailed, errors: allErrors });
    setProgress({ current: parsedProducts.length, total: parsedProducts.length, phase: "导入完成！" });
    setImporting(false);
    onImportComplete();
  }

  return (
    <div className="space-y-6">
      {/* File Upload Area */}
      <div className="bg-white rounded-xl p-8 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-[#C9A96E]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
          上传Excel文件
        </h3>
        <p className="text-sm text-gray-500 mb-4">支持微购相册导出的 .xlsx 格式，系统会自动提取产品信息和图片，并按品牌+类型自动分类</p>

        <div
          className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-[#C9A96E] transition-colors cursor-pointer"
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f?.name.endsWith(".xlsx")) { setFile(f); parseExcel(f); } }}
        >
          {file ? (
            <div>
              <svg className="w-12 h-12 mx-auto text-green-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <p className="font-medium text-gray-800">{file.name}</p>
              <p className="text-sm text-gray-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          ) : (
            <div>
              <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              <p className="text-gray-600 font-medium">点击或拖拽上传 Excel 文件</p>
              <p className="text-sm text-gray-400 mt-1">支持 .xlsx 格式</p>
            </div>
          )}
          <input ref={fileRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) { setFile(f); parseExcel(f); }
          }} />
        </div>
      </div>

      {/* Parse Results Preview */}
      {parsedProducts.length > 0 && (
        <div className="bg-white rounded-xl p-8 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">解析结果预览</h3>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-[#1A1A1A]">{parsedProducts.length}</p>
              <p className="text-xs text-gray-500">总产品数</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-green-600">{parsedProducts.filter(p => p.hasImage).length}</p>
              <p className="text-xs text-gray-500">有图片</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-[#C9A96E]">{new Set(parsedProducts.map(p => p.brand)).size}</p>
              <p className="text-xs text-gray-500">品牌数</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">{new Set(parsedProducts.map(p => p.category)).size}</p>
              <p className="text-xs text-gray-500">分类数</p>
            </div>
          </div>

          {/* Brand breakdown */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-600 mb-2">品牌分布</h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(
                parsedProducts.reduce((acc: Record<string, number>, p) => {
                  const key = `${p.brand} - ${p.categoryName}`;
                  acc[key] = (acc[key] || 0) + 1;
                  return acc;
                }, {})
              ).map(([key, count]) => (
                <span key={key} className="px-3 py-1 bg-[#F5F4F2] rounded-full text-sm">
                  {key}: <strong>{count as number}</strong>
                </span>
              ))}
            </div>
          </div>

          {/* Preview table */}
          <div className="max-h-80 overflow-y-auto border rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-2 text-left">#</th>
                  <th className="px-4 py-2 text-left">图片</th>
                  <th className="px-4 py-2 text-left">名称</th>
                  <th className="px-4 py-2 text-left">品牌</th>
                  <th className="px-4 py-2 text-left">分类</th>
                </tr>
              </thead>
              <tbody>
                {parsedProducts.slice(0, 20).map((p, i) => (
                  <tr key={i} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2 text-gray-400">{i + 1}</td>
                    <td className="px-4 py-2">
                      {p.hasImage ? (
                        <img src={`data:${p.imageMimeType};base64,${p.imageBase64.substring(0, 100)}...`} alt="" className="w-10 h-10 object-cover rounded bg-green-50" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      ) : (
                        <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">无</div>
                      )}
                    </td>
                    <td className="px-4 py-2 max-w-[200px] truncate">{p.nameCn || p.name}</td>
                    <td className="px-4 py-2"><span className="px-2 py-0.5 bg-[#C9A96E]/10 text-[#C9A96E] rounded text-xs">{p.brand}</span></td>
                    <td className="px-4 py-2 text-gray-500">{p.categoryNameCn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {parsedProducts.length > 20 && (
              <p className="text-center text-sm text-gray-400 py-2">... 还有 {parsedProducts.length - 20} 个产品</p>
            )}
          </div>

          {/* Import options */}
          <div className="mt-6 flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={clearExisting} onChange={(e) => setClearExisting(e.target.checked)} className="rounded" />
              清除现有产品（推荐首次导入时勾选）
            </label>

            <button
              onClick={startImport}
              disabled={importing}
              className="px-8 py-3 bg-[#C9A96E] text-white rounded-lg hover:bg-[#B8944E] disabled:opacity-50 font-medium"
            >
              {importing ? "导入中..." : `开始导入 ${parsedProducts.length} 个产品`}
            </button>
          </div>
        </div>
      )}

      {/* Progress */}
      {(importing || progress.phase) && progress.total > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">{progress.phase}</span>
            <span className="text-sm text-gray-500">{progress.current}/{progress.total}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-[#C9A96E] h-3 rounded-full transition-all duration-300"
              style={{ width: `${(progress.current / progress.total) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className={`rounded-xl p-6 shadow-sm ${result.failed === 0 ? "bg-green-50 border border-green-200" : "bg-yellow-50 border border-yellow-200"}`}>
          <h3 className="font-semibold mb-2">{result.failed === 0 ? "导入成功！" : "导入完成（部分失败）"}</h3>
          <div className="flex gap-6 text-sm">
            <span className="text-green-600">成功: {result.success}</span>
            {result.failed > 0 && <span className="text-red-600">失败: {result.failed}</span>}
          </div>
          {result.errors.length > 0 && (
            <div className="mt-3 text-sm text-red-600">
              {result.errors.slice(0, 5).map((e: string, i: number) => <p key={i}>{e}</p>)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ========== HD Image Matcher Component ==========
function HDImageMatcher({ products, onMatchComplete }: { products: Product[]; onMatchComplete: () => void }) {
  const [step, setStep] = useState<"select" | "preview" | "updating">("select");
  const [folderProducts, setFolderProducts] = useState<any[]>([]);
  const [matchedProducts, setMatchedProducts] = useState<any[]>([]);
  const [scanningFolder, setScanningFolder] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, phase: "" });
  const [result, setResult] = useState<any>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  // Step 1: Handle folder selection
  async function handleFolderSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setScanningFolder(true);
    setProgress({ current: 0, total: 0, phase: "正在读取文件夹..." });

    const folderMap: Record<string, { folderName: string; images: File[] }> = {};
    let processedCount = 0;

    for (const file of Array.from(files)) {
      const relativePath = file.webkitRelativePath || file.name;
      const pathParts = relativePath.split("/").filter(Boolean);

      let folderName: string;
      if (pathParts.length >= 3) {
        folderName = pathParts[pathParts.length - 2];
      } else if (pathParts.length === 2) {
        folderName = pathParts[0];
      } else {
        folderName = "Root";
      }

      if (!folderMap[folderName]) {
        folderMap[folderName] = { folderName, images: [] };
      }
      if (file.type.startsWith("image/") || /\.(jpg|jpeg|png|webp)$/i.test(file.name)) {
        folderMap[folderName].images.push(file);
      }

      processedCount++;
      if (processedCount % 100 === 0) {
        setProgress({ current: 0, total: 0, phase: `已读取 ${processedCount} 个文件...` });
      }
    }

    const folderProds = Object.values(folderMap)
      .filter((fp) => fp.images.length > 0)
      .sort((a, b) => a.folderName.localeCompare(b.folderName));

    setFolderProducts(folderProds);
    setScanningFolder(false);
    setProgress({ current: 0, total: folderProds.length, phase: `读取完成，发现 ${folderProds.length} 个产品文件夹` });

    if (folderInputRef.current) {
      folderInputRef.current.value = "";
    }
  }

  // Step 2: Match existing products with folder images
  function doMatch() {
    const matched: any[] = [];
    const usedFolderIdx = new Set<number>();

    for (const product of products) {
      const productKey = normalizeKey(product.nameCn || product.name || "");

      let bestMatch: any = null;
      let bestScore = 0;

      for (let i = 0; i < folderProducts.length; i++) {
        if (usedFolderIdx.has(i)) continue;
        const folderProd = folderProducts[i];
        const folderKey = normalizeKey(folderProd.folderName);
        const score = calculateMatchScore(productKey, folderKey);

        if (score > bestScore) {
          bestScore = score;
          bestMatch = { ...folderProd, folderIndex: i, matchScore: score };
        }
      }

      if (bestMatch && bestScore > 0.5) {
        usedFolderIdx.add(bestMatch.folderIndex);
        matched.push({
          product,
          folderName: bestMatch.folderName,
          hdImages: bestMatch.images,
          matchedScore: bestMatch.matchScore,
          isNew: false,
        });
      }
    }

    const matchedCount = matched.filter(m => m.hdImages && m.hdImages.length > 0).length;
    setMatchedProducts(matched);
    setStep("preview");
  }

  function normalizeKey(text: string): string {
    return text
      .replace(/[✈️🐂🌈✨👏❤️🎁💪🏻]+/g, "")
      .replace(/[^\w\u4e00-\u9fff]/g, "")
      .toLowerCase();
  }

  function calculateMatchScore(key1: string, key2: string): number {
    if (!key1 || !key2) return 0;
    if (key2.includes(key1) || key1.includes(key2)) return 0.9;
    const words1 = key1.split("").filter(Boolean);
    const words2 = key2.split("").filter(Boolean);
    const overlap = words1.filter(w => words2.includes(w)).length;
    const maxLen = Math.max(words1.length, words2.length);
    return maxLen > 0 ? overlap / maxLen : 0;
  }

  // Step 3: Upload and update matched products
  async function startUpdate() {
    const matchedWithImages = matchedProducts.filter(p => p.hdImages && p.hdImages.length > 0);
    if (matchedWithImages.length === 0) return;

    setStep("updating");
    setResult(null);

    const CONCURRENCY = 5; // 并行上传数量限制
    let successCount = 0;
    let failCount = 0;
    const errors: string[] = [];
    const totalImages = matchedWithImages.reduce((sum, m) => Math.min(m.hdImages.length, 10), 0);
    let uploadedImages = 0;

    // Helper: 上传单张图片
    async function uploadImage(file: File): Promise<string | null> {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        return data.url || null;
      } catch {
        return null;
      }
    }

    // Helper: 并行上传一组图片
    async function uploadImagesInParallel(files: File[], concurrency: number): Promise<string[]> {
      const results: string[] = [];
      for (let i = 0; i < files.length; i += concurrency) {
        const batch = files.slice(i, i + concurrency);
        const uploaded = await Promise.all(batch.map(f => uploadImage(f)));
        results.push(...uploaded.filter((url): url is string => url !== null));
        uploadedImages += batch.length;
        setProgress({
          current: uploadedImages,
          total: totalImages,
          phase: `上传图片 ${uploadedImages}/${totalImages}`
        });
      }
      return results;
    }

    // Helper: 更新单个产品
    async function updateProduct(item: any, mainImageUrl: string, detailImages: string[]): Promise<boolean> {
      const updatedProduct = {
        ...item.product,
        mainImage: mainImageUrl,
        detailImages: detailImages.length > 0 ? detailImages : [mainImageUrl],
        specs: item.product.specs.map((spec: any, idx: number) => ({
          ...spec,
          image: idx === 0 ? mainImageUrl : (spec.image || mainImageUrl),
        })),
      };

      try {
        const res = await fetch("/api/products", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ products: [updatedProduct] }),
        });
        const data = await res.json();
        return !!(data.success || data.products);
      } catch {
        return false;
      }
    }

    // 阶段1: 并行上传所有图片
    setProgress({ current: 0, total: totalImages, phase: "准备上传..." });

    // 为每个产品准备上传任务
    const uploadTasks: Array<{
      item: any;
      imageFiles: File[];
    }> = matchedWithImages.map(item => ({
      item,
      imageFiles: Array.from(item.hdImages as File[]).slice(0, 10),
    }));

    // 并行处理所有产品的图片上传
    const uploadedResults: Array<{
      item: any;
      mainImageUrl: string;
      detailImages: string[];
      success: boolean;
    }> = [];

    for (const task of uploadTasks) {
      const { item, imageFiles } = task;
      const urls = await uploadImagesInParallel(imageFiles, CONCURRENCY);

      if (urls.length > 0) {
        uploadedResults.push({
          item,
          mainImageUrl: urls[0],
          detailImages: urls.slice(1),
          success: true,
        });
      } else {
        uploadedResults.push({
          item,
          mainImageUrl: "",
          detailImages: [],
          success: false,
        });
      }
    }

    // 阶段2: 并行更新产品信息
    setProgress({ current: 0, total: uploadedResults.length, phase: "更新产品信息..." });

    const updateTasks = uploadedResults.map((r, i) => async () => {
      setProgress({ current: i, total: uploadedResults.length, phase: `更新产品 ${i + 1}/${uploadedResults.length}` });
      if (r.success && r.mainImageUrl) {
        const ok = await updateProduct(r.item, r.mainImageUrl, r.detailImages);
        return ok;
      }
      return false;
    });

    // 并行执行更新
    const updateResults = await Promise.all(updateTasks.map(t => t()));

    // 统计结果
    for (let i = 0; i < updateResults.length; i++) {
      if (updateResults[i]) {
        successCount++;
      } else {
        failCount++;
        const item = uploadedResults[i].item;
        errors.push(`Failed: ${item.product.nameCn || item.product.name}`);
      }
    }

    setResult({ success: successCount, failed: failCount, errors });
    setProgress({ current: totalImages, total: totalImages, phase: "更新完成！" });
    onMatchComplete();
  }

  return (
    <div className="space-y-4">
      {/* Hidden folder picker */}
      <input
        type="file"
        ref={(el: HTMLInputElement | null) => {
          folderInputRef.current = el;
          if (el) el.setAttribute("webkitdirectory", "");
        }}
        multiple
        accept="image/*"
        className="hidden"
        onChange={handleFolderSelect}
      />

      {/* Step 1: Select Folder */}
      {step === "select" && (
        <div>
          <div
            className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[#C9A96E] transition-colors cursor-pointer"
            onClick={() => folderInputRef.current?.click()}
          >
            <svg className="w-10 h-10 mx-auto text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
            <p className="text-gray-600 font-medium">选择高清图片文件夹</p>
            <p className="text-sm text-gray-400 mt-1">包含产品图片的文件夹（系统会自动按名称匹配）</p>
          </div>

          {scanningFolder && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="animate-spin h-5 w-5 border-2 border-[#C9A96E] border-t-transparent rounded-full" />
                <p className="text-sm text-gray-600">{progress.phase}</p>
              </div>
            </div>
          )}

          {folderProducts.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">
                发现 {folderProducts.length} 个产品文件夹，共 {folderProducts.reduce((acc: number, fp: any) => acc + (fp.images?.length || 0), 0)} 张图片
              </h4>
              <div className="max-h-40 overflow-y-auto border rounded-lg p-3 space-y-2">
                {folderProducts.map((fp: any, i: number) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">{fp.images?.length || 0}张</span>
                    <span className="truncate text-gray-600 flex-1">{fp.folderName.substring(0, 50)}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={doMatch}
                className="mt-4 w-full px-6 py-3 bg-[#1A1A1A] text-white rounded-lg hover:bg-[#333] font-medium"
              >
                开始匹配 {folderProducts.length} 个图片夹 → {products.length} 个产品
              </button>
            </div>
          )}

          {folderProducts.length === 0 && !scanningFolder && (
            <p className="text-sm text-gray-400 mt-3 text-center">
              当前数据库有 {products.length} 个产品，请先导入产品后再匹配高清图
            </p>
          )}
        </div>
      )}

      {/* Step 2: Preview Matches */}
      {step === "preview" && (
        <div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-xl font-bold text-[#1A1A1A]">{products.length}</p>
              <p className="text-xs text-gray-500">产品总数</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-xl font-bold text-[#1A1A1A]">{folderProducts.length}</p>
              <p className="text-xs text-gray-500">图片文件夹</p>
            </div>
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <p className="text-xl font-bold text-green-600">{matchedProducts.filter(p => p.hdImages?.length > 0).length}</p>
              <p className="text-xs text-gray-500">已匹配</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-3 text-center">
              <p className="text-xl font-bold text-yellow-600">{matchedProducts.filter(p => !p.hdImages?.length).length}</p>
              <p className="text-xs text-gray-500">未匹配</p>
            </div>
          </div>

          <div className="max-h-60 overflow-y-auto border rounded-lg mb-4">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-3 py-2 text-left">产品</th>
                  <th className="px-3 py-2 text-left">匹配</th>
                  <th className="px-3 py-2 text-left">图片</th>
                </tr>
              </thead>
              <tbody>
                {matchedProducts.slice(0, 15).map((m: any, i: number) => (
                  <tr key={i} className="border-t hover:bg-gray-50">
                    <td className="px-3 py-2 max-w-[150px] truncate">{m.product.nameCn || m.product.name}</td>
                    <td className="px-3 py-2">
                      {m.hdImages?.length > 0 ? (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">
                          ✓ {Math.round(m.matchedScore * 100)}%
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs">未匹配</span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-gray-500">
                      {m.hdImages?.length > 0 ? `${m.hdImages.length}张` : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {matchedProducts.length > 15 && (
              <p className="text-center text-xs text-gray-400 py-2">... 还有 {matchedProducts.length - 15} 个</p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep("select")}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
            >
              返回重选
            </button>
            <button
              onClick={startUpdate}
              disabled={matchedProducts.filter(p => p.hdImages?.length > 0).length === 0}
              className="flex-1 px-6 py-3 bg-[#C9A96E] text-white rounded-lg hover:bg-[#B8944E] disabled:opacity-50 font-medium"
            >
              更新 {matchedProducts.filter(p => p.hdImages?.length > 0).length} 个产品的图片
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Updating */}
      {step === "updating" && (
        <div>
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="animate-spin h-6 w-6 border-2 border-[#C9A96E] border-t-transparent rounded-full" />
              <span className="font-medium">正在上传高清图片...</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div
                className="bg-[#C9A96E] h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress.total > 0 ? (progress.current / progress.total) * 100 : 0}%` }}
              />
            </div>
            <p className="text-sm text-gray-500">{progress.phase}</p>
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className={`rounded-xl p-4 ${result.failed === 0 ? "bg-green-50 border border-green-200" : "bg-yellow-50 border border-yellow-200"}`}>
          <h4 className="font-semibold mb-2">{result.failed === 0 ? "更新成功！" : "更新完成（部分失败）"}</h4>
          <div className="flex gap-4 text-sm">
            <span className="text-green-600">成功: {result.success}</span>
            {result.failed > 0 && <span className="text-red-600">失败: {result.failed}</span>}
          </div>
          {result.errors.length > 0 && (
            <div className="mt-2 text-xs text-red-500">
              {result.errors.slice(0, 3).map((e: string, i: number) => <p key={i}>{e}</p>)}
            </div>
          )}
          <button
            onClick={() => { setStep("select"); setFolderProducts([]); setMatchedProducts([]); setResult(null); }}
            className="mt-3 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
          >
            继续匹配
          </button>
        </div>
      )}
    </div>
  );
}

// ========== Main Admin Page ==========
export default function AdminPage() {
  const [tab, setTab] = useState<"dashboard" | "import" | "products" | "config" | "siteImages">("dashboard");
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState({ whatsapp: "" });
  const [siteImages, setSiteImages] = useState<SiteImages>({ hero: { image: "", title: "The New Collection" }, newArrivals: { left: "", right: "" }, womenswear: { main: "", secondary: "" }, menswear: { main: "", secondary: "" }, journal: { post1: "", post2: "", post3: "" } });
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [search, setSearch] = useState("");
  const [filterBrand, setFilterBrand] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [recategorizing, setRecategorizing] = useState(false);
  const [recategorizeResult, setRecategorizeResult] = useState<any>(null);
  const [batchEditOpen, setBatchEditOpen] = useState(false);
  const [batchBrand, setBatchBrand] = useState("");
  const [batchCategory, setBatchCategory] = useState("");
  const ADMIN_PASS = "zang1314";
  const [authed, setAuthed] = useState(
    typeof window !== "undefined" ? sessionStorage.getItem("noreva_admin") === "1" : false
  );
  const [passInput, setPassInput] = useState("");
  const PAGE_SIZE = 20;

  async function fetchAll() {
    if (!authed) return;
    try {
      const [c, p, si] = await Promise.all([
        fetch("/api/config").then(r => r.json()),
        fetch("/api/products").then(r => r.json()),
        fetch("/api/site-images").then(r => r.json())
      ]);
      setConfig(c); setProducts(p || []);
      const loaded: SiteImages = {
        hero: { image: si?.hero?.image || "", title: si?.hero?.title || "The New Collection" },
        newArrivals: { left: si?.newArrivals?.left || "", right: si?.newArrivals?.right || "" },
        womenswear: { main: si?.womenswear?.main || "", secondary: si?.womenswear?.secondary || "" },
        menswear: { main: si?.menswear?.main || "", secondary: si?.menswear?.secondary || "" },
        journal: { post1: si?.journal?.post1 || "", post2: si?.journal?.post2 || "", post3: si?.journal?.post3 || "" },
      };
      setSiteImages(loaded);
      setLoading(false);
    } catch { setLoading(false); }
  }

  useEffect(() => { if (authed) fetchAll(); }, [authed]);

  // Stats
  const brands = [...new Set(products.map(p => p.brand).filter(Boolean))];
  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
  const brandStats = brands.map(b => ({ brand: b, count: products.filter(p => p.brand === b).length })).sort((a, b) => b.count - a.count);
  const categoryStats = categories.map(c => {
    const cat = Object.values(CATEGORY_TREE).flatMap(g => Object.entries(g.subcategories)).find(([k]) => k === c);
    return { category: c, name: cat?.[1]?.nameCn || c, count: products.filter(p => p.category === c).length };
  }).sort((a, b) => b.count - a.count);

  // Filtered products
  const filtered = products.filter(p => {
    if (search && !p.name?.toLowerCase().includes(search.toLowerCase()) && !p.nameCn?.includes(search) && !p.brand?.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterBrand !== "all" && p.brand !== filterBrand) return false;
    if (filterCategory !== "all" && p.category !== filterCategory) return false;
    return true;
  });
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Batch actions
  async function batchDelete() {
    if (selectedIds.size === 0) return;
    if (!confirm(`确定删除选中的 ${selectedIds.size} 个产品？`)) return;
    await fetch("/api/products", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ids: Array.from(selectedIds) }) });
    setSelectedIds(new Set());
    await fetchAll();
  }

  async function deleteAll() {
    if (!confirm(`确定删除全部 ${products.length} 个产品？此操作不可撤销！`)) return;
    if (!confirm(`再次确认：删除全部 ${products.length} 个产品？`)) return;
    await fetch("/api/products", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ids: products.map(p => p.id) }) });
    await fetchAll();
  }

  async function recategorize() {
    setRecategorizing(true);
    setRecategorizeResult(null);
    try {
      const res = await fetch("/api/recategorize", { method: "POST" });
      const data = await res.json();
      setRecategorizeResult(data);
      if (data.success) await fetchAll();
    } catch (err: any) {
      setRecategorizeResult({ error: err.message });
    }
    setRecategorizing(false);
  }

  async function deleteProduct(id: string) {
    if (!confirm("确定删除此产品？")) return;
    await fetch("/api/products", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    await fetchAll();
  }

  async function batchEdit() {
    if (selectedIds.size === 0) return;
    const updates: Partial<Product> = {};
    if (batchBrand) updates.brand = batchBrand;
    if (batchCategory) {
      const sub = Object.values(CATEGORY_TREE).flatMap(g => Object.entries(g.subcategories)).find(([k]) => k === batchCategory);
      if (sub) { updates.category = batchCategory; updates.categoryName = sub[1].name; updates.categoryNameCn = sub[1].nameCn; }
    }
    if (Object.keys(updates).length === 0) return;
    const updated = products.map(p => selectedIds.has(p.id) ? { ...p, ...updates } : p);
    await fetch("/api/products", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ products: updated }) });
    setBatchEditOpen(false); setBatchBrand(""); setBatchCategory(""); setSelectedIds(new Set());
    await fetchAll();
  }

  function exportData(format: "csv" | "json") {
    const data = filtered.length > 0 ? filtered : products;
    let content: string, mime: string, ext: string;
    if (format === "json") {
      content = JSON.stringify(data, null, 2);
      mime = "application/json"; ext = "json";
    } else {
      const headers = ["id","name","nameCn","brand","category","categoryName","categoryNameCn","description","mainImage","createdAt"];
      const rows = data.map(p => headers.map(h => `"${String((p as any)[h] || "").replace(/"/g, '""')}"`).join(","));
      content = [headers.join(","), ...rows].join("\n");
      mime = "text/csv"; ext = "csv";
    }
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `noreva-products.${ext}`; a.click();
    URL.revokeObjectURL(url);
  }

  async function saveConfig() {
    await fetch("/api/config", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(config) });
    alert("已保存！");
  }

  async function saveSiteImages() {
    await fetch("/api/site-images", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(siteImages) });
    alert("已保存！");
  }

  async function saveProduct(p: Product) {
    const method = editing ? "PUT" : "POST";
    await fetch("/api/products", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(p) });
    setEditing(null);
    await fetchAll();
  }

  function toggleSelect(id: string) {
    const s = new Set(selectedIds);
    if (s.has(id)) s.delete(id); else s.add(id);
    setSelectedIds(s);
  }

  function selectAllOnPage() {
    const s = new Set(selectedIds);
    const allSelected = paged.every(p => s.has(p.id));
    paged.forEach(p => allSelected ? s.delete(p.id) : s.add(p.id));
    setSelectedIds(s);
  }

  // Password gate — before loading or any render
  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl p-8 shadow-sm w-full max-w-sm text-center space-y-6">
          <h1 className="font-display text-2xl font-light text-[#1A1A1A]">NOREVA Admin</h1>
          <input
            type="password"
            value={passInput}
            onChange={e => setPassInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter") {
                const ok = passInput === ADMIN_PASS;
                if (ok) sessionStorage.setItem("noreva_admin", "1");
                setAuthed(ok);
              }
            }}
            placeholder="请输入访问密码"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-center font-body text-sm"
          />
          <button
            disabled={!passInput}
            onClick={() => {
              const ok = passInput === ADMIN_PASS;
              if (ok) sessionStorage.setItem("noreva_admin", "1");
              setAuthed(ok);
            }}
            className="w-full py-3 bg-[#1A1A1A] text-white font-body text-xs tracking-[0.2em] hover:bg-[#333] transition-colors"
          >
            进入后台
          </button>
          {passInput && passInput !== ADMIN_PASS && (
            <p className="text-red-500 text-xs">密码错误，请重试</p>
          )}
        </div>
      </div>
    );
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin h-8 w-8 border-2 border-[#C9A96E] border-t-transparent rounded-full" /></div>;

  const TABS = [
    { key: "dashboard" as const, label: "数据概览", icon: "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" },
    { key: "import" as const, label: "导入产品", icon: "M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" },
    { key: "products" as const, label: `产品管理 (${products.length})`, icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
    { key: "siteImages" as const, label: "网站图片", icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" },
    { key: "config" as const, label: "网站配置", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar + Header */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-60 bg-[#1A1A1A] min-h-screen fixed left-0 top-0 z-40">
          <div className="p-6">
            <h1 className="text-white text-lg font-semibold tracking-wider">NOREVA</h1>
            <p className="text-gray-500 text-xs mt-1">管理后台</p>
          </div>
          <nav className="mt-2">
            {TABS.map(t => (
              <button
                key={t.key}
                onClick={() => { setTab(t.key); setPage(1); }}
                className={`w-full flex items-center gap-3 px-6 py-3 text-sm transition-colors ${tab === t.key ? "bg-white/10 text-[#C9A96E] border-r-2 border-[#C9A96E]" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={t.icon} /></svg>
                {t.label}
              </button>
            ))}
          </nav>
          <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10">
            <a href="/" target="_blank" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              查看前台
            </a>
          </div>
        </aside>

        {/* Main Content */}
        <main className="ml-60 flex-1 p-8">
          {/* ===== Dashboard ===== */}
          {tab === "dashboard" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">数据概览</h2>

              {/* Overview cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <p className="text-3xl font-bold">{products.length}</p>
                  <p className="text-sm text-gray-500 mt-1">总产品数</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <p className="text-3xl font-bold text-[#C9A96E]">{brands.length}</p>
                  <p className="text-sm text-gray-500 mt-1">品牌数</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <p className="text-3xl font-bold text-blue-600">{categories.length}</p>
                  <p className="text-sm text-gray-500 mt-1">分类数</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <p className="text-3xl font-bold text-green-600">{products.filter(p => p.mainImage).length}</p>
                  <p className="text-sm text-gray-500 mt-1">有图产品</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold mb-4">快捷操作</h3>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={recategorize}
                    disabled={recategorizing || products.length === 0}
                    className="px-5 py-2.5 bg-[#C9A96E] text-white rounded-lg text-sm hover:bg-[#B8944E] disabled:opacity-50 flex items-center gap-2"
                  >
                    {recategorizing ? (
                      <><div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" /> 修正中...</>
                    ) : (
                      <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg> 一键修正分类</>
                    )}
                  </button>
                  <button onClick={() => setTab("import")} className="px-5 py-2.5 bg-[#1A1A1A] text-white rounded-lg text-sm hover:bg-[#333] flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                    导入产品
                  </button>
                  <button onClick={() => setTab("products")} className="px-5 py-2.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                    管理产品
                  </button>
                </div>

                {/* Recategorize result */}
                {recategorizeResult && (
                  <div className={`mt-4 p-4 rounded-lg text-sm ${recategorizeResult.error ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
                    {recategorizeResult.error ? (
                      <p>修正失败: {recategorizeResult.error}</p>
                    ) : (
                      <div>
                        <p className="font-medium">修正完成！共 {recategorizeResult.total} 个产品，修正了 {recategorizeResult.updated} 个</p>
                        {recategorizeResult.changes?.length > 0 && (
                          <div className="mt-2 max-h-40 overflow-y-auto">
                            {recategorizeResult.changes.map((c: any, i: number) => (
                              <p key={i} className="text-xs text-green-600">
                                {c.name}: {c.oldCategory}→{c.newCategory} {c.oldBrand !== c.newBrand ? `| ${c.oldBrand}→${c.newBrand}` : ""}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Brand & Category breakdown */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="font-semibold mb-4">品牌分布</h3>
                  {brandStats.length === 0 ? <p className="text-gray-400 text-sm">暂无数据</p> : (
                    <div className="space-y-3">
                      {brandStats.map(b => (
                        <div key={b.brand}>
                          <div className="flex justify-between text-sm mb-1">
                            <span>{b.brand}</span>
                            <span className="text-gray-500">{b.count}</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2">
                            <div className="bg-[#C9A96E] h-2 rounded-full" style={{ width: `${(b.count / products.length) * 100}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="font-semibold mb-4">分类分布</h3>
                  {categoryStats.length === 0 ? <p className="text-gray-400 text-sm">暂无数据</p> : (
                    <div className="space-y-3">
                      {categoryStats.map(c => (
                        <div key={c.category}>
                          <div className="flex justify-between text-sm mb-1">
                            <span>{c.name}</span>
                            <span className="text-gray-500">{c.count}</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(c.count / products.length) * 100}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ===== Import Tab ===== */}
          {tab === "import" && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">导入产品</h2>
              <div className="grid grid-cols-2 gap-6">
                {/* Left: Original Excel Import */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-[#C9A96E]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    导入产品
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">上传微购相册导出的Excel文件，导入产品信息（不包含高清图片）</p>
                  <ExcelImporter onImportComplete={fetchAll} />
                </div>

                {/* Right: HD Image Matching */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-[#C9A96E]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    匹配高清图
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">为已导入的产品匹配本地文件夹中的高清图片（自动按产品名称匹配）</p>
                  <HDImageMatcher products={products} onMatchComplete={fetchAll} />
                </div>
              </div>
            </div>
          )}

          {/* ===== Products Tab ===== */}
          {tab === "products" && (
            <div className="space-y-4">
              {editing ? (
                /* Product Edit Form */
                <ProductEditForm product={editing} onSave={saveProduct} onCancel={() => setEditing(null)} />
              ) : (
                <>
                  {/* Toolbar */}
                  <div className="flex flex-wrap items-center gap-3 justify-between">
                    <h2 className="text-2xl font-semibold">产品管理</h2>
                    <div className="flex gap-2">
                      {selectedIds.size > 0 && (
                        <>
                          <button onClick={() => setBatchEditOpen(true)} className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600">
                            批量编辑 ({selectedIds.size})
                          </button>
                          <button onClick={batchDelete} className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600">
                            删除选中 ({selectedIds.size})
                          </button>
                        </>
                      )}
                      <button onClick={() => exportData("csv")} className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50" title="导出CSV">
                        CSV
                      </button>
                      <button onClick={() => exportData("json")} className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50" title="导出JSON">
                        JSON
                      </button>
                      {products.length > 0 && (
                        <button onClick={deleteAll} className="px-4 py-2 border border-red-300 text-red-500 rounded-lg text-sm hover:bg-red-50">
                          清空全部
                        </button>
                      )}
                      <button onClick={() => setEditing({ id: "", name: "", brand: "", category: "belts", categoryName: "Belts", price: 0, currency: "USD", description: "", mainImage: "", specs: [], detailImages: [], createdAt: new Date().toISOString().split("T")[0] })} className="px-4 py-2 bg-[#1A1A1A] text-white rounded-lg text-sm hover:bg-[#333]">
                        + 新增产品
                      </button>
                    </div>
                  </div>

                  {/* Batch Edit Modal */}
                  {batchEditOpen && (
                    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center" onClick={() => setBatchEditOpen(false)}>
                      <div className="bg-white rounded-xl p-6 shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-semibold mb-4">批量编辑 ({selectedIds.size} 个产品)</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm text-gray-600">修改品牌（留空不修改）</label>
                            <input value={batchBrand} onChange={e => setBatchBrand(e.target.value)} placeholder="e.g. Ferragamo" className="w-full p-2 border rounded mt-1" />
                          </div>
                          <div>
                            <label className="text-sm text-gray-600">修改分类（留空不修改）</label>
                            <select value={batchCategory} onChange={e => setBatchCategory(e.target.value)} className="w-full p-2 border rounded mt-1">
                              <option value="">不修改</option>
                              {Object.entries(CATEGORY_TREE).map(([gk, group]) => (
                                <optgroup key={gk} label={`${group.name} (${group.nameCn})`}>
                                  {Object.entries(group.subcategories).map(([sk, sub]) => (
                                    <option key={sk} value={sk}>{sub.name} - {sub.nameCn}</option>
                                  ))}
                                </optgroup>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                          <button onClick={batchEdit} className="px-6 py-2 bg-[#1A1A1A] text-white rounded-lg hover:bg-[#333] text-sm">确认修改</button>
                          <button onClick={() => setBatchEditOpen(false)} className="px-6 py-2 border rounded-lg hover:bg-gray-50 text-sm">取消</button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Filters */}
                  <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
                    {/* Search bar */}
                    <div className="relative">
                      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                      <input
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        placeholder="搜索产品名称、品牌..."
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/30"
                      />
                    </div>

                    {/* Brand filter chips */}
                    <div>
                      <p className="text-xs text-gray-400 mb-2">品牌筛选</p>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => { setFilterBrand("all"); setPage(1); }}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${filterBrand === "all" ? "bg-[#C9A96E] text-white shadow-sm" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
                        >
                          全部 ({products.length})
                        </button>
                        {brandStats.map(b => (
                          <button
                            key={b.brand}
                            onClick={() => { setFilterBrand(b.brand); setPage(1); }}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${filterBrand === b.brand ? "bg-[#C9A96E] text-white shadow-sm" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
                          >
                            {b.brand} ({b.count})
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Category filter chips */}
                    <div>
                      <p className="text-xs text-gray-400 mb-2">分类筛选</p>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => { setFilterCategory("all"); setPage(1); }}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${filterCategory === "all" ? "bg-blue-500 text-white shadow-sm" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
                        >
                          全部
                        </button>
                        {categoryStats.map(c => (
                          <button
                            key={c.category}
                            onClick={() => { setFilterCategory(c.category); setPage(1); }}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${filterCategory === c.category ? "bg-blue-500 text-white shadow-sm" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
                          >
                            {c.name} ({c.count})
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Active filter summary */}
                    <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                      <span className="text-sm text-gray-500">{filtered.length} 个结果</span>
                      {(filterBrand !== "all" || filterCategory !== "all" || search) && (
                        <button
                          onClick={() => { setFilterBrand("all"); setFilterCategory("all"); setSearch(""); setPage(1); }}
                          className="text-xs text-[#C9A96E] hover:underline"
                        >
                          清除筛选
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Product Table */}
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-4 py-3 text-left w-10">
                            <input type="checkbox" onChange={selectAllOnPage} checked={paged.length > 0 && paged.every(p => selectedIds.has(p.id))} className="rounded" />
                          </th>
                          <th className="px-4 py-3 text-left w-16">图片</th>
                          <th className="px-4 py-3 text-left">名称</th>
                          <th className="px-4 py-3 text-left">品牌</th>
                          <th className="px-4 py-3 text-left">分类</th>
                          <th className="px-4 py-3 text-left">日期</th>
                          <th className="px-4 py-3 text-right">操作</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paged.map(p => (
                          <tr key={p.id} className={`border-t hover:bg-gray-50 ${selectedIds.has(p.id) ? "bg-blue-50" : ""}`}>
                            <td className="px-4 py-3">
                              <input type="checkbox" checked={selectedIds.has(p.id)} onChange={() => toggleSelect(p.id)} className="rounded" />
                            </td>
                            <td className="px-4 py-3">
                              {p.mainImage ? (
                                <img src={p.mainImage} alt="" className="w-12 h-12 object-cover rounded" />
                              ) : (
                                <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-gray-300">
                                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                </div>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <p className="font-medium truncate max-w-[200px]">{p.nameCn || p.name || "未命名"}</p>
                              {p.name && p.nameCn && <p className="text-xs text-gray-400 truncate max-w-[200px]">{p.name}</p>}
                            </td>
                            <td className="px-4 py-3">
                              <span className="px-2 py-0.5 bg-[#C9A96E]/10 text-[#C9A96E] rounded text-xs font-medium">{p.brand || "-"}</span>
                            </td>
                            <td className="px-4 py-3 text-gray-500">{p.categoryNameCn || p.categoryName || p.category}</td>
                            <td className="px-4 py-3 text-gray-400 text-xs">{p.createdAt}</td>
                            <td className="px-4 py-3 text-right">
                              <button onClick={() => setEditing(p)} className="text-[#C9A96E] hover:underline text-xs mr-3">编辑</button>
                              <button onClick={() => deleteProduct(p.id)} className="text-red-500 hover:underline text-xs">删除</button>
                            </td>
                          </tr>
                        ))}
                        {paged.length === 0 && (
                          <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-400">暂无产品</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="px-3 py-1 border rounded text-sm disabled:opacity-30">上一页</button>
                      {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                        let p: number;
                        if (totalPages <= 7) p = i + 1;
                        else if (page <= 4) p = i + 1;
                        else if (page >= totalPages - 3) p = totalPages - 6 + i;
                        else p = page - 3 + i;
                        return (
                          <button key={p} onClick={() => setPage(p)} className={`px-3 py-1 rounded text-sm ${p === page ? "bg-[#1A1A1A] text-white" : "border hover:bg-gray-50"}`}>{p}</button>
                        );
                      })}
                      <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="px-3 py-1 border rounded text-sm disabled:opacity-30">下一页</button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* ===== Site Images Tab ===== */}
          {tab === "siteImages" && (
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h2 className="text-2xl font-semibold mb-6">网站图片</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <ImageUploader value={siteImages.hero.image} onChange={v => setSiteImages({ ...siteImages, hero: { ...siteImages.hero, image: v } })} label="Hero主图" />
                <div>
                  <label className="block text-sm font-medium mb-2">Hero标题</label>
                  <input value={siteImages.hero.title} onChange={e => setSiteImages({ ...siteImages, hero: { ...siteImages.hero, title: e.target.value } })} className="w-full p-3 border rounded-lg" />
                </div>
                <ImageUploader value={siteImages.newArrivals.left} onChange={v => setSiteImages({ ...siteImages, newArrivals: { ...siteImages.newArrivals, left: v } })} label="New Arrivals 左图" />
                <ImageUploader value={siteImages.newArrivals.right} onChange={v => setSiteImages({ ...siteImages, newArrivals: { ...siteImages.newArrivals, right: v } })} label="New Arrivals 右图" />
                <ImageUploader value={siteImages.womenswear.secondary} onChange={v => setSiteImages({ ...siteImages, womenswear: { ...siteImages.womenswear, secondary: v } })} label="女装副图" />
                <ImageUploader value={siteImages.menswear.main} onChange={v => setSiteImages({ ...siteImages, menswear: { ...siteImages.menswear, main: v } })} label="男装主图" />
                <ImageUploader value={siteImages.menswear.secondary} onChange={v => setSiteImages({ ...siteImages, menswear: { ...siteImages.menswear, secondary: v } })} label="男装副图" />
              </div>
              <button onClick={saveSiteImages} className="mt-6 px-6 py-3 bg-[#1A1A1A] text-white rounded-lg hover:bg-[#333]">保存</button>
            </div>
          )}

          {/* ===== Config Tab ===== */}
          {tab === "config" && (
            <div className="bg-white rounded-xl p-8 shadow-sm max-w-xl">
              <h2 className="text-2xl font-semibold mb-6">网站配置</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">WhatsApp 号码</label>
                  <input value={config.whatsapp || ""} onChange={e => setConfig({ ...config, whatsapp: e.target.value })} className="w-full p-3 border rounded-lg" placeholder="例如: 8618508036618" />
                  <p className="text-xs text-gray-400 mt-1">客户点击询价按钮时会通过此号码联系你</p>
                </div>
                <button onClick={saveConfig} className="px-6 py-3 bg-[#1A1A1A] text-white rounded-lg hover:bg-[#333]">保存</button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// ========== Product Edit Form Component ==========
function ProductEditForm({ product, onSave, onCancel }: { product: Product; onSave: (p: Product) => void; onCancel: () => void }) {
  const [p, setP] = useState<Product>({ ...product });
  const isNew = !product.id;

  const allSubcategories = Object.values(CATEGORY_TREE).flatMap(g =>
    Object.entries(g.subcategories).map(([key, val]) => ({ key, ...val }))
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">{isNew ? "新增产品" : "编辑产品"}</h2>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 text-sm">返回列表</button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Basic Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold mb-4">基本信息</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">名称(EN)</label>
                <input value={p.name || ""} onChange={e => setP({ ...p, name: e.target.value })} className="w-full p-2 border rounded mt-1" />
              </div>
              <div>
                <label className="text-sm text-gray-600">名称(CN)</label>
                <input value={p.nameCn || ""} onChange={e => setP({ ...p, nameCn: e.target.value })} className="w-full p-2 border rounded mt-1" />
              </div>
              <div>
                <label className="text-sm text-gray-600">品牌</label>
                <input value={p.brand || ""} onChange={e => setP({ ...p, brand: e.target.value })} className="w-full p-2 border rounded mt-1" placeholder="e.g. Ferragamo" />
              </div>
              <div>
                <label className="text-sm text-gray-600">分类</label>
                <select value={p.category} onChange={e => {
                  const sub = allSubcategories.find(s => s.key === e.target.value);
                  setP({ ...p, category: e.target.value, categoryName: sub?.name || "", categoryNameCn: sub?.nameCn || "" });
                }} className="w-full p-2 border rounded mt-1">
                  {Object.entries(CATEGORY_TREE).map(([gk, group]) => (
                    <optgroup key={gk} label={`${group.name} (${group.nameCn})`}>
                      {Object.entries(group.subcategories).map(([sk, sub]) => (
                        <option key={sk} value={sk}>{sub.name} - {sub.nameCn}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label className="text-sm text-gray-600">描述(CN)</label>
              <textarea value={p.descriptionCn || ""} onChange={e => setP({ ...p, descriptionCn: e.target.value })} className="w-full p-2 border rounded h-24 mt-1" />
            </div>
            <div className="mt-4">
              <label className="text-sm text-gray-600">描述(EN)</label>
              <textarea value={p.description || ""} onChange={e => setP({ ...p, description: e.target.value })} className="w-full p-2 border rounded h-24 mt-1" />
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <ImageUploader value={p.mainImage} onChange={v => setP({ ...p, mainImage: v })} label="产品主图" />
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={() => onSave({ ...p, id: p.id || Date.now().toString() })} className="px-8 py-3 bg-[#1A1A1A] text-white rounded-lg hover:bg-[#333]">
          {isNew ? "创建产品" : "保存更改"}
        </button>
        <button onClick={onCancel} className="px-8 py-3 border rounded-lg hover:bg-gray-50">取消</button>
      </div>
    </div>
  );
}
