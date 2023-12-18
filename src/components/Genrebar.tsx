import React from "react";

export interface Genre {
  id: string;
  name: string;
}
interface GenreBarProps {
  genres: { id: string; name: string }[];
  onGenreFilter: (genreId: string | null) => void;
}

const GenreBar: React.FC<GenreBarProps> = ({ genres, onGenreFilter }) => {
  return (
    <div className="glass-genre-bar flex justify-center space-x-4">
      <button
        className="glass-genre-button text-white text-lg"
        onClick={() => onGenreFilter(null)}
      >
        All
      </button>
      {genres.map((genre) => (
        <button
          key={genre.id}
          className="glass-genre-button text-white text-lg "
          onClick={() => {
            onGenreFilter(String(genre.id));
          }}
        >
          {genre.name}
        </button>
      ))}
    </div>
  );
};

export default GenreBar;
