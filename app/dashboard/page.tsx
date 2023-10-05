"use client";
import { Input } from "@/components/ui/input";
import { special, cutive } from "../fonts";

import * as z from "zod";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { formSchema } from "./constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import Navbar from "@/components/navbar";
import { dateFormat } from "@/lib/dateFormat";
import Link from "next/link";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";

interface City {
  id: string;
  title: string;
  userId: string;
  createdAt: string;
}

export default function Dashboard() {
  const { user } = useUser();
  const [cities, setCities] = useState<City[] | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      //add city
      await axios.post("/api/dashboard", {
        cities: values.prompt,
      });

      form.reset();
      // retrieve all cities and set state
      const cityData = await axios.get("/api/getCities");

      setCities(cityData.data);
    } catch (error: any) {
      if (error?.response?.status === 501) {
        toast.error("This city already exists");
      } else {
        toast.error("Something went wrong");
      }
    }
  };
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      const cityData = await axios.get("/api/getCities");

      setCities(cityData.data);
    };
    fetchCities();
  }, [isHydrated]);

  return (
    <>
      <SignedIn>
        <div className="h-screen mb-4">
          <Navbar />
          <div className="h-1/2 flex items-center justify-center">
            <div className="flex flex-col items-center">
              <h1 className={`${special.className} tracking-widest mb-4`}>
                [{user?.username}] - LIST
              </h1>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex">
                  <FormField
                    name="prompt"
                    render={({ field }) => (
                      <FormItem className={`${special.className}`}>
                        <FormControl>
                          <Input
                            disabled={isLoading}
                            placeholder="add a city"
                            className="tracking-widest"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button className="ml-2" disabled={isLoading}>
                    <Plus />
                  </Button>
                </form>
              </Form>
            </div>
          </div>
          <div className={`${cutive.className} py-2 mx-10 flex flex-col gap-4`}>
            {cities?.map((city, index) => (
              <Link
                href={{
                  pathname: `/city/${city.title}`,
                  query: {
                    ...city,
                  },
                }}
                key={index}
                className="flex justify-between hover:border-b-[1px] hover:border-gray hover:cursor-pointer"
              >
                <p>
                  {city.title.charAt(0).toUpperCase() +
                    city.title.slice(1).toLowerCase()}
                </p>
                <p>{dateFormat(city.createdAt)}</p>
              </Link>
            ))}
          </div>
        </div>
      </SignedIn>
    </>
  );
}
