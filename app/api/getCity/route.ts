import prisma from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const url = new URL(req.url);
  const city = url.searchParams.get("city");
  const { userId } = auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const currentCity = await prisma.cities.findFirst({
    where: { userId: userId, title: city?.toString() },
  });
  return NextResponse.json(currentCity);
}
