"use client";
import { cutive } from "@/app/fonts";
import { dateFormat2 } from "@/lib/dateFormat";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

interface ItemDetails {
  city: string;
  description: string | null;
  id: string;
  imageSrc: string | "";
  imageUrl: string | "";
  itemCategory: string;
  title: string;
  createdAt: string;
}

const Post = ({ searchParams }: any) => {
  const {
    city,
    createdAt,
    description,
    id,
    imageSrc,
    imageUrl,
    itemCategory,
    title,
  } = searchParams;

  return (
    <div className={`${cutive.className} `}>
      <nav
        className={` flex justify-between py-4 px-4 border-b-[1px] border-gray`}
      >
        <ul className="flex">
          <li>
            <Link href="/">home</Link>
          </li>
          <li>
            <span>/</span>
          </li>
          <li>
            <Link href={`/city/${city}`}>{city}</Link>
          </li>
          <li>
            <span>/</span>
          </li>
          <li>
            <Link href={`/category/${city}/${itemCategory}`}>
              {itemCategory}
            </Link>
          </li>
        </ul>
        <h1>{title}</h1>
        <p>{dateFormat2(createdAt)}</p>
      </nav>
      <div>
        <div className="relative w-[200px] h-[200px]">
          <Image src={imageUrl} fill alt="Post Image" />
        </div>
      </div>
    </div>
  );
};
export default Post;
