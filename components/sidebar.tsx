"use client";
import { cutive } from "@/app/fonts";
import { useCategoryModal } from "@/hooks/use-category-modal";
import axios from "axios";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Category from "./category";

interface CategoryProps {
  title: String;
}

export const Sidebar = () => {
  const store = useCategoryModal();
  const params = useParams();
  const cartStore = useCategoryModal();
  const city = params.cityTitle ? params.cityTitle : params.categoryTitle[0];

  const pathname = usePathname();
  const router = useRouter();
  //add new category and push

  const categories = cartStore.categories[0];
  const onDelete = async (id: string) => {
    try {
      const response = await axios.delete("/api/deleteCat", {
        data: { id: id },
      });

      fetchCategories();
      router.back();
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`/api/getCategory?city=${city}`);
      cartStore.addCategories(response.data);
    } catch (error) {
      console.log(`the error is : ${error}`);
    }
  };
  useEffect(() => {
    fetchCategories();
  }, [store.category]);

  return (
    <div className="absolute top-14 w-56 border-r-[1px] border-gray h-[110vh] flex flex-col items-center">
      <div className="border-2 border-gray p-2 mt-4 hover:border-black">
        <button
          onClick={store.onOpen}
          className="flex items-center justify-center"
        >
          <Plus />
        </button>
      </div>
      <div
        className={`${cutive.className} flex flex-col items-center gap-6 w-full mt-10 p-4`}
      >
        {Array.isArray(categories) &&
          categories.map((category, index) => (
            <Link
              key={index}
              href={{
                pathname: `/category/${city}/${category.title}`,
                query: { ...category },
              }}
              className={`${
                pathname.includes("/category") &&
                params.categoryTitle[1] === category.title
                  ? "bg-[#CCE2CC]"
                  : ""
              } w-full p-3 text-center text-md transition`}
            >
              <Category
                title={category.title}
                id={category.id}
                onDelete={onDelete}
              />
            </Link>
          ))}
      </div>
    </div>
  );
};
