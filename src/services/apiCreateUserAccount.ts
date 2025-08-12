import type { INewUser, IUpdateUser } from "@/types/types";
import { account, appwrite, avatars, databases } from "./appwrite";
import { ID, Query } from "appwrite";
import { deleteFile, getFilePreview, uploadFile } from "./apiCreatePost";

//creation of user account in auth
export async function createUserAccount(user: INewUser) {
  try {
    //creation of new account(on auth)
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(user.name);

    //creation of new use(in database)
    //we need these details from auth(newAccount) to save in our database
    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      name: newAccount.name,
      email: newAccount.email,
      username: user.username,
      imageUrl: avatarUrl,
    });

    return newUser;
  } catch (error) {
    console.error(error);
    throw Error;
  }
}

//saving our user in the database with info provided by auth
export async function saveUserToDB(user: {
  accountId: string;
  name: string;
  email: string;
  imageUrl: string;
  username?: string;
}) {
  try {
    const newUser = await databases.createDocument(
      appwrite.databaseId,
      appwrite.usersCollectionId,
      ID.unique(),
      user
    );

    return newUser;
  } catch (error) {
    console.error(error);
    throw Error;
  }
}

export async function signInAccount(user: { email: string; password: string }) {
  try {
    // First, try to delete the current session if it exists
    try {
      await account.deleteSession("current");
    } catch (error) {
      // Ignore if no session exists
      console.error(error);
    }

    //create a new session
    const session = await account.createEmailPasswordSession(
      user.email,
      user.password
    );
    return session;
  } catch (error) {
    console.error(error);
    throw Error;
  }
}

export async function getCurrentUser() {
  try {
    // get currentAccount
    const currentAccount = await account.get();
    //not exists
    if (!currentAccount) return null;
    //if it does exits we need to retrieve it
    const currentUser = await databases.listDocuments(
      appwrite.databaseId,
      appwrite.usersCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) return null;
    return currentUser.documents[0];
  } catch (error) {
    console.error(error);
    return null;
    // throw Error;
  }
}

export async function signOutAccount() {
  try {
    await account.deleteSession("current");
  } catch (error) {
    console.error(error);
  }
}

export async function getUsers(limit?: number) {
  const queries = [Query.orderDesc("$createdAt")];

  if (limit) {
    queries.push(Query.limit(limit));
  }

  try {
    const users = await databases.listDocuments(
      appwrite.databaseId,
      appwrite.usersCollectionId,
      queries
    );

    if (!users) throw Error;

    return users;
  } catch (error) {
    console.log(error);
  }
}

export async function getUserById(userId: string) {
  try {
    const user = await databases.getDocument(
      appwrite.databaseId,
      appwrite.usersCollectionId,
      userId
    );

    if (!user) throw Error;

    return user;
  } catch (error) {
    console.log(error);
  }
}

export async function updateUser(user: IUpdateUser) {
  const hasFileToUpdate = user.file.length > 0;
  try {
    let image = {
      imageUrl: user.imageUrl,
      imageId: user.imageId,
    };

    if (hasFileToUpdate) {
      // Upload new file to appwrite storage
      const uploadedFile = await uploadFile(user.file[0]);
      if (!uploadedFile) return;

      // Get new file url
      const fileUrl = await getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        return;
      }

      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
    }

    //  Update user
    const updatedUser = await databases.updateDocument(
      appwrite.databaseId,
      appwrite.usersCollectionId,
      user.userId,
      {
        name: user.name,
        bio: user.bio,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
      }
    );

    // Failed to update
    if (!updatedUser) {
      // Delete new file that has been recently uploaded
      if (hasFileToUpdate) {
        await deleteFile(image.imageId);
      }
      // If no new file uploaded, just throw error
      throw Error;
    }

    //  Delete old file after successful update
    if (user.imageId && hasFileToUpdate) {
      await deleteFile(user.imageId);
    }

    return updatedUser;
  } catch (error) {
    console.log(error);
  }
}
