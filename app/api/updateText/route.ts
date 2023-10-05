import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PUT(req: Request, res: Response) {
  const { userId } = auth();
  const { id, description } = await req.json();
  try {
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const post = await prisma?.item.update({
      where: { id: id },
      data: {
        description: description,
      },
    });
    return NextResponse.json(post);
  } catch (error) {
    return new NextResponse("Internal error");
  }
}
