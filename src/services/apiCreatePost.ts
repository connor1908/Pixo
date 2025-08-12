import type { INewPost, IUpdatePost } from "@/types/types";
import { appwrite, databases, storage } from "./appwrite";
import { ID, Query } from "appwrite";

export async function createPost(post: INewPost) {
  try {
    //upload image to storage
    const uploadedFile = await uploadFile(post.file[0]);

    if (!uploadedFile) return;

    //Get the file url
    const fileUrl = await getFilePreview(uploadedFile.$id);

    //if file is not there or it is corrupted, delete it
    if (!fileUrl) {
      await deleteFile(uploadedFile.$id);
      return;
    }

    //convert tags string into in an array
    // const tags = post?.tags?.replace(/ /g, "").split(", ") || [];
    const tags = post?.tags?.split(",").map((tag) => tag.trim()) || [];

    //save post to database
    const newPost = await databases.createDocument(
      appwrite.databaseId,
      appwrite.postsCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        imageUrl: fileUrl,
        imageId: uploadedFile.$id,
        location: post.location,
        tags: tags,
      }
    );

    //if no newPost found or it is corrupted, delete it
    if (!newPost) {
      await deleteFile(uploadedFile.$id);
      return;
    }

    //creation of newPost
    return newPost;

    //Save the post to the database
  } catch (error) {
    console.error(error);
  }
}

//upload file to a storage
export async function uploadFile(file: File) {
  try {
    const uploadedFile = await storage.createFile(
      appwrite.storageId,
      ID.unique(),
      file
    );
    return uploadedFile;
  } catch (error) {
    console.error(error);
  }
}

//get fileUrl from the storage
export async function getFilePreview(fileId: string) {
  try {
    //Paid Version
    // const fileUrl = storage.getFilePreview(
    //   appwrite.storageId,
    //   fileId,
    //   2000,
    //   2000,
    //   ImageGravity.Top,
    //   100
    // );
    const fileUrl = storage.getFileView(appwrite.storageId, fileId);
    return fileUrl;
  } catch (error) {
    console.error(error);
  }
}

//delete file from the storage
export async function deleteFile(fileId: string) {
  try {
    await storage.deleteFile(appwrite.storageId, fileId);
  } catch (error) {
    console.error(error);
  }
}

//get Recent posts
export async function getRecentPosts() {
  try {
    const posts = await databases.listDocuments(
      appwrite.databaseId,
      appwrite.postsCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(20)]
    );

    if (!posts) return;
    return posts;
  } catch (error) {
    console.error(error);
  }
}

//like posts
export async function likePost(postId: string, likesArray: string[]) {
  try {
    const updatedPost = await databases.updateDocument(
      appwrite.databaseId,
      appwrite.postsCollectionId,
      postId,
      { likes: likesArray }
    );
    if (!updatedPost) return;
    return updatedPost;
  } catch (error) {
    console.error(error);
  }
}

//save posts
export async function savePost(postId: string, userId: string) {
  try {
    const savedPost = await databases.createDocument(
      appwrite.databaseId,
      appwrite.savesCollectionId,
      ID.unique(),
      { user: userId, post: postId }
    );
    if (!savedPost) return;

    return savedPost;
  } catch (error) {
    console.error(error);
  }
}

//deleted save posts
export async function deleteSavedPost(savedId: string) {
  try {
    await databases.deleteDocument(
      appwrite.databaseId,
      appwrite.savesCollectionId,
      savedId
    );
  } catch (error) {
    console.error(error);
  }
}

//get post by id
export async function getPostById(postId: string) {
  try {
    const post = await databases.getDocument(
      appwrite.databaseId,
      appwrite.postsCollectionId,
      postId
    );

    if (!post) return;

    return post;
  } catch (error) {
    console.error(error);
  }
}

export async function updatePost(post: IUpdatePost) {
  const hasFileToUpdate = post.file.length > 0;
  try {
    let image = {
      imageUrl: post.imageUrl,
      imageId: post.imageId,
    };

    if (hasFileToUpdate) {
      //upload image to storage
      const uploadedFile = await uploadFile(post.file[0]);

      if (!uploadedFile) return;

      //Get the file url
      const fileUrl = await getFilePreview(uploadedFile.$id);

      //if file is not there or it is corrupted, delete it
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        return;
      }
      //set new image data
      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };

      // Delete the old image AFTER new one is confirmed working
      if (post.imageId) {
        await deleteFile(post.imageId);
      }
    }

    //convert tags string into in an array
    // const tags = post?.tags?.replace(/ /g, "").split(", ") || [];
    const tags = post?.tags?.split(",").map((tag) => tag.trim()) || [];

    //save post to database
    const updatedPost = await databases.updateDocument(
      appwrite.databaseId,
      appwrite.postsCollectionId,
      post.postId,
      {
        caption: post.caption,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
        location: post.location,
        tags: tags,
      }
    );

    //if no newPost found or it is corrupted, delete it
    if (!updatedPost) {
      await deleteFile(post.imageId);
      return;
    }

    //creation of newPost
    return updatedPost;

    //Save the post to the database
  } catch (error) {
    console.error(error);
  }
}

export async function deletePost(postId: string, imageId: string) {
  if (!postId || !imageId) return;

  //Delete the image from the databases
  try {
    await databases.deleteDocument(
      appwrite.databaseId,
      appwrite.postsCollectionId,
      postId
    );

    // Delete the image from storage
    await storage.deleteFile(appwrite.storageId, imageId);
  } catch (error) {
    console.error(error);
  }
}

export async function getInfinitePosts({ pageParam }: { pageParam: number }) {
  const queries = [Query.orderDesc("$updatedAt"), Query.limit(10)];

  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()));
  }

  try {
    const posts = await databases.listDocuments(
      appwrite.databaseId,
      appwrite.postsCollectionId,
      queries
    );

    if (!posts) return;

    return posts;
  } catch (error) {
    console.error(error);
  }
}

export async function searchPosts(searchTerm: string) {
  try {
    const posts = await databases.listDocuments(
      appwrite.databaseId,
      appwrite.postsCollectionId,
      [Query.search("caption", searchTerm)]
    );

    if (!posts) return;

    return posts;
  } catch (error) {
    console.error(error);
  }
}
