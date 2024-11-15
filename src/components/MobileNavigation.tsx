"use client";

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { Separator } from "@radix-ui/react-separator";
import { navItems } from ".././../constants";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import FileUploader from "@/components/FileUploader";
import { signOutUser } from "../lib/actions/user.action";
import { Github, Linkedin, Mail } from "lucide-react";

interface Props {
  $id: string;
  accountId: string;
  fullName: string;
  avatar: string;
  email: string;
}

const MobileNavigation = ({
  $id: ownerId,
  accountId,
  fullName,
  avatar,
  email,
}: Props) => {
  const [copySuccess, setCopySuccess] = useState("");

  const copyToClipboard = () => {
    navigator.clipboard.writeText(email)
      .then(() => {
        setCopySuccess("Email copied!");
        setTimeout(() => setCopySuccess(""), 2000); // Reset message after 2 seconds
      })
      .catch((err) => console.error("Failed to copy email:", err));
  };
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Default avatar fallback for when avatar prop is empty or invalid
  const avatarSrc = avatar || "https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg";

  return (
    <header className="ml-[4px] mobile-header">
      {/* Logo */}
      <Image
        src="/newlogo.png"
        alt="logo"
        width={150}
        height={52}
        className="h-auto"
        priority
      />

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button className="border-none bg-transparent">
            <Image
              src="/assets/icons/menu.svg"
              alt="Menu"
              width={30}
              height={30}
              priority
            />
          </button>
        </SheetTrigger>
        
        <SheetContent className="shad-sheet h-screen px-3">
          <SheetTitle asChild>
            <div>
              <div className="header-user">
                <Image
                  src={avatarSrc}
                  alt="profile avatar"
                  width={44}
                  height={44}
                  className="header-user-avatar"
                  priority
                />
                <div className="sm:hidden lg:block">
                  <p className="subtitle-2 capitalize">{fullName}</p>
                  <p className="caption">{email}</p>
                </div>
              </div>
              <Separator className="mb-4 bg-light-200/20" />
            </div>
          </SheetTitle>

          <nav className="mobile-nav">
            <ul className="mobile-nav-list">
              {navItems.map(({ url, name, icon }) => {
                // Ensure icon path exists
                const iconSrc = icon || "/assets/icons/default-icon.svg";
                
                return (
                  <Link 
                    key={name} 
                    href={url} 
                    className="lg:w-full"
                    onClick={() => setOpen(false)}
                  >
                    <li
                      className={cn(
                        "mobile-nav-item",
                        pathname === url && "shad-active"
                      )}
                    >
                      <Image
                        src={iconSrc}
                        alt={name}
                        width={24}
                        height={24}
                        className={cn(
                          "nav-icon",
                          pathname === url && "nav-icon-active"
                        )}
                      />
                      <p>{name}</p>
                    </li>
                  </Link>
                );
              })}
            </ul>
          </nav>

          <Separator className="my-5 bg-light-200/20" />

          <div className="flex flex-col justify-between gap-5 pb-5">
            <FileUploader ownerId={ownerId} accountId={accountId} />
            <Button
              type="button"
              className="mobile-sign-out-button"
              onClick={async () => {
                await signOutUser();
                setOpen(false);
              }}
            >
              <Image
                src="/assets/icons/logout.svg"
                alt="logout"
                width={24}
                height={24}
                priority
              />
              <p>Logout</p>
            </Button>
          </div>
          <div className="mt-auto p-4 bg-[#0066FF] rounded-2xl">
  <h3 className="text-lg font-medium mb-4 text-white">Let&apos;s Connect ;)</h3>
  <ul className="flex flex-col gap-3">
    <Link 
      href="https://github.com/mehulsingh1010" 
      target="_blank" 
      rel="noopener noreferrer"
    >
      <li className="flex items-center gap-3 text-white hover:opacity-80 transition-opacity">
        <Github size={20} />
        <p className="text-sm">GitHub</p>
      </li>
    </Link>
    <Link 
      href="https://www.linkedin.com/in/mehul-singh-73154b251/" 
      target="_blank" 
      rel="noopener noreferrer"
    >
      <li className="flex items-center gap-3 text-white hover:opacity-80 transition-opacity">
        <Linkedin size={20} />
        <p className="text-sm">LinkedIn</p>
      </li>
    </Link>
    <li 
      onClick={copyToClipboard} 
      className="flex items-center gap-3 text-white cursor-pointer hover:opacity-80 transition-opacity"
    >
      <Mail size={20} />
      <p className="text-sm">Email</p>
    </li>
    {copySuccess && (
      <p className="text-sm text-white mt-1">{copySuccess}</p>
    )}
  </ul>
</div>

        </SheetContent>
      </Sheet>
    </header>
  );
};

export default MobileNavigation;