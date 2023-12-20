'use client';

import { useEffect, useState } from "react";
import { Movie } from "../components/MovieCard"
import { MovieData, getMovieById } from "@/services/movie.service";
import { useRouter } from "next/navigation";

const MovieDetails = ({ movieId }: any) => {
  const [movieDetails, setMovieDetails] = useState<MovieData | null>(null);
  const NEXT_PUBLIC_OMDB_URL = process.env.NEXT_PUBLIC_OMDB_URL
  const [loading, setLoading] = useState<boolean>(true);
  const [plot, setPlot] = useState<string | null>(null);
  const router = useRouter();
  
  useEffect(() => {
    const fetchDetails = async () => {
      if (!movieId) {
        return;
      }

      try {
        const details = await getMovieById(movieId.movieId);
        setMovieDetails(details);

        const response = await fetch(`${NEXT_PUBLIC_OMDB_URL}&t=${encodeURIComponent(details.name || '')}`);
        console.log(response)
        if (response.ok) {
          const data = await response.json();
          setPlot(data.Plot || "Plot not available");
        } else {
          console.error(`Failed to fetch movie details from OMDB: ${response.statusText}`);
        }
      } catch (error) {
        console.error("Error fetching movie details from OMDB:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchDetails();
  }, [NEXT_PUBLIC_OMDB_URL,movieId]);

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-md">
        <div className="flex">
          <div className="w-1/2 pr-4">
            <img
              src={movieDetails?.poster}
              alt="movie poster"
              className="w-full h-64 object-contain rounded-md mb-3"
            />
          </div>
          <div className="w-1/2">
          <h2 className="text-2xl font-semibold mb-2 text-blue-400">{movieDetails?.name || ''}</h2>


          <p>{`Genre: ${movieDetails?.genre || ''}`}</p>
            <p>{`Rating: ${movieDetails?.score || ''}`}</p>
            {loading ? (
              <p>Loading plot...</p>
            ) : (
              <p className="mt-4">{`Plot: ${plot}`}</p>
            )}
                  <button onClick={() => router.back()}>Go Back</button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;