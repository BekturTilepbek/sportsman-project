import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const BACKEND = process.env.BACKEND_URL || "http://backend:8000";

export async function GET(req: NextRequest) {
  try {
    // получаем query параметры
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    // формируем URL к бэку
    const url = category
      ? `${BACKEND}/api/v1/products/?category=${category}`
      : `${BACKEND}/api/v1/products/`;

    const response = await axios.get(url);

    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: error.response?.status || 500 }
    );
  }
}