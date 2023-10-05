import prisma from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = auth();
  try {
    const body = await req.json();
    const { cities } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!cities) {
      return new NextResponse("City is required", { status: 400 });
    }

    const cityData = {
      userId: userId,
      title: cities,
    };
    const existingCity = await prisma.cities.findFirst({
      where: { userId: userId, title: cities },
    });

    if (!existingCity) {
      await prisma?.cities.create({
        data: cityData,
      });
      return new NextResponse(null, { status: 200 });
    } else {
      return new NextResponse("City already exists", { status: 501 });
    }
  } catch (error) {
    return new NextResponse(`Internal error ${error}`, { status: 500 });
  }
}
