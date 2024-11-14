'use client'
import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Search from "@/components/Search";
import FileUploader from "@/components/FileUploader";
import { signOutUser } from "@/lib/actions/user.action";

interface HeaderProps {
  userId: string;
  accountId: string;
  fullName: string;
  email: string;
  avatar?: string;
}

const Header = ({ userId, accountId, fullName, email, avatar }: HeaderProps) => {
  const handleSignOut = async (event: React.FormEvent) => {
    event.preventDefault();
    await signOutUser();
  };

  return (
    <header className="header flex flex-col lg:flex-row justify-between items-center p-4">
      {/* Search bar */}
      <div className="flex-grow mb-4 lg:mb-0">
        <Search />
      </div>
      
      {/* User info section */}
      <div className="flex items-center bg-brand-100 p-[10px] rounded-full space-x-4 mb-4 lg:mb-0">
        <Image
          src={
            avatar ||
            "https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg"
          }
          alt="Avatar"
          width={44}
          height={44}
          className="sidebar-user-avatar  rounded-full"
        />
        <div className="hidden lg:block">
          {fullName && <p className="subtitle-2 capitalize">{fullName}</p>}
          {email && <p className="caption">{email}</p>}
        </div>
      </div>

      {/* File uploader and sign-out */}
      <div className="flex items-center space-x-4">
        <FileUploader ownerId={userId} accountId={accountId} />
        
        <form onSubmit={handleSignOut}>
          <Button type="submit" className="sign-out-button p-2 rounded-md bg-red-600 hover:bg-red-700">
            <Image
              src="/assets/icons/logout.svg"
              alt="Sign Out"
              width={24}
              height={24}
              className="w-6 h-6"
            />
          </Button>
        </form>
      </div>
    </header>
  );
};

export default Header;
