/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import Image from "next/image";
import Link from "next/link";
import { navItems } from "../../constants";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Github, Linkedin, Mail } from 'lucide-react';
import { useState } from "react";

interface SidebarProps {
  fullName: string;
  email: string;
  avatar?: string;
}

const Sidebar = ({ fullName, email, avatar }: SidebarProps) => {
  const pathname = usePathname();
  const [copySuccess, setCopySuccess] = useState("");

  const copyToClipboard = () => {
    navigator.clipboard.writeText(email)
      .then(() => {
        setCopySuccess("Email copied!");
        setTimeout(() => setCopySuccess(""), 2000); // Reset message after 2 seconds
      })
      .catch((err) => console.error("Failed to copy email:", err));
  };

  return (
    <aside className="sidebar">
      <Link href="/">
        <Image
          src="/newlogo.png"
          alt="logo"
          width={200}
          height={100}
          className="hidden h-auto mb-[-14px] mt-[-9.5px] ml-[10px] lg:block"
        />
        <Image
          src="/assets/icons/logo-brand.svg"
          alt="logo"
          width={52}
          height={52}
          className="lg:hidden"
        />
      </Link>
      <nav className="sidebar-nav">
        <ul className="flex flex-1 flex-col gap-6">
          {navItems.map(({ url, name, icon }) => (
            <Link key={name} href={url} className="lg:w-full">
              <li
                className={cn(
                  "sidebar-nav-item hover:bg-brand-100 ",
                  pathname === url && "shad-active",
                )}
              >
                {icon && (
                  <Image
                    src={icon}
                    alt={name}
                    width={24}
                    height={24}
                    className={cn(
                      "nav-icon",
                      pathname === url && "nav-icon-active",
                    )}
                  />
                )}
                <p className="hidden lg:block">{name}</p>
              </li>
            </Link>
          ))}
        </ul>
      </nav>
      
      {/* Powered by Appwrite */}
      <div className="flex flex-row items-center mt-4 mb-4">
        <Image
          src="/appwrite.png"  // Ensure this path points to the Appwrite logo in your assets
          alt="Appwrite Logo"
          width={100}
          height={30}
          className="mb-2"
        />
        <p className="text-gray-500 text-sm">Powered by Appwrite</p>
      </div>

      {/* Contact Section */}
      <div className="mt-auto p-4 bg-[#0066FF] rounded-2xl">
        <h3 className="text-lg font-medium mb-4 text-white hidden lg:block">Let&apos;s Connect ;)</h3>
        <ul className="flex flex-col gap-3">
          <Link 
            href="https://github.com/mehulsingh1010" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <li className="flex items-center gap-3 text-white hover:opacity-80 transition-opacity">
              <Github size={20} />
              <p className="hidden lg:block text-sm">GitHub</p>
            </li>
          </Link>
          <Link 
            href="https://www.linkedin.com/in/mehul-singh-73154b251/" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <li className="flex items-center gap-3 text-white hover:opacity-80 transition-opacity">
              <Linkedin size={20} />
              <p className="hidden lg:block text-sm">LinkedIn</p>
            </li>
          </Link>
          <li 
            onClick={copyToClipboard} 
            className="flex items-center gap-3 text-white cursor-pointer hover:opacity-80 transition-opacity"
          >
            <Mail size={20} />
            <p className="hidden lg:block text-sm">Email</p>
          </li>
          {copySuccess && (
            <p className="text-sm text-brand-100 mt-1">{copySuccess}</p>
          )}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
