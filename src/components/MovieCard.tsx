"use client";

import { useState, useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
export interface Movie {
  id: string;
  name: string;
  score: number;
  poster: string;
  genreId: string;
  isInWatchlist?: boolean;
}

interface MovieCardProps {
  movie: Movie;
  onToggleWatchlist: (movieId: string) => void;
  isInWatchlist: boolean;
  isRemovable?: boolean;
}

const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  onToggleWatchlist,
  isInWatchlist,
  isRemovable = false
}) => {
  const { name, score, poster, id, genreId } = movie;
  const [isHovered, setIsHovered] = useState(false);
  const { user } = useUser();
  const [genreName, setGenreName] = useState<string>("Unknown Genre");
  const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
  }, [isInWatchlist])

  useEffect(() => {
    const fetchGenreName = async () => {
      try {
        const response = await fetch(`${NEXT_PUBLIC_API_URL}genres/${genreId}`);

        if (response.ok) {
          const genre = await response.json();
          setGenreName(genre.name);
        } else {
          console.error(
            `Failed to fetch genre details: ${response.statusText}`
          );
        }
      } catch (error) {
        console.error("Error fetching genre details:", error);
      }
    };

    fetchGenreName();
  }, [genreId]);

  const handleToggleWatchlist = () => {
    if (user) {
      onToggleWatchlist(id);
    }
  };


  return (
    <div
      className="glass-container p-3 rounded-md shadow-md mb-3 transition-transform transform hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={poster}
        alt="movie poster"
        className="w-full h-64 object-contain rounded-md mb-3 transition-transform transform hover:scale-110"
      />
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2 text-blue-400">{name}</h2>
        <p className="text-gray-400">Rating: {score}</p>

        {isHovered && user && (
          <button
            onClick={handleToggleWatchlist}
            className={`${
              isInWatchlist ? "bg-red-500" : "bg-blue-500"
            } hover:bg-blue-600 text-white px-4 py-2 rounded-md mt-2  justify-center  transition duration-300`}
            disabled={isInWatchlist && !isRemovable}
            >
            {isRemovable ? "Remove from Watchlist" : isInWatchlist ? "Already in Watchlist" : "Add to Watchlist"}
          </button>
        )}
      </div>
    </div>
  );
};

export default MovieCard;
