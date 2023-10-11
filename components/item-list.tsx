import Link from "next/link";
import { PostBar } from "./post-bar";
import { useEffect, useState } from "react";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { cutive } from "@/app/fonts";
import axios from "axios";
import { Item } from "@/types/types";
import { useCategoryModal } from "@/hooks/use-category-modal";

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
  data: {
    city: string | null;
    catTitle: string | null;
  };
}

const ItemList = (data: ItemListProps) => {
  const [currentPost, setCurrentPost] = useState<Post>();
  const [open, setOpen] = useState(false);
  const [postList, setPostList] = useState<Item[]>();
  const store = useCategoryModal();
  const handleClick = (post: Post) => {
    setCurrentPost(post);
    console.log(post);
    //set the post info, open the sidebar
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(!open);
  };
  useEffect(() => {
    const getPosts = async () => {
      try {
        const response = await axios.get(
          `/api/getPosts?city=${data.data.city}&category=${data.data.catTitle}`
        );
        console.log("city is:", data.data.city);
        console.log("category is:", data.data.catTitle);
        console.log("get post:", response.data);
        setPostList(response.data);
      } catch (error: any) {
        console.log(error);
      }
    };
    getPosts();
  }, [store.itemList]);

  return (
    <div className={`${cutive.className} mt-2`}>
      <div className="flex flex-col gap-4">
        {postList?.map((post, index) => (
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
