import PostForm from "@/components/forms/PostForm";
import { LuImagePlus } from "react-icons/lu";

function CreatePost() {
  return (
    <section className="flex flex-1">
      <div className="common-container">
        <div className="w-full max-w-5xl gap-3 flex-start">
          <LuImagePlus size={42} />
          <h2 className="w-full text-left h3-bold md:h2-bold">Create Post</h2>
        </div>

        <PostForm action="Create" />
      </div>
    </section>
  );
}

export default CreatePost;
