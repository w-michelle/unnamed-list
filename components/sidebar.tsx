"use client";
import { cutive } from "@/app/fonts";
import { useCategoryModal } from "@/hooks/use-category-modal";
import axios from "axios";
import { ChevronsUpDown, Home, Plus } from "lucide-react";
import Link from "next/link";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useEffect, useState } from "react";
import Category from "./category";
import { Category as Categories } from "@/types/types";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "./ui/command";
import { Button } from "./ui/button";

interface CategoryProps {
  id: string;
  title: string;
  userId: string;
  city: string;
}

export const Sidebar = () => {
  const [categories, setCategories] = useState<CategoryProps[]>();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const store = useCategoryModal();
  const params = useParams();
  const searchParams = useSearchParams();

  const city = searchParams.get("cityTitle") || searchParams.get("city");
  const cityId = searchParams.get("cityId");
  const pathname = usePathname();
  const router = useRouter();
  //add new category and push

  // const categories = cartStore.categories[0];
  const onDelete = async (id: string) => {
    try {
      const response = await axios.delete("/api/deleteCat", {
        data: { id: id },
      });

      fetchCategories();
      router.back();
    } catch (error) {
      console.log(error);
    }
  };
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`/api/getCategories?city=${city}`);
      // cartStore.addCategories(response.data);

      setCategories(response.data);
    } catch (error) {
      console.log(`the error is : ${error}`);
    }
  };
  useEffect(() => {
    fetchCategories();
  }, [store.category]);
  //

  return (
    <>
      {/* // mobile */}
      <div className="md:hidden fixed bottom-0 p-3 w-full bg-[#cedbce] flex items-center justify-between">
        <button
          onClick={store.onOpen}
          className="flex items-center justify-center"
        >
          <Plus />
        </button>

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[200px] justify-between"
            >
              {value
                ? categories?.find((category) => category.title === value)
                    ?.title
                : "Select Category"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              {/* <CommandInput placeholder="Search framework..." />
              <CommandEmpty>No framework found.</CommandEmpty> */}
              <CommandGroup>
                {categories?.map((category) => (
                  <Link
                    key={category.title}
                    href={{
                      pathname: `/category/${city}/${category.title}`,
                      query: { ...category, cityId: cityId },
                    }}
                  >
                    <CommandItem
                      key={category.title}
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? "" : currentValue);
                        setOpen(false);
                      }}
                    >
                      {category.title}
                    </CommandItem>
                  </Link>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <div className="md:flex hidden absolute top-14 w-56 border-r-[1px] border-gray h-[110vh] flex-col items-center">
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
                  query: { ...category, cityId: cityId },
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
    </>
  );
};
