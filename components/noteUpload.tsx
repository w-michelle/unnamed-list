"use client";

import { Input } from "./ui/input";

import { useEffect, useState } from "react";

import axios from "axios";
import { ChevronDown, ChevronUp, FolderCheck, Upload } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { useCategoryModal } from "@/hooks/use-category-modal";
import Image from "next/image";
import ItemList from "./item-list";
import { cutive } from "@/app/fonts";

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

const NoteUpload = ({ catData }: any) => {
  const [noteObj, setNoteObj] = useState({
    title: "",
    noteDesc: "",
    noteImg: "",
  });

  const [posts, setPosts] = useState<Post[]>([]);
  const [open, setOpen] = useState(false);
  const store = useCategoryModal();

  const [isLoading, setIsLoading] = useState(false);
  const param = useParams();
  const searchParams = useSearchParams();
  const city = searchParams.get("city");

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
    data.append("category", catData.title);
    data.append("city", city!);
    data.append("catId", catData.id);
    // data.set('file', noteObj.noteImg)
    try {
      await axios.post("/api/upload", data);

      setNoteObj({ title: "", noteDesc: "", noteImg: "" });
      store.itemChange();
    } catch (error: any) {
      if (error?.response?.status === 400) {
        toast.error("Title is required");
      } else {
        console.log(error);
      }
    }
    setIsLoading(false);
  };

  return (
    <div className={`${cutive.className} flex flex-col gap-10 mx-4`}>
      <section className="w-full flex justify-center border-2 border-red-300 my-4 relative">
        {open ? (
          <>
            <div className="w-full absolute">
              <ChevronUp
                onClick={() => setOpen(!open)}
                className="hover:cursor-pointer transition ml-auto"
              />
            </div>
            <form onSubmit={onSubmit} className="flex">
              <div className="w-[300px] flex flex-col items-center justify-center gap-2 p-3 border-dashed border-2 border-slate-300 mt-4">
                <input
                  type="text"
                  name="title"
                  onChange={handleChange}
                  value={noteObj.title}
                  placeholder="title"
                  className="p-3 outline-none w-[270px]"
                  disabled={isLoading}
                />
                <div className="flex items-center justify-center gap-4 w-[600px]">
                  {noteObj.noteImg !== "" ? (
                    <div className="relative w-[100px] h-[200px] bg-black text-[#CCE2CC] rounded-md border-[0.05rem] border-grey hover:cursor-pointer transition">
                      <div className="flex flex-col items-center justify-center -translate-y-1/2 -translate-x-1/2 absolute left-1/2 top-1/2  ">
                        <FolderCheck size={28} />
                      </div>
                    </div>
                  ) : (
                    <label
                      htmlFor="noteFileImg"
                      className="relative w-[100px] h-[200px] bg-[#e4e4e7] rounded-md border-[0.05rem] border-grey hover:bg-black text-[#a1a1aa] hover:text-white hover:cursor-pointer transition"
                    >
                      <div className="w-full flex flex-col items-center justify-center -translate-y-1/2 -translate-x-1/2 absolute left-1/2 top-1/2  ">
                        <Upload size={20} strokeWidth={1} />
                        <p className="text-sm text-center mt-2">Upload Image</p>
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
                      className="h-[200px] w-[150px] resize-none outline-none p-3"
                    />
                  </label>
                </div>
                <input
                  type="submit"
                  value={isLoading ? "Loading..." : "Add"}
                  className="p-3 w-[270px] bg-[#e4e4e7] text-black rounded-md hover:cursor-pointer hover:bg-[#CCE2CC] hover:text-black"
                  disabled={isLoading}
                />
              </div>
            </form>
          </>
        ) : (
          <div className="flex">
            <p>Add a note ...</p>
            <ChevronDown
              onClick={() => setOpen(!open)}
              className="hover:cursor-pointer transition ml-auto"
            />
          </div>
        )}
      </section>
      <section className=" w-full border-blue-500 border-2">
        <ItemList data={{ city: city, catTitle: catData.title }} />
      </section>
    </div>
  );
};

export default NoteUpload;
