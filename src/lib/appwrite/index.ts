import { Account, Avatars, Client, Databases, Models, Query, Storage } from "node-appwrite";
import { appwriteConfig } from "./config";
import { cookies } from "next/headers";

export const createSessionClient = async () => {
  if (!appwriteConfig.url || !appwriteConfig.projectId) {
    throw new Error("Missing required configuration");
  }

  const client = new Client();
  
  // Ensure the endpoint is properly set
  client.setEndpoint(appwriteConfig.url);
  client.setProject(appwriteConfig.projectId);

  const cookieStore = await cookies();
  const session = cookieStore.get("appwrite-session");

  if (!session?.value) {
    throw new Error("No session found");
  }

  client.setSession(session.value);

  return {
    account: new Account(client),
    databases: new Databases(client),
    storage: new Storage(client)
  };
};

export const createAdminClient = async () => {
  if (!appwriteConfig.url || !appwriteConfig.projectId || !appwriteConfig.secretKey) {
    throw new Error("Missing required configuration");
  }

  const client = new Client();
  
  // Ensure the endpoint is properly set
  client.setEndpoint(appwriteConfig.url);
  client.setProject(appwriteConfig.projectId);
  client.setKey(appwriteConfig.secretKey);

  return {
    account: new Account(client),
    databases: new Databases(client),
    storage: new Storage(client),
    avatars: new Avatars(client)
  };
};

// lib/actions/user.action.ts
export const getCurrentUser = async () => {
  try {
    const { databases, account } = await createSessionClient();

    // Add debug logging
    console.log('Session client created successfully');
    console.log('Appwrite endpoint:', appwriteConfig.url);
    
    try {
      const accountDetails = await account.get();
      console.log("Account details:", accountDetails);

      const user = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        [Query.equal("accountId", accountDetails.$id)]
      );

      if (user.total <= 0) {
        console.log("No user found for account");
        return null;
      }

      return parseStringify(user.documents[0]);
    } catch (error) {
      console.error('Error in account operations:', error);
      throw error;
    }
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};

function parseStringify(arg0: Models.Document) {
  throw new Error("Function not implemented.");
}
