/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import Image from "next/image";
import Link from "next/link";
import { navItems } from "../../constants";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

interface SidebarProps {
  fullName: string;
  email: string;
  avatar?: string;
}

const Sidebar = ({ fullName, email, avatar }: SidebarProps) => {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <Link href="/">
        <Image
          src="/Sidebarlogo.png"
          alt="logo"
          width={200}
          height={100}
          className="hidden h-auto ml-[10px] lg:block"
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
                  "sidebar-nav-item",
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
      <Image
        src="/assets/images/files-2.png"
        alt="logo"
        width={506}
        height={418}
        className="w-full"
      />
      {/* <div className="sidebar-user-info">
        <Image
          src={avatar || "https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg"} // Update this to your actual default avatar path
          alt="Avatar"
          width={44}
          height={44}
          className="sidebar-user-avatar"
        />
        <div className="hidden lg:block">
          {fullName && <p className="subtitle-2 capitalize">{fullName}</p>}
          {email && <p className="caption">{email}</p>}
        </div>
      </div> */}
    </aside>
  );
};

export default Sidebar;