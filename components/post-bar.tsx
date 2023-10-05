import { dateFormat2 } from "@/lib/dateFormat";
import { ImageIcon } from "lucide-react";
import Image from "next/image";

export const PostBar = ({ post, handleClose }: any) => {
  const {
    city,
    createdAt,
    description,
    id,
    imageSrc,
    imageUrl,
    itemCategory,
    title,
  } = post;
  const close = () => {
    handleClose();
  };
  return (
    <>
      <button className="text-2xl ml-auto" onClick={close}>
        &times;
      </button>
      <div className="relative w-[400px] h-[400px]">
        {post?.imageUrl ? (
          <Image fill alt="post image" src={post?.imageUrl} />
        ) : (
          <ImageIcon size={70} strokeWidth={0.75} />
        )}
      </div>
      <p>Created: {dateFormat2(createdAt)}</p>
      <p>Title: {title}</p>
      <p>Description: {description}</p>
    </>
  );
};
