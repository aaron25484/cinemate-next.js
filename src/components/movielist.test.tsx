import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react';
import MovieList from './MovieList';
import { useMovieContext } from '../contexts/movieContext';
import { useUser } from '@auth0/nextjs-auth0/client';

jest.mock('../contexts/movieContext', () => ({
  ...jest.requireActual('../contexts/movieContext'),
  useMovieContext: jest.fn(),
}));

jest.mock('@auth0/nextjs-auth0/client');

describe('MovieList component', () => {
  it('renders MovieList component correctly', async () => {
    (useUser as jest.Mock).mockReturnValue({
      user: {
        email: 'test@example.com',
        name: 'Test User',
      },
      error: null,
      isLoading: false,
    });

    // Mock the movies and genres data
    (useMovieContext as jest.Mock).mockReturnValue({
      movies: [{ id: '1', name: 'Movie 1', score: 8, poster: 'poster1.jpg', genreId: '1' }], 
      genres: [{ id: '1', name: 'Action' }],
      watchlist: [],
      addToWatchlist: jest.fn(),
      removeFromWatchlist: jest.fn(),
    });

    render(
   
          <MovieList />
      
    );
// screen.debug()
    // Esperar a que se renderice al menos un MovieCard
    await waitFor(() => {
      const movieCards = screen.getAllByRole('article');
      expect(movieCards.length).toBeGreaterThanOrEqual(1);
    });

    // Puedes realizar más aserciones aquí según tus necesidades
  });
});
