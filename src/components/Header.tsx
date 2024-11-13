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
    <header className="header">
      <Search />
      <div className=" sidebar-user-info">
        <Image
          src={
            avatar ||
            "https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg"
          }
          alt="Avatar"
          width={44}
          height={44}
          className="sidebar-user-avatar"
        />
        <div className="hidden lg:block">
          {fullName && <p className="subtitle-2 capitalize">{fullName}</p>}
          {email && <p className="caption">{email}</p>}
        </div>
      </div>
      <div className="header-wrapper">
        <FileUploader ownerId={userId} accountId={accountId} />
        <form onSubmit={handleSignOut}>
          <Button type="submit" className="sign-out-button">
            <Image
              src="/assets/icons/logout.svg"
              alt="logo"
              width={24}
              height={24}
              className="w-6"
            />
          </Button>
        </form>
      </div>
    </header>
  );
};

export default Header;
