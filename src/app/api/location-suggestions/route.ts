import { autocomplete } from "@/services/api/locationIq";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const search = request.nextUrl.searchParams.get("search");

  try {
    if (!search) {
      throw new Error("Location Error: Invalid search query");
    }

    const data = await autocomplete(search);

    if (data.error) {
      console.error(data.error);
      throw new Error("Location Error: Invalid search query");
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      { error: error.message || "Location Error: Failed to fetch address suggestions" },
      {
        status: 500,
      }
    );
  }
}
