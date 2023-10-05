import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCategoryModal } from "@/hooks/use-category-modal";
import axios from "axios";
import { formSchema } from "@/app/(city)/city/[cityTitle]/category-constants";
import { toast } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";

export const CategoryModal = () => {
  const categoryModal = useCategoryModal();
  const router = useRouter();

  const cartStore = useCategoryModal();
  // const city = cartStore.cart[0].title;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "",
    },
  });
  const param = useParams();
  const city = param.cityTitle;

  const isLoading = form.formState.isSubmitting;

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`/api/getCategory?city=${city}`);
      cartStore.addCategories(response.data);
    } catch (error: any) {
      console.log(error);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post("/api/category", {
        categories: values.category.toLowerCase(),
        city: cartStore.cart[0].title,
      });
      form.reset();
      categoryModal.onClose();
      categoryModal.categoryChange();
      fetchCategories();
      //after adding to db, fetch a add it to the store and then the sidebar will render from the store
    } catch (error: any) {
      if (error.response.status === 501) {
        toast.error("This category already exists");
        console.log(`there is error: ${error}`);
      } else {
        toast.error("Something went wrong");
        console.log(`there is error: ${error}`);
      }
    } finally {
      router.refresh();
    }
  };

  return (
    <Dialog open={categoryModal.isOpen} onOpenChange={categoryModal.onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Category</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex">
            <FormField
              name="category"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input disabled={isLoading} placeholder="" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button className="ml-2" disabled={isLoading}>
              Add
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
