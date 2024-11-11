  "use server";

  import { Account, Avatars, Client, Databases, Storage } from "node-appwrite";
  import { appwriteConfig } from "@/lib/appwrite/config";
  import { Query, ID } from "node-appwrite";
  import { parseStringify } from "@/lib/utils";
  import { cookies } from "next/headers";
  import { redirect } from "next/navigation";
  import { avatarPlaceholderUrl } from "../../../constants";

  // Utility to create session client for authenticated requests
  export const createSessionClient = async () => {
    const client = new Client()
      .setEndpoint(appwriteConfig.url)
      .setProject(appwriteConfig.projectId);

    const session = (await cookies()).get("appwrite-session");

    console.log("Retrieved session:", session?.value);
    if (!session || !session.value) throw new Error("No session");

    client.setSession(session.value);

    return {
      get account() {
        return new Account(client);
      },
      get databases() {
        return new Databases(client);
      },
    };
  };

  // Utility to create admin client for unauthenticated requests
  export const createAdminClient = async () => {
    const client = new Client()
      .setEndpoint(appwriteConfig.endpointUrl)
      .setProject(appwriteConfig.projectId)
      .setKey(appwriteConfig.secretKey);

    return {
      get account() {
        return new Account(client);
      },
      get databases() {
        return new Databases(client);
      },
      get storage() {
        return new Storage(client);
      },
      get avatars() {
        return new Avatars(client);
      },
    };
  };

  // Get user by email
  const getUserByEmail = async (email: string) => {
    try {
      const { databases } = await createAdminClient();
      const result = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        [Query.equal("email", [email])]
      );
      return result.total > 0 ? result.documents[0] : null;
    } catch (error) {
      console.error("Error getting user by email:", error);
      throw error;
    }
  };

  // Send OTP via email
  export const sendEmailOTP = async ({ email }: { email: string }) => {
    const { account } = await createAdminClient();
    try {
      console.log("Sending OTP to email:", email);
      const session = await account.createEmailToken(ID.unique(), email);
      console.log("Email token created:", session);
      return session.userId;
    } catch (error) {
      console.error("Failed to send email OTP:", error);
      throw error;
    }
  };

  // Create a new account or send OTP if user exists
  export const createAccount = async ({
    fullName,
    email,
  }: {
    fullName: string;
    email: string;
  }) => {
    try {
      const existingUser = await getUserByEmail(email);
      console.log("Existing user check:", existingUser);

      const accountId = await sendEmailOTP({ email });
      if (!accountId) throw new Error("Failed to send an OTP");

      if (!existingUser) {
        const { databases } = await createAdminClient();
        const newUser = await databases.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.usersCollectionId,
          ID.unique(),
          {
            fullName,
            email,
            avatar: avatarPlaceholderUrl,
            accountId,
          }
        );
        console.log("New user created:", newUser);
      }

      return parseStringify({ accountId });
    } catch (error) {
      console.error("Error creating account:", error);
      throw error;
    }
  };

  // Verify OTP and create session
  export const verifySecret = async ({
    accountId,
    password,
  }: {
    accountId: string;
    password: string;
  }) => {
    try {
      console.log("Verifying secret for account:", accountId);
      const { account } = await createAdminClient();

      const session = await account.createSession(accountId, password);
      console.log("Session created:", session);

      const cookieStore = await cookies();
      cookieStore.set("appwrite-session", session.secret, {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      });

      console.log("Session cookie set:", cookieStore.get("appwrite-session"));

      return parseStringify({ sessionId: session.$id });
    } catch (error) {
      console.error("Failed to verify OTP:", error);
      throw error;
    }
  };

  // Get current user based on session
  export const getCurrentUser = async () => {
    try {
      const { databases, account } = await createSessionClient();

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
      console.error("Error getting current user:", error);
      return null;
    }
  };

  // Sign out user and clear session cookie
  export const signOutUser = async () => {
    try {
      const { account } = await createSessionClient();
      console.log("Signing out user");

      await account.deleteSession("current");
      const cookieStore = await cookies();
      cookieStore.delete("appwrite-session");
      
      console.log("User signed out successfully");
    } catch (error) {
      console.error("Failed to sign out user:", error);
      throw error;
    } finally {
      redirect("/sign-in");
    }
  };

  // Sign in existing user by sending OTP
  export const signInUser = async ({ email }: { email: string }) => {
    try {
      console.log("Attempting to sign in user:", email);
      const existingUser = await getUserByEmail(email);

      if (existingUser) {
        const accountId = await sendEmailOTP({ email });
        console.log("OTP sent to existing user");
        return parseStringify({ accountId: existingUser.accountId });
      }

      console.log("User not found");
      return parseStringify({ accountId: null, error: "User not found" });
    } catch (error) {
      console.error("Failed to sign in user:", error);
      throw error;
    }
  };
