import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

import sharp from "sharp";
import { auth, currentUser } from "@clerk/nextjs";

const s3Client = new S3Client({
  region: process.env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY as string,
    secretAccessKey: process.env.AWS_SECRET_KEY as string,
  },
});

export async function POST(req: NextRequest, res: NextResponse) {
  const user = await currentUser();
  const { userId } = auth();
  try {
    const formData = await req.formData();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!formData.get("title")?.toString()) {
      return new NextResponse("Title is required", { status: 400 });
    }
    const file = formData.get("image") as Blob | null;

    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());

      const resizedImageBuffer = await sharp(buffer)
        .resize(400, 500)
        .toBuffer();

      const imageName = uuid();
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: imageName,
        Body: resizedImageBuffer,
        ContentType: file.type,
      };

      const command = new PutObjectCommand(params);
      await s3Client.send(command); //or destroy

      const data = {
        userId: userId,
        title: formData.get("title")?.toString() || "",
        description: formData.get("desc")?.toString() || "",
        itemCategory: formData.get("category")?.toString() || "",
        imageSrc: imageName,
        city: formData.get("city")?.toString() || "",
      };
      //save to database
      const post = await prisma?.item.create({
        data: data,
      });
      return NextResponse.json(post);
    } else {
      const data = {
        userId: userId,
        title: formData.get("title")?.toString() || "",
        description: formData.get("desc")?.toString() || "",
        itemCategory: formData.get("category")?.toString() || "",
        imageSrc: "",
        city: formData.get("city")?.toString() || "",
      };
      //save to database
      const post = await prisma?.item.create({
        data: data,
      });
      return NextResponse.json(post);
    }
  } catch (error) {
    return new NextResponse(`${error}`);
  }
}
