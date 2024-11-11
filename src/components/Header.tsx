'use client'
import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Search from "@/components/Search";
import FileUploader from "@/components/FileUploader";
import { signOutUser } from "../lib/actions/user.action";
import { useRouter } from "next/navigation";

const Header = ({
  userId,
  accountId,
}: {
  userId: string;
  accountId: string;
}) => {
  const router = useRouter();

  const handleSignOut = async () => {
    // Clear session data and sign out
    await signOutUser();

    // Clear client-side tokens or cookies
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken"); // if stored in localStorage
      document.cookie = "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"; // if stored in cookies
    }

    // Redirect to sign-in page
    router.push("/sign-in");
  };

  return (
    <header className="header">
      <Search />
      <div className="header-wrapper">
        <FileUploader ownerId={userId} accountId={accountId} />
        <Button onClick={handleSignOut} className="sign-out-button">
          <Image
            src="/assets/icons/logout.svg"
            alt="logo"
            width={24}
            height={24}
            className="w-6"
          />
        </Button>
      </div>
    </header>
  );
};

export default Header;
