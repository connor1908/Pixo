import { useUserContext } from "@/context/AuthContext";
import type { Models } from "appwrite";
import { Link } from "react-router";
import PostStats from "./PostStats";

type GridPostProps = {
  posts: Models.Document[] | undefined;
  showUser?: boolean;
  showStats?: boolean;
};

function GridPostList({
  posts,
  showUser = true,
  showStats = true,
}: GridPostProps) {
  const { user } = useUserContext();
  return (
    <ul className="grid-container">
      {posts?.map((post) => (
        <li key={post.$id} className="relative min-w-80 h-80">
          <Link to={`/posts/${post.$id}`} className="grid-post_link">
            <img
              src={post.imageUrl}
              alt="post"
              className="object-cover w-full h-full"
            />
          </Link>

          <div className="grid-post_user">
            {showUser && (
              <div className="flex items-center justify-start flex-1 gap-2">
                <img
                  src={post.creator.imageUrl}
                  alt="creator"
                  className="object-cover w-8 h-8 rounded-full"
                />
                <p className="line-clamp-1">{post.creator.name}</p>
              </div>
            )}
            {showStats && <PostStats post={post} userId={user.id} />}
          </div>
        </li>
      ))}
    </ul>
  );
}

export default GridPostList;
