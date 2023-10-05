import prisma from "@/lib/prismadb";
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { auth, currentUser } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { v4 as uuid } from "uuid";
const s3Client = new S3Client({
  region: process.env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY as string,
    secretAccessKey: process.env.AWS_SECRET_KEY as string,
  },
});

export async function PUT(req: NextRequest, res: NextResponse) {
  const user = await currentUser();
  const { userId } = auth();

  const imageData = await req.formData();

  const file = imageData.get("image") as Blob | null;

  const key = imageData.get("imageSrc")?.toString();
  const id = imageData.get("id")?.toString();
  const valueToChange = imageData.get("change")?.toString();
  console.log(imageData);
  if (file) {
    const buffer = Buffer.from(await file.arrayBuffer());

    const resizedImageBuffer = await sharp(buffer).resize(400, 500).toBuffer();

    const imageKey = key ? key : uuid();
    console.log(imageKey);
    try {
      if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
      }

      const putObjectParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: imageKey,
        Body: resizedImageBuffer,
      };
      const command = new PutObjectCommand(putObjectParams);
      await s3Client.send(command);

      const getObjectParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: imageKey!,
      };
      const getCommand = new GetObjectCommand(getObjectParams);
      const url = await getSignedUrl(s3Client, getCommand, { expiresIn: 3600 });
      //update prisma
      const post = await prisma?.item.update({
        where: {
          id: id,
        },
        data: {
          imageUrl: url,
          imageSrc: imageKey,
        },
      });
      return NextResponse.json(post);
    } catch (error) {
      return new NextResponse(`${error}`);
    }
  }
}
