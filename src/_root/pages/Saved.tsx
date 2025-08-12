import { IoBookmarkOutline } from "react-icons/io5";
import { useGetCurrentUser } from "@/services/react-query/queriesAndMutations";
import Loader from "@/components/shared/Loader";
import type { Models } from "appwrite";
import GridPostList from "@/components/shared/GridPostList";

function Saved() {
  const { data: currentUser, isPending } = useGetCurrentUser();

  const savePosts = currentUser?.save
    .map((savePost: Models.Document) => ({
      ...savePost.post, // spreads the post fields
      creator: {
        imageUrl: currentUser.imageUrl, // adds creator field
      },
    }))
    .reverse();

  return (
    <div className="saved-container">
      <div className="flex items-center w-full max-w-5xl gap-2">
        <IoBookmarkOutline size={36} />
        <h2 className="w-full text-left h3-bold md:h2-bold">Saved Posts</h2>
      </div>

      {!currentUser && isPending ? (
        <Loader />
      ) : (
        <ul className="flex justify-center w-full max-w-5xl gap-9">
          {savePosts.length === 0 ? (
            <p className="text-muted-foreground">No available posts.</p>
          ) : (
            <GridPostList posts={savePosts} showStats={false} />
          )}
        </ul>
      )}
    </div>
  );
}

export default Saved;
