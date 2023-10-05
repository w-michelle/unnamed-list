import Link from "next/link";
import { PostBar } from "./post-bar";
import { useState } from "react";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { cutive } from "@/app/fonts";

interface Post {
  city: string;
  description: string | null;
  id: string;
  imageSrc: string | "";
  imageUrl: string | "";
  itemCategory: string;
  title: string;
}

interface ItemListProps {
  posts: Post[];
}

const ItemList = ({ posts }: ItemListProps) => {
  const [currentPost, setCurrentPost] = useState<Post>();
  const [open, setOpen] = useState(false);

  const handleClick = (post: Post) => {
    setCurrentPost(post);
    console.log(post);
    //set the post info, open the sidebar
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(!open);
  };

  return (
    <div className={`${cutive.className}`}>
      {/* <div
        className={`${
          !open ? "hidden" : ""
        } w-[500px] h-screen bg-red-300 absolute top-0 right-0 p-4`}
      >
        <PostBar post={currentPost} handleClose={handleClose} />
      </div> */}

      <div className="flex flex-col gap-4">
        {posts.map((post, index) => (
          <Link
            href={{ pathname: `/post/${post.title}`, query: { ...post } }}
            key={index}
          >
            <p
              onClick={() => handleClick(post)}
              className="cursor-pointer hover:underline"
            >
              {post.title}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ItemList;
