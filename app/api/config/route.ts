import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

const configPath = path.join(process.cwd(), "data", "site-config.json");

export async function GET() {
  try {
    const data = await fs.readFile(configPath, "utf-8");
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    return NextResponse.json({ error: "Failed to read config" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const config = await request.json();
    await fs.writeFile(configPath, JSON.stringify(config, null, 2), "utf-8");
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save config" }, { status: 500 });
  }
}
