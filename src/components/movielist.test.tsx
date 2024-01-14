import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import MovieList from './MovieList';
import { useMovieContext } from '../contexts/movieContext';
import { useUser } from '@auth0/nextjs-auth0/client';

// Mock the fetch function
global.fetch = jest.fn();

jest.mock('../contexts/movieContext', () => ({
  ...jest.requireActual('../contexts/movieContext'),
  useMovieContext: jest.fn(),
}));

jest.mock('@auth0/nextjs-auth0/client');

describe('MovieList component', () => {
  it('renders MovieList component correctly', async () => {
    // Mock the fetch response for genres
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([{ id: '1', name: 'Action' }]),
    });

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([{ id: '1', name: 'Movie 1', score: 8, poster: 'poster1.jpg', genreId: '1' }]),
    });

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]), 
    });

    (useUser as jest.Mock).mockReturnValue({
      user: {
        email: 'test@example.com',
        name: 'Test User',
      },
      error: null,
      isLoading: false,
    });

    (useMovieContext as jest.Mock).mockReturnValue({
      movies: [{ id: '1', name: 'Movie 1', score: 8, poster: 'poster1.jpg', genreId: '1' }],
      genres: [],
      watchlist: [],
      addToWatchlist: jest.fn(),
      removeFromWatchlist: jest.fn(),
    });

    render(<MovieList />);

    await waitFor(() => {
      const movieCards = screen.getAllByRole('article');
      expect(movieCards.length).toBeGreaterThanOrEqual(1);
    });
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('movies'));

    // Check if fetch was called with the correct URL for genres
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('genres'));

    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('watchlist'));

  });
});
