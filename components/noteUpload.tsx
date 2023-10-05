"use client";

import { Input } from "./ui/input";

import { useEffect, useState } from "react";

import axios from "axios";
import { FolderCheck, Upload } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { useCategoryModal } from "@/hooks/use-category-modal";
import Image from "next/image";
import ItemList from "./item-list";

interface NoteObj {
  title: string;
  noteDesc: string;
  noteImg: File;
}
interface Post {
  city: string;
  description: string | null;
  id: string;
  imageSrc: string | "";
  imageUrl: string | "";
  itemCategory: string;
  title: string;
}

const NoteUpload = () => {
  const [noteObj, setNoteObj] = useState({
    title: "",
    noteDesc: "",
    noteImg: "",
  });

  const [posts, setPosts] = useState<Post[]>([]);

  const cartStore = useCategoryModal();

  const [isLoading, setIsLoading] = useState(false);
  const param = useParams();
  const city = param.categoryTitle[0];

  const handleChange = (e: any) => {
    if (e.target.name === "noteImg") {
      setNoteObj({ ...noteObj, [e.target.name]: e.target.files?.[0] });
    } else {
      setNoteObj({ ...noteObj, [e.target.name]: e.target.value });
    }
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    const data = new FormData();
    data.append("image", noteObj.noteImg);
    data.append("title", noteObj.title);
    data.append("desc", noteObj.noteDesc);
    data.append("category", param.categoryTitle[1].toString());
    data.append("city", city);
    // data.set('file', noteObj.noteImg)
    try {
      await axios.post("/api/upload", data);

      setNoteObj({ title: "", noteDesc: "", noteImg: "" });
    } catch (error: any) {
      if (error?.response?.status === 400) {
        toast.error("Title is required");
      } else {
        console.log(error);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const getPosts = async () => {
      try {
        const response = await axios.get(
          `/api/getPosts?city=${city}&category=${param.categoryTitle[1]}`
        );

        setPosts(response.data);
      } catch (error: any) {
        console.log(error);
      }
    };
    getPosts();
  }, [noteObj]);

  return (
    <div className="flex flex-col items-center justify-center gap-10 bg-">
      <section className=" w-full">
        <form onSubmit={onSubmit} className="flex">
          <div className="flex flex-col  gap-2 p-3 border-dashed border-2 border-slate-300 mt-4">
            <input
              type="text"
              name="title"
              onChange={handleChange}
              value={noteObj.title}
              placeholder="title"
              className="p-3 outline-none"
            />
            <div className="flex gap-4">
              {noteObj.noteImg !== "" ? (
                <div className="relative w-[400px] h-[200px] bg-black text-[#CCE2CC] rounded-md border-[0.05rem] border-grey hover:cursor-pointer transition">
                  <div className="flex flex-col items-center justify-center -translate-y-1/2 -translate-x-1/2 absolute left-1/2 top-1/2  ">
                    <FolderCheck size={28} />
                  </div>
                </div>
              ) : (
                <label
                  htmlFor="noteFileImg"
                  className="relative w-[400px] h-[200px] bg-[#e4e4e7] rounded-md border-[0.05rem] border-grey hover:bg-black text-[#a1a1aa] hover:text-white hover:cursor-pointer transition"
                >
                  <div className="flex flex-col items-center justify-center -translate-y-1/2 -translate-x-1/2 absolute left-1/2 top-1/2  ">
                    <Upload size={32} strokeWidth={1} />
                    <p>Upload Image</p>
                  </div>
                  <Input
                    type="file"
                    name="noteImg"
                    id="noteFileImg"
                    disabled={isLoading}
                    placeholder=""
                    onChange={handleChange}
                    className="hidden"
                  />
                </label>
              )}
              <label htmlFor="noteDesc" className="flex">
                <textarea
                  rows={4}
                  cols={40}
                  id="noteDesc"
                  name="noteDesc"
                  disabled={isLoading}
                  placeholder="Description"
                  value={noteObj.noteDesc}
                  onChange={handleChange}
                  className="h-[200px] w-[400px] resize-none outline-none p-3"
                />
              </label>
            </div>
            <input
              type="submit"
              value="Add"
              className="p-3 bg-[#e4e4e7] text-black rounded-md hover:cursor-pointer hover:bg-[#CCE2CC] hover:text-black"
              disabled={isLoading}
            />
          </div>
        </form>
      </section>

      <section className=" w-full">
        <ItemList posts={posts} />
      </section>
    </div>
  );
};

export default NoteUpload;
