"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "User", href: "/user" },
  { name: "Contact", href: "/contact" },
];

const Header = () => {
  const pathname = usePathname();

  return (
    <header className="text-gray-400 bg-gray-900 body-font">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        {/* Site title / brand link instead of duplicate "Home" */}
        <Link href="/" className="text-white font-bold text-xl">
          Kapil Sarkar
        </Link>

        <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname === link.href || pathname.startsWith(`${link.href}/`);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`mr-5 transition-colors ${
                  isActive
                    ? "text-pink-500 font-semibold border-b-2 border-pink-500 pb-1"
                    : "hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

export default Header;