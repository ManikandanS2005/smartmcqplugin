"use client";

import React, { useState, useRef, useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function Navbar() {
  const { data: session } = useSession();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownTimeout = useRef(null);
  const dropdownRef = useRef(null);

  const openDropdown = () => {
    if (dropdownTimeout.current) {
      clearTimeout(dropdownTimeout.current);
      dropdownTimeout.current = null;
    }
    setDropdownOpen(true);
  };

  const closeDropdown = () => {
    dropdownTimeout.current = setTimeout(() => {
      setDropdownOpen(false);
      dropdownTimeout.current = null;
    }, 4000);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
        if (dropdownTimeout.current) {
          clearTimeout(dropdownTimeout.current);
          dropdownTimeout.current = null;
        }
      }
    }

    if (dropdownOpen) {
      window.addEventListener("click", handleClickOutside);
    } else {
      window.removeEventListener("click", handleClickOutside);
    }

    return () => window.removeEventListener("click", handleClickOutside);
  }, [dropdownOpen]);

  useEffect(() => {
    return () => {
      if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-gray-900 text-white shadow-md shadow-white/10 px-4 py-2 flex items-center justify-between">
      {/* Logo */}
      <div className="text-2xl font-bold">SMARTPLUGIN</div>

      {/* Auth buttons or profile */}
      {session ? (
        <div
          className="relative"
          ref={dropdownRef}
          onMouseEnter={openDropdown}
          onMouseLeave={closeDropdown}
        >
          <Avatar className="cursor-pointer">
            <AvatarImage
              src={session.user?.image || "/default-avatar.png"}
              alt="User"
              referrerPolicy="no-referrer"
            />
            <AvatarFallback>
              {session.user?.name?.[0].toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>

          {/* Dropdown for logout */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-28 bg-gray-800 border border-gray-600 rounded-md shadow-lg p-2 text-center">
              <button
                onClick={() => signOut()}
                className="w-full bg-red-700 hover:bg-red-600 text-white rounded py-1 font-semibold"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-end flex-grow">
          <Button
            onClick={() => setDialogOpen(true)}
            className="bg-blue-900 hover:bg-blue-700"
          >
            Login
          </Button>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <span />
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Sign in</DialogTitle>
                <DialogDescription>
                  Sign in with your Google account to continue.
                </DialogDescription>
              </DialogHeader>

              <DialogFooter>
                <Button
                  className="w-full"
                  onClick={() => {
                    setDialogOpen(false);
                    signIn("google", { prompt: "select_account" });
                  }}
                >
                  Sign in with Google
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </header>
  );
}
