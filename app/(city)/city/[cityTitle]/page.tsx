"use client";
import { cutive, special } from "@/app/fonts";

import { CityNav } from "@/components/city-nav";

import { useCategoryModal } from "@/hooks/use-category-modal";

import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";

const Page = ({ searchParams }: any) => {
  const { userId } = useAuth();
  const cartStore = useCategoryModal();
  useEffect(() => {
    cartStore.addCity({
      id: searchParams.id,
      title: searchParams.title,
      createdAt: searchParams.createdAt,
    });
  }, []);
  return (
    <div className={`${cutive.className}`}>
      <div className="w-full pl-60">hello</div>
    </div>
  );
};

export default Page;
