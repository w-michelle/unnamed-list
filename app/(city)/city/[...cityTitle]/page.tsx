"use client";
import { cutive, special } from "@/app/fonts";

import { CityNav } from "@/components/city-nav";
import ItemList from "@/components/item-list";

import { useCategoryModal } from "@/hooks/use-category-modal";
import { City, Item } from "@/types/types";

import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const Page = ({ searchParams }: any) => {
  const { userId } = useAuth();
  const cartStore = useCategoryModal();
  const params = useSearchParams();
  const city = params.get("cityTitle");
  const store = useCategoryModal();

  const [data, setData] = useState<City>();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`/api/getAll?city=${city}`);
        console.log("this is get all", response);
        setData(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategories();
  }, [store.category]);

  //how to include nested
  //https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries

  return (
    <div className={`${cutive.className} mt-4`}>
      <div className="w-full md:pl-60">
        <div className="md:w-4/5 grid grid-cols-2 gap-x-4 gap-y-10 mx-4 justify-center border-2 border-red-500">
          {data?.categories?.map((item: any) => (
            <div key={item.title}>
              <Link
                href={{
                  pathname: `/category/${city}/${item.title}`,
                  query: { ...item, cityId: item.citiesId },
                }}
                className={`${special.className} text-sm tracking-[0.17rem] underline`}
              >
                {item.title.toUpperCase()}
              </Link>
              <ItemList data={{ city: city, catTitle: item.title }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
