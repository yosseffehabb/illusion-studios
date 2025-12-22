"use client";

import { Button } from "../ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Menu, X } from "lucide-react";

function AdminHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div>
      <nav className="fixed z-50 w-full border-b border-wine bg-charcoal backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="shrink-0">
              <span className="text-3xl font-bold text-primarygreen-500">
                Illusion
              </span>
            </div>
            <div className="ml-10 hidden flex-1 items-center justify-between md:flex">
              <div className="flex items-baseline space-x-4">
                <a
                  href="#about"
                  className="px-3 py-2 text-neutral-400 hover:text-primarygreen-500"
                >
                  orders
                </a>
                <a
                  href="#projects"
                  className="px-3 py-2 text-neutral-400 hover:text-primarygreen-500"
                >
                  Products
                </a>
                <a
                  href="#tech"
                  className="px-3 py-2 text-neutral-400 hover:text-primarygreen-500"
                ></a>
              </div>
              <div className="flex items-center space-x-4"></div>
            </div>

            <Button className="bg-primarygreen-500 text-primarygreen-50 hover:bg-primarygreen-700 transition-all duration-300 hidden md:block">
              log out
            </Button>
            <button
              onClick={toggleMobileMenu}
              className="rounded-md p-2 text-silver hover:bg-gray-100 hover:text-wine md:hidden"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-primarygreen-500" />
              ) : (
                <Menu className="h-6 w-6 text-primarygreen-500" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed bottom-0 left-0 right-0 top-16 z-40 bg-white md:hidden"
          >
            <div className="flex flex-col space-y-4 p-4">
              <a
                href="#features"
                className="px-3 py-2 text-silver hover:text-primary"
                onClick={toggleMobileMenu}
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="px-3 py-2 text-silver hover:text-primary"
                onClick={toggleMobileMenu}
              >
                How it Works
              </a>
              <a
                href="#about"
                className="px-3 py-2 text-silver hover:text-primary"
                onClick={toggleMobileMenu}
              >
                About
              </a>

              <div className="space-y-2 pt-4">
                <Button
                  className="foucs:outline-none hover:shadow-glow mb-3 w-full bg-primarygreen-500 text-primarygreen-50 transition-all duration-300 hover:bg-primarygreen-700 focus:ring-2 focus:ring-silver focus:ring-offset-2 sm:w-auto"
                  onClick={() => {
                    handleDownloadCV();
                    toggleMobileMenu();
                  }}
                >
                  Log Out
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AdminHeader;
