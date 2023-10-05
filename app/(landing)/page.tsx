"use client";
import Image from "next/image";
import { special, cutive } from "../fonts";
import { Button } from "@/components/ui/button";
import { ArrowBigRight } from "lucide-react";
import { useAuth, useUser } from "@clerk/nextjs";
import Link from "next/link";
export default function Home() {
  const isSignedIn = useAuth();
  const { user } = useUser();

  return (
    <main
      className={`${special.className} tracking-[0.2rem] h-screen flex items-center justify-center`}
    >
      <div className="text-center">
        <h1 className="text-lg mb-8">[{user?.username}]-LIST</h1>
        <Link href={isSignedIn ? "/dashboard" : "/sign-up"}>
          <Button>
            <span className="mr-4 tracking-widest">START</span>
            <ArrowBigRight strokeWidth={1.75} />{" "}
          </Button>
        </Link>
      </div>
    </main>
  );
}
