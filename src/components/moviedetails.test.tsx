// movieDetails.test.tsx
import '@testing-library/jest-dom'

import { render, screen, act } from "@testing-library/react";
import MovieDetails from "./MovieDetails";
import { getMovieById } from "@/services/movie.service";

// Mock useRouter:
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      prefetch: () => null
    };
  }
}));

// Mock fetch:
(global.fetch as jest.Mock) = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      Plot: "This is a test movie synopsis.",
      Director: "Test Director",
      Year: "2022",
      Runtime: "2h 30min",
    })
  }) as Response
);

const mockMovieData = {
  movieId: 1,
  name: "Test Movie",
  genreId: 1,
  poster: "test-poster-url",
  score: 8.5,
};

jest.mock("@/services/movie.service", () => ({
  getMovieById: jest.fn(() => Promise.resolve(mockMovieData)),
}));

describe("MovieDetails Component", () => {
  it("renders movie details correctly", async () => {
    await act(async () => {
      render(<MovieDetails movieId={{ movieId: 1 }} />);
    });

    await screen.findByText("Test Movie");
    await screen.findByText("Director: Test Director");
    await screen.findByText("Year: 2022");
    await screen.findByText("Runtime: 2h 30min");
    await screen.findByText("Rating: 8.5");

    // Add additional assertions based on your component's structure
   
    expect(screen.getByText('Plot: This is a test movie synopsis.')).toBeInTheDocument();
  });
screen.debug()
  // Add more test cases as needed for different scenarios
});
