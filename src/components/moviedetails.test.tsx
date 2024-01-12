import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react';
import MovieDetails from './MovieDetails';
import { useMovieContext } from '../contexts/movieContext';
import { useUser } from '@auth0/nextjs-auth0/client';

jest.mock('../contexts/movieContext', () => ({
  ...jest.requireActual('../contexts/movieContext'),
  useMovieContext: jest.fn(),
}));

jest.mock('@auth0/nextjs-auth0/client');

describe('MovieDetails component test', ()=>{
  it('render all four info fields correctly', async ()=>{

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
screen.debug()

    render(<MovieDetails />)
    await waitFor(() => {
    const rating = screen.getByText('Rating: ')
    expect(rating).toBeInTheDocument()
  })
})

})