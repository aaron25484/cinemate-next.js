'use client';

import { useEffect, useState } from "react";
import { MovieData, getMovieById } from "@/services/movie.service";
import { useRouter } from "next/navigation";

const MovieDetails = ({ movieId }: any) => {
  const [movieDetails, setMovieDetails] = useState<MovieData | null>(null);
  const NEXT_PUBLIC_OMDB_URL = process.env.NEXT_PUBLIC_OMDB_URL
  const [loading, setLoading] = useState<boolean>(true);
  const [plot, setPlot] = useState<string | null>(null);
  const [director, setDirector] = useState<string | null>(null);
  const [year, setYear] = useState<string | null>(null);
  const [runtime, setRuntime] = useState<string | null>(null);
  const router = useRouter();
  
  useEffect(() => {
    const fetchDetails = async () => {
      if (!movieId) {
        return;
      }
      try {
        const details = await getMovieById(movieId.movieId);
        console.log(details)
        setMovieDetails(details);

        const response = await fetch(`${NEXT_PUBLIC_OMDB_URL}&t=${encodeURIComponent(details.name || '')}&plot=full`);
        console.log(response)
        if (response.ok) {
          const data = await response.json();
          setPlot(data.Plot || "Plot not available");
          setDirector(data.Director || "Director not available");
          setYear(data.Year || "Year not available");
          setRuntime(data.Runtime || "Runtime not available");
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
    <div className="flex flex-col items-center sm:flex-row justify-center">
      <div className="w-full sm:w-1/2 pr-4 order-1 sm:order-none">
        <img
          src={movieDetails?.poster}
          alt="movie poster"
          className="w-full h-96 object-contain rounded-md mb-3"
        />
      </div>
      <div className="w-full sm:w-1/2 pl-4 order-2 sm:order-none">
        <h2 className="text-2xl font-semibold mb-2 text-blue-400">{movieDetails?.name || ''}</h2>
        <p className="text-white">{`Genre: ${movieDetails?.genre || ''}`}</p>
        <p className="text-white">{`Director: ${director || ''}`}</p>
        <p className="text-white">{`Year: ${year || ''}`}</p>
        <p className="text-white">{`Runtime: ${runtime || ''}`}</p>
        <p className="text-white">{`Rating: ${movieDetails?.score || ''}`}</p>
        {loading ? (
          <p>Loading plot...</p>
        ) : (
          <div className="mt-4 text-white max-w-screen-md">{`Plot: ${plot}`}</div>
        )}
        <button className="text-white mt-4" onClick={() => router.back()}>Go Back</button>
      </div>
    </div>

  );
};

export default MovieDetails;