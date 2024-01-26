import '@testing-library/jest-dom'
import { render, screen, act } from "@testing-library/react";
import MovieDetails from "../components/MovieDetails";

type MockedResponse<T> = Promise<{
  ok: boolean;
  json: () => Promise<T>;
}>;

jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      prefetch: () => null
    };
  }
}));

(global.fetch as jest.Mock) = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: jest.fn().mockResolvedValue({
      Plot: "This is a test movie synopsis.",
      Director: "Test Director",
      Year: "2022",
      Runtime: "2h 30min",
    })
  }) as MockedResponse<{ Plot: string; Director: string; Year: string; Runtime: string }>
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
   
    expect(screen.getByText('Plot: This is a test movie synopsis.')).toBeInTheDocument();
  });
});
