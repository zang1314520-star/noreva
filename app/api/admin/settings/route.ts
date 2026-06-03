import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const SETTINGS_FILE = path.join(process.cwd(), "data", "settings.json");

const defaults = {
  siteName: "Nayo Smart",
  siteNameCn: "Nayo Smart",
  email: "hello@noreva.cc",
  phone: "8617338700032",
  trackingCode: "",
  heroTitle: "Organized Carry, Officially Refined",
  heroTitleCn: "有序收纳，官方升级",
};

export async function GET() {
  try {
    if (!fs.existsSync(SETTINGS_FILE)) return NextResponse.json(defaults);
    return NextResponse.json(JSON.parse(fs.readFileSync(SETTINGS_FILE, "utf-8")));
  } catch {
    return NextResponse.json(defaults);
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const dir = path.dirname(SETTINGS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(data, null, 2), "utf-8");
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
