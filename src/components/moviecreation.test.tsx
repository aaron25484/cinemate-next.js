import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useMovieContext } from '../contexts/movieContext';
import { useUser } from '@auth0/nextjs-auth0/client';
import MovieModal from './AddMovieModal';

global.fetch = jest.fn();

jest.mock('../contexts/movieContext', () => ({
  ...jest.requireActual('../contexts/movieContext'),
  useMovieContext: jest.fn(),
}));

jest.mock('@auth0/nextjs-auth0/client');

describe('Movie creation and displaying', ()=>{
  it('should create a movie and display it', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([{ id: '1', name: 'Action' }]),
    });
    useMovieContext.mockImplementation(() => ({
      movies: [],
      watchlist: [],
      addToWatchlist: jest.fn(),
      removeFromWatchlist: jest.fn(),
    }));
    useUser.mockImplementation(() => ({
      user: {
        email: 'test@example.com',
      },
    }));

    render(<MovieModal isOpen={true} onClose={() => {}}/>);

    await waitFor(() => {
      expect(screen.getByText('Add Movie')).toBeInTheDocument();
    });

    const movieTitleInput = screen.getByRole('textbox');
    const movieScoreInput = screen.getAllByRole('combobox');
    const movieGenreInput = screen.getAllByRole('combobox');
    const moviePosterInput = screen.getByRole('deletion');

    expect(movieTitleInput).toBeInTheDocument();
    expect(movieScoreInput).toBeInTheDocument();
    expect(movieGenreInput).toBeInTheDocument();
    expect(moviePosterInput).toBeInTheDocument();

    fireEvent.change(movieTitleInput, { target: { value: 'Test Movie' } });
    fireEvent.change(movieScoreInput, { target: { value: '5' } });
    fireEvent.change(movieGenreInput, { target: { value: '1' } });

    const file = new File(['(mock data)'], 'movie_poster.jpg', { type: 'image/jpg' });
    const fileList = {
      0: file,
      length: 1,
      item: jest.fn((index) => file),
    };
    
    Object.defineProperty(moviePosterInput, 'files', {
      value: fileList,
    });

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton)
  })
})