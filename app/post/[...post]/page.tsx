"use client";

import { cutive } from "@/app/fonts";
import { Input } from "@/components/ui/input";
import { dateFormat2 } from "@/lib/dateFormat";

import axios from "axios";
import { ArrowLeft, Pencil, Upload } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type City = {
  id: string;
  title: string;
  createdAt: string;
};
type Category = {
  id: string;
  title: string;
  userId: string;
  city: string;
};
const Post = ({ searchParams }: any) => {
  const {
    title,
    itemCategory,
    city,
    imageUrl,
    imageSrc,
    description,
    createdAt,
    id,
  } = searchParams;
  const router = useRouter();
  const [edit, setEdit] = useState(false);
  const [editImg, setEditImg] = useState(false);
  const [desc, setDesc] = useState(description);
  const [postTitle, setPostTitle] = useState(title);
  const [post, setPost] = useState({
    title,
    itemCategory,
    city,
    imageUrl,
    imageSrc,
    description,
    createdAt,
    id,
  });
  const [category, setCategory] = useState<Category>();
  const [cityObj, setCityObj] = useState<City>();

  const update = async (value: any, prop: string) => {
    console.log(value);
    console.log(prop);

    if (prop === "text") {
      try {
        const response = await axios.put("/api/updateText", {
          id: id,
          text: value,
        });
        setEdit(!edit);
        setPost(response.data);
        console.log("this is text res", response);
      } catch (error) {
        console.log(error);
      }
    } else {
      const data = new FormData();
      data.append("image", value);
      data.append("imageSrc", imageSrc);
      data.append("id", id);
      try {
        const response = await axios.put("/api/updateImage", data);
        setPost(response.data);
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    const fetchCategory = async () => {
      const catRes = await axios.get(
        `/api/getCategory?city=${city}&category=${itemCategory}`
      );

      setCategory(catRes.data);
      const cityRes = await axios.get(`/api/getCity?city=${city}`);
      console.log("city", cityRes.data);
      setCityObj(cityRes.data);
    };
    fetchCategory();
  }, []);

  return (
    <div className={`${cutive.className} bg-grayGreen h-screen`}>
      <nav className=" flex justify-between p-4 border-b-[1px] border-gray">
        <div className="flex items-center gap-2">
          <ArrowLeft
            size={16}
            className="hover:cursor-pointer"
            onClick={() => router.back()}
          />
          <div>
            /
            <Link
              href={{
                pathname: `/city/${post?.city}`,
                query: {
                  ...cityObj,
                  cityTitle: cityObj?.title,
                  cityId: cityObj?.id,
                },
              }}
            >
              {post?.city}
            </Link>
            /
            <Link
              href={{
                pathname: `/category/${city}/${post?.itemCategory}`,
                query: { ...category, cityId: cityObj?.id },
              }}
            >
              {post?.itemCategory}
            </Link>
            /{post?.title}
          </div>
        </div>
        <div>
          <p>{dateFormat2(post?.createdAt)}</p>
        </div>
      </nav>

      <section className="flex flex-col  gap-4 p-4 border-red-500 border-2">
        {/* if theres image upload image else display upload */}
        {post?.imageUrl ? (
          <div className="flex gap-2">
            <div className="relative w-[200px] h-[200px]">
              <Image alt="Post Image" src={post?.imageUrl} fill />
            </div>
            <label
              htmlFor="noteFileImg"
              className="relative w-[400px] h-[200px]"
            >
              <div className=" ">
                <Pencil size={14} />
              </div>
              <Input
                type="file"
                name="noteImg"
                id="noteFileImg"
                placeholder=""
                onChange={(e) => update(e.target.files?.[0], "newImage")}
                className="hidden"
              />
            </label>
          </div>
        ) : (
          <label
            htmlFor="noteFileImg"
            className="relative w-[400px] h-[200px] border-gray border-dashed border-4 flex items-center justify-center"
          >
            <div className="flex flex-col items-center">
              <Upload size={32} strokeWidth={1} />
              <p>Upload Image</p>
            </div>
            <Input
              type="file"
              name="noteImg"
              id="noteFileImg"
              placeholder=""
              onChange={(e) => update(e.target.files?.[0], "newImage")}
              className="hidden"
            />
          </label>
        )}

        <div>
          {!edit ? (
            <>
              <p>Title:{post?.title}</p>
              <div className="flex items-center gap-2">
                <p>Description:{post?.description}</p>
                <Pencil
                  className="hover:cursor-pointer"
                  size={14}
                  onClick={() => setEdit(true)}
                />
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-4">
              <textarea
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
              ></textarea>
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              ></textarea>
              <button
                onClick={() => update({ desc: desc, title: postTitle }, "text")}
                className="px-3 bg-green-500"
              >
                done
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Post;
