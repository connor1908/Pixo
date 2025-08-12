import Loader from "@/components/shared/Loader";
import { PostCard } from "@/components/shared/PostCard";
import { useGetRecentPosts } from "@/services/react-query/queriesAndMutations";
import type { Models } from "appwrite";

function Home() {
  const {
    data: posts = { documents: [], total: 0 },
    isPending: isPostLoading,
  } = useGetRecentPosts();

  if (isPostLoading) {
    return <Loader />;
  }

  return (
    <section className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="w-full text-left h3-bold md:h2-bold">Home Feed</h2>
          {posts.documents.length > 0 ? (
            <ul className="flex flex-col flex-1 w-full gap-9">
              {posts.documents.map((post: Models.Document) => (
                <PostCard key={post.$id} post={post} />
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">
              No posts to show.Try adding with create post option.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default Home;
