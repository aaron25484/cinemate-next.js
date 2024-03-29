"use client";

import React, { useState, useEffect } from "react";
import { useUser, withPageAuthRequired, WithPageAuthRequired } from "@auth0/nextjs-auth0/client";
import MovieCard from "./MovieCard";
import { Movie } from "./MovieCard";
import { getUserByEmail, updateUser } from "../services/user.service";
import { getMovies } from "../services/movie.service";
import { useMovieContext } from "../contexts/movieContext";
import { useUserContext } from "@/contexts/userContext";

interface UserData {
  name: string;
  email: string;
  password: string;
}

const Profile: React.FC = () => {
  const { user } = useUser();
  const {addToWatchlist, removeFromWatchlist, getUserWatchlist} = useMovieContext()
  const [userData, setUserData] = useState<UserData>({
    name: "",
    email: "",
    password: "",
  });
  const [userWatchlist, setUserWatchlist] = useState<Movie[]>([]);
    const { updateUserName } = useUserContext();


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (user) {
          const userEmail = user.email || '';
          const userDataResponse = await getUserByEmail(userEmail);

          if (userDataResponse.ok) {
            const userData = await userDataResponse.json();
            setUserData(userData);

            const watchlistData = await getUserWatchlist(userEmail);

            if (Array.isArray(watchlistData)) {
    
              const movieDetailsPromises = watchlistData.map(async (movieId: string) => {
                const movieDetails = await getMovies(movieId);
                return movieDetails;
              });
    
              const movieDetails = await Promise.all(movieDetailsPromises);
    
              const validMovieDetails = movieDetails.filter((movie: Movie) => movie !== null);
    
              setUserWatchlist(validMovieDetails);
            } else {
              console.error(`Failed to fetch user watchlist`);
            }
          } else {
            console.error(`Failed to fetch user data: ${userDataResponse.statusText}`);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [user]);
  
  const onToggleWatchlist = async (movieId: string) => {
    try {
      if (user) {
        const action = isInWatchlist(movieId) ? "delete" : "add";
  
        const watchlistService =
          action === "delete" ? removeFromWatchlist : addToWatchlist;
  
        await watchlistService(movieId);
            setUserWatchlist((prevWatchlist) => {
            if (prevWatchlist.some((movie) => movie.id === movieId)) {
              return prevWatchlist.filter((movie) => movie.id !== movieId);
            } else {
              return [
                ...prevWatchlist,
                { id: movieId, name: "", score: 0, poster: "", genreId: "" },
              ];
            }
          });
        
      }
    } catch (error) {
      console.error("Error toggling watchlist:", error);
    }
  };

  const isInWatchlist = (movieId: string) => {
    return userWatchlist.some((movie) => movie.id === movieId);
  };

  const handleUpdateUser = async () => {
    try {
      if (user && userData) {

        const updateUserResponse = await updateUser(user.email, userData);

        if (updateUserResponse) {

          updateUserName(userData.name)
        } else {
          console.error(
            `Failed to update user: ${updateUserResponse}`
          );
        }
      }
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <div className="container mx-auto mt-4">
      <div className="mb-4">
        <div className="flex items-center ">
          <img src={user.picture || undefined} alt={user.name || undefined} width={150} height={150} className="rounded-full" />
            <div className="text-white ml-10 justify-around">
              <h4>{user.email}</h4>
              <h4>{userData.name}</h4>
            </div>
      </div>
        
        
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Name:
        </label>
        <input
          type="text"
          className="shadow appearance-none border rounded w-96 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Name"
          value={userData.name}
          onChange={(e) => setUserData({ ...userData, name: e.target.value })}
        />
      </div>
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition duration-300"
        onClick={handleUpdateUser}
      >
        Update Profile
      </button>
      {userWatchlist.length > 0 && (
        <div>
          <h2 className=" text-2xl font-semibold mt-8 mb-4  text-teal-500">Watchlist</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {userWatchlist.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onToggleWatchlist={onToggleWatchlist}
                isInWatchlist={isInWatchlist(movie.id)}
                isRemovable={true} onEdit={function (): void {
                  throw new Error("Function not implemented.");
                } } onDelete={function (movieId: string): void {
                  throw new Error("Function not implemented.");
                } }              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default withPageAuthRequired (Profile);