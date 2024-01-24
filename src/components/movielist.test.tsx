import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import MovieList from './MovieList';
import { useMovieContext } from '../contexts/movieContext';
import { useUser } from '@auth0/nextjs-auth0/client';

global.fetch = jest.fn();

jest.mock('../contexts/movieContext', () => ({
  ...jest.requireActual('../contexts/movieContext'),
  useMovieContext: jest.fn(),
}));

jest.mock('@auth0/nextjs-auth0/client');

describe('MovieList component', () => {
  it('renders MovieList component correctly', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([{ id: '1', name: 'Action' }]),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([{ id: '1', name: 'Movie 1', score: 8, poster: 'poster1.jpg', genreId: '1' }]),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(['2']),
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
      watchlist: [{ id: '2'}],
      addToWatchlist: jest.fn(),
      removeFromWatchlist: jest.fn(),
    });

    render(<MovieList />);

    await waitFor(() => {
      const movieCards = screen.getAllByRole('article');
      expect(movieCards.length).toBeGreaterThanOrEqual(1);
    });
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('movies'));
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('genres'));
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('users/test@example.com/watchlist'));
  });
});
