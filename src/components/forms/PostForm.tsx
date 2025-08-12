import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import FileUploader from "../shared/FileUploader";
import { PostValidation } from "@/validation";
import type { Models } from "appwrite";
import {
  useCreatePost,
  useUpdatePost,
} from "@/services/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useState } from "react";

type PostFormProps = {
  action: "Create" | "Update";
  post?: Models.Document;
};

function PostForm({ post, action }: PostFormProps) {
  const isEdit = action === "Update";
  const [clearFiles, setClearFiles] = useState(false);
  const { mutateAsync: createPost, isPending: isPendingCreate } =
    useCreatePost();
  const { mutateAsync: updatePost, isPending: isPendingUpdate } =
    useUpdatePost();
  const { user } = useUserContext();
  const navigate = useNavigate();
  // 1. Define your form.
  const form = useForm<z.infer<ReturnType<typeof PostValidation>>>({
    resolver: zodResolver(PostValidation(isEdit)),
    defaultValues: {
      caption: post ? post?.caption : "",
      file: [],
      location: post ? post?.location : "",
      tags: post ? post?.tags.join(", ") : "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<ReturnType<typeof PostValidation>>) {
    if (post && action === "Update") {
      const updatedPost = await updatePost({
        ...values,
        postId: post.$id,
        imageId: post?.imageId,
        imageUrl: post?.imageUrl,
      });

      if (!updatedPost) {
        toast("Failed to update the post. Please try again");
        return;
      }
      //we need to return here so that only this is executed and not newPost one
      //otherwise we will also get the toast of no newPost
      return navigate(`/posts/${post.$id}`);
    }

    const newPost = await createPost({ ...values, userId: user.id });

    if (!newPost) {
      toast("Image was not uploaded.Please try again");
      return;
    }

    //if successfull navigate to home page
    form.reset();
    navigate("/");
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col w-full max-w-5xl gap-9"
      >
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Caption</FormLabel>
              <FormControl>
                <Textarea placeholder="caption..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Add Photos</FormLabel>
              <FormControl>
                <FileUploader
                  fieldChange={field.onChange}
                  mediaUrl={post?.imageUrl}
                  clearFiles={clearFiles}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Add Location</FormLabel>
              <FormControl>
                <Input type="text" placeholder="location..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Add Tags (separated by commas ' ,')</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Art, Artist, Meme" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center justify-end gap-4">
          <Button
            type="reset"
            variant="ghost"
            onClick={() => {
              form.reset();
              setClearFiles(true);
              setTimeout(() => setClearFiles(false), 100);
            }}
          >
            Cancel
          </Button>
          <Button disabled={isPendingCreate || isPendingUpdate} type="submit">
            {action} Post
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default PostForm;
