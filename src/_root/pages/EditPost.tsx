import PostForm from "@/components/forms/PostForm";
import Loader from "@/components/shared/Loader";
import { useGetPostById } from "@/services/react-query/queriesAndMutations";
import { LuImagePlus } from "react-icons/lu";
import { useParams } from "react-router";

function EditPost() {
  const { id } = useParams();
  const { data: post, isPending } = useGetPostById(id || "");

  if (isPending) return <Loader />;

  return (
    <section className="flex flex-1">
      <div className="common-container">
        <div className="w-full max-w-5xl gap-3 flex-start">
          <LuImagePlus size={42} />
          <h2 className="w-full text-left h3-bold md:h2-bold">Edit Post</h2>
        </div>

        <PostForm action="Update" post={post} />
      </div>
    </section>
  );
}

export default EditPost;
