const url = process.env.NEXT_PUBLIC_API_URL;

export interface MovieData {
  name: string;
  score: number;
  genre: string;
  poster: string;
}

export const createMovie = async (
  movieData: MovieData,
): Promise<{ message?: string; error?: string }> => {
  try {
    const response = await fetch(`${url}movies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(movieData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create movie');
    }

    const responseData = await response.json();
    return { message: responseData.message };
  } catch (error) {
    console.error('Error creating movie:', error);
    return { error: 'Failed to create movie' };
  }
};

export const getMovies = async (movieId: string) => {
  try {
    const response = await fetch(`${url}movies/${movieId}`,
    {method: "GET"});

    if (response.ok) {
      const movies = await response.json();
      return movies;
    } else {
      const errorData = await response.json();
      console.error(`Failed to fetch movie details for ID ${movieId}:`, errorData);
      throw new Error(`Failed to fetch movie details for ID ${movieId}`);
    }
  } catch (error) {
    console.error('Error fetching movies:', error);
    return null;
  }
};

export const getMovieById = async (movieId: string) => {
  try {
    const apiUrl = `${url}movies/${encodeURIComponent(movieId)}`;
    const response = await fetch(apiUrl, { method: 'GET' });

    if (response.ok) {
      const movies = await response.json();
      return movies;
    } else {
      const errorData = await response.json();
      console.error(`Failed to fetch movie details for ID ${movieId}:`, errorData);
      throw new Error(`Failed to fetch movie details for ID ${movieId}`);
    }
  } catch (error) {
    console.error('Error fetching movies:', error);
    return null;
  }
}

export const deleteMovie = async (movieId: string) => {
  try {
    if (!movieId) {
      throw new Error("Movie ID is required");
    }
    
    const response = await fetch(`${url}movies/${movieId}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`Failed to delete movie: ${JSON.stringify(errorData)}`);
      throw new Error(`Failed to delete movie: ${JSON.stringify(errorData)}`);
    }

    const deletedMovie = await response.json();
    return deletedMovie;
  } catch (error) {
    console.error("Error deleting movie:", error);
    return null;
  }
};

export const updateMovie = async (movieId: string, data: any) => {
  try {

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}movies/${movieId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.error(`Failed to update movie: ${response.statusText}`);
      return null;
    }

    const updatedMovie = await response.json();
    return updatedMovie;
  } catch (error) {
    console.error("Error updating movie:", error);
    return null;
  }
};