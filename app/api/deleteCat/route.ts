import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, res: Response) {
  const body = await req.json();
  const { id } = body;

  try {
    const category = await prisma.category.delete({
      where: {
        id: id,
      },
    });
    return NextResponse.json(category);
  } catch (error) {
    return new NextResponse(`${error}`);
  }
}
