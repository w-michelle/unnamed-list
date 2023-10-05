import * as z from "zod";

export const formSchema = z.object({
  noteDesc: z.string(),
  noteImg: z.string(),
});
