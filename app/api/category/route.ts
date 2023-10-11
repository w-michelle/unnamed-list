import prisma from "@/lib/prismadb";
import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const user = await currentUser();
  const { userId } = auth();

  try {
    const body = await req.json();
    const { categories, city, cityId } = body;

    if (!categories) {
      return new NextResponse("Enter a category", { status: 400 });
    }
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const categoryData = {
      userId: userId?.toString()!,
      title: categories,
      city: city,
    };

    const existingCategory = await prisma.category.findFirst({
      where: { userId: userId?.toString(), title: categories, city: city },
    });

    if (!existingCategory) {
      await prisma.category.create({
        data: { ...categoryData, Cities: { connect: { id: cityId } } },
      });
      return new NextResponse(null, { status: 200 });
    } else {
      return new NextResponse("Category already exists", { status: 501 });
    }
  } catch (error) {
    return new NextResponse(`Internal error ${error}`, { status: 500 });
  }
}
