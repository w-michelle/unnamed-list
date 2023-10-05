import prisma from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { userId } = auth();
  const user = await currentUser();
  const url = new URL(req.url);
  const searchParams = new URLSearchParams(url.search);
  const city = searchParams.get("city");

  // const city = searchParams.get(city)

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const categories = await prisma.category.findMany({
    where: { userId: userId, city: city },
  });
  return NextResponse.json(categories);
}
