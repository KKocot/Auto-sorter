import Link from "next/link";
import React, { ReactNode } from "react";

interface NavLinkProps {
  children: ReactNode;
  href: string;
}
const NavLink = ({ children, href }: NavLinkProps) => {
  return (
    <Link href={href}>
      <a className="p-1 bg-indigo-400 border-b-4 rounded-t border-transparent hover:border-green-500">
        {children}
      </a>
    </Link>
  );
};

export const Navbar = () => {
  return (
    <div className="flex gap-6 ml-12 uppercase font-bold">
      <NavLink href="/">List</NavLink>
      <NavLink href="/add">Add</NavLink>
    </div>
  );
};
