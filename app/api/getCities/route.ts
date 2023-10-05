import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
export async function GET(req: Request) {
  const { userId } = auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const cities = await prisma.cities.findMany({
    where: { userId: userId },
  });
  return NextResponse.json(cities);
}
