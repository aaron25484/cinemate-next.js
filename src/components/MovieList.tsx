"use client";

import { useState, useEffect } from "react";
import { useMovieContext } from "../contexts/movieContext";
import GenreBar, { Genre } from "./Genrebar";
import MovieCard, { Movie } from "./MovieCard";
import { useUser } from "@auth0/nextjs-auth0/client";
import { ToastContainer, toast } from "react-toastify";
import { deleteMovie } from "@/services/movie.service";
import EditMovieModal from "./EditMovieModal";

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
  const { updateMovies } = useMovieContext();
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);

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

  const handleMovieCardClick = (movieId: string, event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const isButton = (event.target as HTMLElement).closest('button');

    if (!user && !isButton) {
      notify("You must log in to see the movie details");
    } else if (!isButton) {
      window.location.href = `/movies/${movieId}`;
    } else {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  const handleDeleteMovie = async (movieId: string) => {

    try {
      const deletedMovie = await deleteMovie(movieId);

      if (deletedMovie) {
        const updatedMovies = await fetch(`${url}movies`).then((res) =>
        res.json()
      );

      updateMovies(updatedMovies);
      } else {
        console.error("Failed to delete movie");
      }
    } catch (error) {
      console.error("Error deleting movie:", error);
    }
  };

  const handleEditMovie = async (movieId: string) => {
    try {
      setSelectedMovieId(movieId);
      setEditModalOpen(true);
  
      const updatedMovies = await fetch(`${url}movies`).then((res) => res.json());

      updateMovies(updatedMovies);
      
    } catch (error) {
      console.error("Error editing movie:", error);
    }
  };

  const closeModal = () => {
    setEditModalOpen(false);
    setSelectedMovieId(null);
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
            <div key={movie.id} onClick={(e) => handleMovieCardClick(movie.id, e)}>
            {user ? (
              <div>
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onToggleWatchlist={handleToggleWatchlist}
                  isInWatchlist={!!movie.isInWatchlist}
                  onDelete={handleDeleteMovie}
                  onEdit={() => handleEditMovie(movie.id)}                />
              </div>
              ) : (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onToggleWatchlist={handleToggleWatchlist}
                  isInWatchlist={!!movie.isInWatchlist}
                  onDelete={handleDeleteMovie}
                  onEdit={() => handleEditMovie(movie.id)}
                />
              )}
            </div>
          ))}
        </div>
      </div>
      {selectedMovieId && (
        <EditMovieModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setSelectedMovieId(null);
            closeModal()
          }}
          movieId={selectedMovieId}
          closeModal={closeModal}
        />
      )}
    </>
  );
};

export default MovieList