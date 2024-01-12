"use client";

import { useState, useEffect } from "react";
import { useMovieContext } from "../contexts/movieContext";
import GenreBar, { Genre } from "./Genrebar";
import MovieCard, { Movie } from "./MovieCard";
import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";

const MovieList: React.FC = () => {
  const {
    movies: allMovies,
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
  } = useMovieContext();
  const [filteredMovies, setFilteredMovies] = useState(allMovies);
  const [genres, setGenres] = useState<Genre[]>([]);
  const { user } = useUser();
  const url = process.env.NEXT_PUBLIC_API_URL;
  const notify = (message: string) => toast.error(message);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [moviesResponse, genresResponse, watchlistResponse] = await Promise.all([
          fetch(`${url}movies`),
          fetch(`${url}genres`),
          user && fetch(`${url}users/${user?.email}/watchlist`)
        ]);
  
        if (!moviesResponse.ok) {
          console.error(`Failed to fetch movies: ${moviesResponse.statusText}`);
          return;
        }
  
        const updatedMovies = await moviesResponse.json();
  
        if (user) {
          try {
            if (watchlistResponse && watchlistResponse.ok) {
              const watchlistData = await watchlistResponse.json();
  
              const updatedFilteredMovies = updatedMovies.map((movie: Movie) => ({
                ...movie,
                isInWatchlist: watchlistData.includes(movie.id),
              }));
  
              setFilteredMovies(updatedFilteredMovies);
            } else {
              console.error(
                `Failed to fetch watchlist: ${watchlistResponse?.statusText}`
              );
            }
          } catch (error) {
            console.error("Error fetching watchlist:", error);
          }
        } else {
          setFilteredMovies(updatedMovies);
        }
  
        if (genresResponse.ok) {
          const genresData = await genresResponse.json();
          setGenres(genresData);
        } else {
          console.error(`Failed to fetch genres: ${genresResponse.statusText}`);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, [user, watchlist, allMovies ]);
  

  const handleGenreFilter = (genreId: string | null) => {
    if (genreId) {
      const filteredMovies = allMovies.filter(
        (movie) => movie.genreId === genreId
      );
      setFilteredMovies(filteredMovies);
    } else {
      setFilteredMovies(allMovies);
    }
  };

  const isInWatchlist = (movieId: string) => {
    return watchlist.some((watchlistMovie) => watchlistMovie.id === movieId);
  };

  const handleToggleWatchlist = async (movieId: string) => {
    if (isInWatchlist(movieId)) {
      removeFromWatchlist(movieId);
    } else {
      addToWatchlist(movieId);
    }
  };

  const handleMovieCardClick = (movieId: string) => {
    if (!user) {
      notify("You must log in to see the movie details");
    } 
  };
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
    <div className="container mx-auto mt-4" data-testid="container" >
        <GenreBar genres={genres} onGenreFilter={handleGenreFilter} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
        {filteredMovies.map((movie) => (
            <div key={movie.id} onClick={() => handleMovieCardClick(movie.id)}>
              {user ? (
                <Link href={`movies/${movie.id}`} key={movie.id}>
                  
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      onToggleWatchlist={handleToggleWatchlist}
                      isInWatchlist={!!movie.isInWatchlist}
                    />
                  
                </Link>
              ) : (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onToggleWatchlist={handleToggleWatchlist}
                  isInWatchlist={!!movie.isInWatchlist}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MovieList