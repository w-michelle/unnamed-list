import * as z from "zod";

export const formSchema = z.object({
  category: z.string().min(1, {
    message: "Title is required",
  }),
});
