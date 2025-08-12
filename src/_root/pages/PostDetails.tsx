import Loader from "@/components/shared/Loader";
import { useUserContext } from "@/context/AuthContext";
import { formatRelativeDate } from "@/lib/utils";
import {
  useDeletePost,
  useGetPostById,
} from "@/services/react-query/queriesAndMutations";
import { RiImageEditLine } from "react-icons/ri";
import { RiDeleteBin5Line } from "react-icons/ri";
import { Link, useNavigate, useParams } from "react-router";
import { toast } from "sonner";

function PostDetails() {
  const { id: postId } = useParams();
  const navigate = useNavigate();
  const { data: post, isPending } = useGetPostById(postId || "");
  const { mutateAsync: deletePost, isPending: isDeletingPost } =
    useDeletePost();
  const { user } = useUserContext();

  if (isPending) <Loader />;

  async function handleDeletePost(postId: string, imageId: string) {
    try {
      await deletePost({ postId, imageId });
      navigate("/");
    } catch (error) {
      console.error(error);
      toast("Failed to delete the post. Please try again");
    }
  }

  return (
    <div className="post_details-container">
      <div className="post_details-card">
        <img src={post?.imageUrl} alt="post" className="post_details-img" />

        <div className="post_details-info">
          <div className="w-full flex-between">
            <Link
              to={`/profile/${post?.creator.$id}`}
              className="flex items-center gap-3"
            >
              <img
                src={
                  post?.creator?.imageUrl ||
                  "/assets/profile-default-avatar.svg"
                }
                alt="photo of user"
                className="w-8 h-8 rounded-full lg:w-12 lg:h-12"
              />

              <div className="flex flex-col">
                <p className="base-medium lg:body-bold">
                  {post?.creator?.name}
                </p>
                <div className="gap-2 flex-start text-muted-foreground">
                  <p className="subtle-semibold lg:small-regular">
                    {formatRelativeDate(post?.$createdAt || "")}
                  </p>{" "}
                  <p className="subtle-semibold lg:small-regular">
                    {post?.location}
                  </p>
                </div>
              </div>
            </Link>

            <div className="gap-4 flex-center">
              <Link
                to={`/update-post/${post?.$id}`}
                className={`${user.id !== post?.creator.$id && "hidden"}`}
              >
                <RiImageEditLine
                  size={28}
                  className="rounded-sm text-primary"
                />
              </Link>

              <button
                className={`${user.id !== post?.creator.$id && "hidden"}`}
                onClick={() => handleDeletePost(post?.$id || "", post?.imageId)}
                disabled={isDeletingPost}
              >
                <RiDeleteBin5Line size={28} className="text-destructive" />
              </button>
            </div>
          </div>

          <hr className="w-full border border-muted" />
          <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
            <p>{post?.caption}</p>
            <ul className="flex gap-1 mt-2">
              {post?.tags.map((tag: string) => (
                <li key={tag} className="text-sm text-muted-foreground">
                  #{tag}
                </li>
              ))}
            </ul>
          </div>

          {/* <div className="w-full">
            <PostStats post={post} userId={user.id} />
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default PostDetails;
