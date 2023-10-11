import prisma from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const search = new URLSearchParams(url.search);
  const category = search.get("category");
  const city = search.get("city");
  const { userId } = auth();

  console.log(city, category);

  try {
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const findCategory = await prisma.category.findFirst({
      where: {
        userId: userId,
        city: city?.toString(),
        title: category?.toString(),
      },
    });
    return NextResponse.json(findCategory);
  } catch (error) {
    console.log(error);
  }
}
