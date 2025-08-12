import type { Models } from "appwrite";
import { Link } from "react-router";
import { RiImageEditLine } from "react-icons/ri";

import { formatRelativeDate } from "@/lib/utils";
import { useUserContext } from "@/context/AuthContext";
import PostStats from "./PostStats";

type PostCardProps = {
  post: Models.Document;
};

export function PostCard({ post }: PostCardProps) {
  const { user } = useUserContext();

  return (
    <div className="post-card">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post.creator.$id}`}>
            <img
              src={
                post?.creator?.imageUrl || "/assets/profile-default-avatar.svg"
              }
              alt="photo of user"
              className="w-8 h-8 rounded-full lg:w-12 lg:h-12"
            />
          </Link>

          <div className="flex flex-col">
            <p className="base-medium lg:body-bold">{post?.creator?.name}</p>
            <div className="gap-2 flex-start text-muted-foreground">
              <p className="subtle-semibold lg:small-regular">
                {formatRelativeDate(post.$createdAt)}
              </p>{" "}
              <p className="subtle-semibold lg:small-regular">
                {post.location}
              </p>
            </div>
          </div>
        </div>
        <Link
          to={`/update-post/${post.$id}`}
          className={`${user.id !== post.creator.$id && "hidden"}`}
        >
          <RiImageEditLine size={20} className="rounded-sm text-primary" />
        </Link>
      </div>

      <Link to={`/posts/${post.$id}`}>
        <div className="py-5 small-medium lg:base-medium">
          <p>{post.caption}</p>
          <ul className="flex gap-1 mt-2">
            {post.tags.map((tag: string) => (
              <li key={tag} className="text-sm text-muted-foreground">
                #{tag}
              </li>
            ))}
          </ul>
        </div>

        <img src={post.imageUrl} className="post-card_img" alt="picture" />
      </Link>

      <PostStats post={post} userId={user.id} />
    </div>
  );
}
