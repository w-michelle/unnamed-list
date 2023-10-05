"use client";

import { useEffect, useState } from "react";
import { CategoryModal } from "./category-modal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <CategoryModal />
    </>
  );
};
