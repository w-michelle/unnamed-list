"use client";
import { cutive, special } from "@/app/fonts";
import { useCategoryModal } from "@/hooks/use-category-modal";
import { dateFormat2 } from "@/lib/dateFormat";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface CityProp {
  createdAt: string | "";
  id: string | "";
  title: string | "";
  userId: string;
}

export const CityNav = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [cityInfo, setCityInfo] = useState<CityProp>();
  const param = useParams();
  const searchParams = useSearchParams();
  const city = searchParams.get("city") || searchParams.get("cityTitle");
  useEffect(() => {
    setIsLoading(true);
    const getCity = async () => {
      const response = await axios.get(`/api/getCity?city=${city}`);
      setCityInfo(response.data);
    };
    getCity();
  }, []);

  if (!isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    <nav
      className={`${cutive.className} flex justify-between p-4 border-b-[1px] border-gray`}
    >
      <Link href="/dashboard" className="flex items-center gap-2">
        <ArrowLeft size={16} />
        <p>Home</p>
      </Link>
      <Link
        href={{
          pathname: `/city/${cityInfo?.title}`,
          query: {
            ...cityInfo,
            cityTitle: cityInfo?.title,
            cityId: cityInfo?.id,
          },
        }}
      >
        <h1 className={`${special.className} tracking-[0.2rem]`}>
          {cityInfo &&
            cityInfo?.title.charAt(0).toUpperCase() +
              cityInfo?.title.slice(1).toLowerCase()}
        </h1>
      </Link>
      <p>{dateFormat2(cityInfo?.createdAt)}</p>
    </nav>
  );
};
