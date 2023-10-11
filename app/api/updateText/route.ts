import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PUT(req: Request, res: Response) {
  const { userId } = auth();
  const { id, text } = await req.json();
  try {
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    await prisma?.item.update({
      where: { id: id },
      data: {
        title: text.title,
        description: text.desc,
      },
    });
    const post = await prisma?.item.findFirst({
      where: { id: id },
    });
    return NextResponse.json(post);
  } catch (error) {
    return new NextResponse("Internal error");
  }
}
