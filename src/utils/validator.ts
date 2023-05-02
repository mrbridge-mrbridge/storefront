import { z } from "zod";

export const userSchema = z.object({
  first_name: z.string().nonempty("First name can not be empty"),
  last_name: z.string().nonempty("Last name can not be empty"),
  business_name: z.string().nonempty("Business name can not be empty"),
  email: z.string().email("Invalid email address").toLowerCase(),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  confirm_password: z
    .string()
    .min(8, "Password must be at least 8 characters long"),
});
