import { Account, Avatars, Client, Databases, Storage } from "appwrite";

interface Appwrite {
  projectId: string;
  url: string;
  databaseId: string;
  storageId: string;
  usersCollectionId: string;
  postsCollectionId: string;
  savesCollectionId: string;
}

export const appwrite: Appwrite = {
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
  url: import.meta.env.VITE_APPWRITE_URL,

  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
  storageId: import.meta.env.VITE_APPWRITE_STORAGE_ID,

  usersCollectionId: import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID,
  postsCollectionId: import.meta.env.VITE_APPWRITE_POSTS_COLLECTION_ID,
  savesCollectionId: import.meta.env.VITE_APPWRITE_SAVES_COLLECTION_ID,
};

//setting up our client
export const client = new Client();
client.setProject(appwrite.projectId);
client.setEndpoint(appwrite.url);

//setting other main things
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);
