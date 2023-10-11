import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(req: Request, res: Response) {
  const { userId } = auth();
  const url = new URL(req.url);
  const searchParams = new URLSearchParams(url.search);
  const city = searchParams.get("city");
  try {
    if (!userId) {
      return new NextResponse("User not found", { status: 401 });
    }

    const response = await prisma?.cities.findFirst({
      where: { userId: userId, title: city?.toString() },
      include: {
        categories: {
          include: {
            items: true,
          },
        },
      },
    });
    return NextResponse.json(response);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
