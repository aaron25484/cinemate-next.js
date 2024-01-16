"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";

interface Movie {
  id: string;
  name: string;
  score: number;
  poster: string;
  genreId: string;
  isInWatchlist?: boolean;

}

interface MovieContextProps {
  children: ReactNode;
}

interface MovieContextValue {
  movies: Movie[];
  watchlist: Movie[];
  updateMovies: (newMovies: Movie[]) => void;
  addToWatchlist: (movieId: string) => void;
  removeFromWatchlist: (movieId: string) => void;
  getUserWatchlist: (email: string) => void;
}

const MovieContext = createContext<MovieContextValue | undefined>(undefined);

export const MovieProvider: React.FC<MovieContextProps> = ({ children }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const url = process.env.NEXT_PUBLIC_API_URL;

  const { user } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const moviesResponse = await fetch(`${url}movies`);
        
        if (moviesResponse.ok) {
          const updatedMovies = await moviesResponse.json();
          setMovies(updatedMovies);
        } else {
          console.error(`Failed to fetch movies: ${moviesResponse.statusText}`);
        }
  
        if (user) {
          const watchlistResponse = await fetch(`${url}users/${user.email}/watchlist`);
  
          if (watchlistResponse.ok) {
            const watchlistData = await watchlistResponse.json();
            setWatchlist(watchlistData);
          } else {
            console.error(`Failed to fetch watchlist: ${watchlistResponse.statusText}`);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, [user]);

  const updateMovies = (newMovies: Movie[]) => {
    setMovies(newMovies);
  };
  

  const addToWatchlist = async (movieId: string) => {
    try {
      if (user) {
        const response = await fetch(
          `${url}users/${user?.email}/watchlist`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ movieId }),
          }
        );

        if (response.ok) {
          setWatchlist((prevWatchlist) => [
            ...prevWatchlist,
            { id: movieId, name: "", score: 0, poster: "", genreId: "" },
          ]);
        } else {
          console.error(
            `Failed to add movie to watchlist: ${response.statusText}`
          );
        }
      } else {
        console.warn("User not authenticated. Cannot add to watchlist.");
      }
    } catch (error) {
      console.error("Error adding movie to watchlist:", error);
    }
  };

const removeFromWatchlist = async (movieId: string) => {
  try {
    if (user) {
      const response = await fetch(
        `${url}users/${user?.email}/watchlist`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ movieId, action: "toggle" }),
        }
      );

      if (response.ok) {
        return response.json();  
      } else {
        console.error(
          `Failed to remove movie from watchlist: ${response.statusText}`
        );
        return null;
      }
    } else {
      console.warn("User not authenticated. Cannot remove from watchlist.");
      return null;
    }
  } catch (error) {
    console.error("Error removing movie from watchlist:", error);
    return null;
  }
};

  const getUserWatchlist = async (email: string): Promise<Movie[] | null> => {
    try {
      const response = await fetch(`${url}users/${email}/watchlist`);
      
      if (response.ok) {
        const watchlist = await response.json();
        return watchlist;
      } else if (response.status === 404) {
        console.error("User not found");
        return null;
      } else {
        console.error(`Failed to fetch user watchlist: ${response.statusText}`);
        return null;
      }
    } catch (error) {
      console.error("Error fetching user watchlist:", error);
      return null;
    }
  };

  const value = {
    movies,
    watchlist,
    updateMovies,
    addToWatchlist,
    getUserWatchlist,
    removeFromWatchlist,
  };

  return (
    <MovieContext.Provider value={value}>{children}</MovieContext.Provider>
  );
};

export const useMovieContext = () => {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error("useMovieContext must be used within a MovieProvider");
  }
  return context;
};
