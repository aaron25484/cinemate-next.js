"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMovieContext } from "../contexts/movieContext";
import { getGenres } from "../services/genre.service";
import { uploadRequest } from "../services/upload.service";
import { createMovie } from "../services/movie.service";

interface MovieModalProps {
  isOpen: boolean;
  onClose: () => void;
  closeModal: () => void;
}

interface Genre {
  id: string;
  name: string;
}

interface FormData {
  name: string;
  score: number;
  genre: string;
  poster: FileList;
}

const MovieModal: React.FC<MovieModalProps> = ({ isOpen, onClose }) => {
  const { register, handleSubmit, setValue } = useForm<FormData>();
  const [loading, setLoading] = useState(false);
  const { updateMovies } = useMovieContext();
  const [genres, setGenres] = useState<Genre[]>([]);
  const url = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genresData = await getGenres();
        setGenres(genresData);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };
    fetchGenres();
  }, []);

  const onSubmit = async (data: FormData) => {
    setLoading(true);

    const poster = data.poster[0];

    try {
      const posterUrl = await uploadRequest(poster);

      if (!posterUrl) {
        throw new Error("Image upload failed");
      }

      const movieData = {
        name: data.name,
        score: data.score,
        genre: data.genre,
        poster: posterUrl,
      };

      const response = await createMovie(movieData);

      if (!response) {
        console.error("Failed to submit movie.");
        throw new Error("Failed to submit movie");
      }

      const updatedMovies = await fetch(`${url}movies`).then((res) =>
        res.json()
      );

      updateMovies(updatedMovies);
      setLoading(false);
      onClose();
    } catch (error) {
      console.error("Error submitting movie:", error);
      setLoading(false);
    }
  };

  const handleGenreChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setValue("genre", event.target.value);
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none bg-opacity-80 bg-black">
          <div className="relative w-auto max-w-3xl mx-auto my-6 bg-gray-800 text-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
            <div className="flex items-start justify-between p-5 border-b border-solid rounded-t border-blueGray-600">
              <h3 className="text-2xl  text-center font-semibold text-blue-400">
                Add Movie
              </h3>
              <button
                className="p-1 ml-auto bg-transparent border-0 text-white float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={onClose}
              >
                <span className="text-white h-6 w-6 text-2xl block outline-none focus:outline-none">
                  ×
                </span>
              </button>
            </div>

            <div className="relative p-6 flex-auto">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Name:
                  </label>
                  <input
                    type="text"
                    className="border text-black rounded w-full py-2 px-3"
                    {...register("name")}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Score:
                  </label>
                  <select
                    className="border text-black rounded w-full py-2 px-3"
                    {...register("score")}
                  >
                    {Array.from({ length: 11 }, (_, i) => (
                      <option key={i} value={i}>
                        {i}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Genre:
                  </label>
                  <select
                    className="border text-black rounded w-full py-2 px-3"
                    {...register("genre")}
                    onChange={handleGenreChange}
                  >
                    <option value="" disabled>
                      Select a genre
                    </option>
                    {genres.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Poster:
                  </label>
                  <input
                    type="file"
                    accept=".jpg, .jpeg, .webp"
                    {...register("poster")}
                  />
                </div>
                {loading ? (
                  <p>Loading...</p>
                ) : (
                  <button
                    type="submit"
                    className="bg-blue-500 text-white active:bg-blue-800 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                  >
                    Save
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MovieModal;
