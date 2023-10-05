import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import prisma from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";
import { useSearchParams } from "next/navigation";

const s3Client = new S3Client({
  region: "ca-central-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY as string,
    secretAccessKey: process.env.AWS_SECRET_KEY as string,
  },
});

export async function GET(req: NextRequest, res: NextResponse) {
  const { userId } = auth();
  const url = new URL(req.url);
  const city = url.searchParams.get("city");
  const category = url.searchParams.get("category");

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  //get all the items from db that is from that city, that category and that user

  const posts = await prisma.item.findMany({
    where: {
      userId: userId,
      city: city?.toString(),
      itemCategory: category?.toString(),
    },
  });

  for (const post of posts) {
    if (post.imageSrc) {
      const getObjectParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: post.imageSrc!,
      };
      const command = new GetObjectCommand(getObjectParams);
      const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

      post.imageUrl = url;
    } else {
      post.imageUrl = "";
    }
  }
  return NextResponse.json(posts);
}
