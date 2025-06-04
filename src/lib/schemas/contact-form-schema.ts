import { z } from "zod";

export const ContactFormSchema = z.object({
  name: z
    .string()
    .nonempty({ message: "Name is required" })
    .min(2, { message: "Name must be at least 2 characters long." }),

  email: z
    .string()
    .nonempty({ message: "Email is required" })
    // exactly match the test’s “Invalid email” string:
    .email({ message: "Invalid email" }),

  message: z
    .string()
    .nonempty({ message: "Message is required" })
    .min(10, { message: "Message must be at least 10 characters long." }),
});

export type ContactFormData = z.infer<typeof ContactFormSchema>;
