import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const BACKEND = process.env.BACKEND_URL || "http://backend:8000";
const BASE_URL = `${BACKEND}/api/v1/orders/`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const response = await axios.post(BASE_URL, body);

    return NextResponse.json(response.data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data || error.message },
      { status: error.response?.status || 500 }
    );
  }
}