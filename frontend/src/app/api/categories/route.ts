import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const BACKEND = process.env.BACKEND_URL || "http://backend:8000";

export async function GET(req: NextRequest) {
  try {

    const response = await axios.get(`${BACKEND}/api/v1/categories`);

    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: error.response?.status || 500 }
    );
  }
}