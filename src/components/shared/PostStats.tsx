import { checkIsLiked } from "@/lib/utils";
import {
  useDeleteSavedPost,
  useGetCurrentUser,
  useLikePost,
  useSavePost,
} from "@/services/react-query/queriesAndMutations";
import type { Models } from "appwrite";
import { useEffect, useState } from "react";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";
import { IoBookmark, IoBookmarkOutline } from "react-icons/io5";

type PostStatsProps = {
  post?: Models.Document;
  userId: string;
};

function PostStats({ post, userId }: PostStatsProps) {
  //current likes on a specific post
  //gives back all the list of users who liked that post
  const likesList = post?.likes.map((user: Models.Document) => user.$id);

  const [likes, setLikes] = useState(likesList);
  const [isSaved, setIsSaved] = useState(false);

  const { mutate: likePost } = useLikePost();
  const { mutate: savePost } = useSavePost();
  const { mutate: deleteSavedPost } = useDeleteSavedPost();

  const { data: currentUser } = useGetCurrentUser();

  const isLiked = checkIsLiked(likes, userId);

  const savedPostRecord = currentUser?.save.find(
    (record: Models.Document) => record.post.$id === post?.$id
  );

  useEffect(() => {
    // setIsSaved(savedPostRecord ? true : false);
    //same as
    setIsSaved(!!savedPostRecord);
  }, [currentUser, savedPostRecord]);

  function handleLikePost(e: React.MouseEvent) {
    //so that it doesn't goes to the post details and only do like functionality
    e.stopPropagation();

    //we cant directly send likes to (likesArray: likes)(line 48) as setLikes is async and doesn't
    //immediately updates the likes state so we first clone it
    let newLikes = [...likes];
    const hasLiked = likes.includes(userId);

    if (hasLiked) {
      newLikes = newLikes.filter((id) => id !== userId); // remove userId
    } else {
      newLikes.push(userId); // add userId
    }

    setLikes(newLikes);
    likePost({ postId: post?.$id || "", likesArray: newLikes });
  }

  function handleSavePost(e: React.MouseEvent) {
    e.stopPropagation();

    if (savedPostRecord) {
      setIsSaved(false);
      deleteSavedPost(savedPostRecord.$id);
    } else {
      setIsSaved(true);
      savePost({ postId: post?.$id || "", userId });
    }
  }

  return (
    <div className="z-20 mt-4 flex-between">
      <div className="flex items-center gap-2 mr-4">
        <button onClick={handleLikePost} className="p-1 cursor-pointer">
          {isLiked ? (
            <IoIosHeart size={20} className="text-secondary" />
          ) : (
            <IoIosHeartEmpty size={20} />
          )}
        </button>
        <p className="small-medium lg:base-medium">{likes?.length}</p>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={handleSavePost} className="p-1 cursor-pointer">
          {isSaved ? (
            <IoBookmark size={20} className="text-secondary" />
          ) : (
            <IoBookmarkOutline size={20} />
          )}
        </button>
      </div>
    </div>
  );
}

export default PostStats;
