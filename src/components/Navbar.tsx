"use client";

import { useState, useEffect } from "react";
import MovieModal from "./MovieModal";
import { useUser } from "@auth0/nextjs-auth0/client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createUser } from "../services/user.service";
import Link from "next/link";

const Navbar: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userName, setUserName] = useState<string>();
  const { user, isLoading } =
    useUser();
    const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

  const openModal = () => {
    if (!user) {
      notify("You need to log in to create a movie");
      return;
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const notify = (message: string) => toast.error(message);

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        if (user) {
          const response = await fetch(
            `${NEXT_PUBLIC_API_URL}users/${user?.email}`
          );
          if (response.ok) {
            const userData = await response.json();

            setUserName(userData.name || user?.name);
          } else {
            console.error(`Failed to fetch user data: ${response.statusText}`);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserName();
  }, [user]);

  useEffect(() => {
    const registerUserInMongoDB = async () => {
      if (user) {
        const newUser = {
          name: user.name,
          email: user.email,
          password: user.email,
        };

        try {
          const userData = await createUser(newUser);
        } catch (error) {
          console.error("Error creating user:", error);
        }
      }
    };

    registerUserInMongoDB();
  }, [user]);

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        toastStyle={{
          background: "#3d405b",
          color: "#edf2f4",
        }}
      />
      <nav id="barrita" className="glass-navbar p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            {!user && (
              <img
                src="src/assets/img/logo.png"
                alt="Clapperboard"
                className=" w-40 h-40"
              />
            )}
            {user && userName && (
              <div className="flex items-center">
                <Link href="/user/profile" className="text-white mr-4">
                  Welcome, {userName}
                </Link>
                <img
                  src={user?.picture ?? undefined}
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full"
                />
              </div>
            )}
          </div>
          <Link href="/" className=" text-sky-300 text-4xl font-semibold">
            CineMate
          </Link>

          <div className="flex items-center justify-end space-x-4">
            <button
              onClick={openModal}
              className="glass-button bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition duration-300"
            >
              Create Movie
            </button>
            {user ? (
              <a href="/api/auth/logout"
                className="glass-button bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition duration-300"
              >
                Logout
              </a>
            ) : (
              <a href="/api/auth/login"
                className="glass-button bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition duration-300"
              >
                Login
              </a>
            )}
          </div>
        </div>
      </nav>
      <MovieModal
        isOpen={isModalOpen}
        closeModal={closeModal}
        onClose={closeModal}
      />
    </>
  );
};

export default Navbar;
