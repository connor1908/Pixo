import { z } from "zod";

export const SignUpValidation = z.object({
  name: z
    .string()
    .min(2, { message: "Name should contains atleast 2 characters" })
    .max(50),
  username: z
    .string()
    .min(2, { message: "Username should contains atleast 2 characters" })
    .max(50),
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be atleast 8 characters" }),
});

export const SignInValidation = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be atleast 8 characters" }),
});

export const PostValidation = (isEdit: boolean) =>
  z.object({
    caption: z
      .string()
      .min(2, {
        message: "Caption must be at least 2 characters.",
      })
      .max(2200),

    file: z.custom<File[]>(
      (files) => {
        return isEdit || (files && files.length > 0);
      },
      {
        message: "Please upload an image.",
      }
    ),
    location: z.string(),
    tags: z.string(),
  });

export const ProfileValidation = z.object({
  file: z.custom<File[]>(
    (files) => {
      return files && files.length > 0;
    },
    {
      message: "Please upload an image.",
    }
  ),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  username: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email(),
  bio: z.string(),
});
