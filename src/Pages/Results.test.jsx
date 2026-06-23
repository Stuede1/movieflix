import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import axios from 'axios';
import Results from './Results';

jest.mock('axios');

const mockNavigate = jest.fn();
let mockSearchTerm = 'Avengers';

jest.mock('react-router-dom', () => ({
  useParams: () => ({ searchTerm: mockSearchTerm }),
  useNavigate: () => mockNavigate,
}));

const mockSearchResponse = {
  data: {
    Response: 'True',
    Search: [
      { imdbID: 'tt0848228', Title: 'The Avengers', Year: '2012' },
      { imdbID: 'tt4154756', Title: 'Avengers: Infinity War', Year: '2018' },
    ],
  },
};

const mockMovieDetail = (id, title, year) => ({
  data: {
    imdbID: id,
    Title: title,
    Year: year,
    Genre: 'Action',
    Poster: 'https://example.com/poster.jpg',
    Response: 'True',
  },
});

describe('Results Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSearchTerm = 'Avengers';
  });

  it('shows loading spinner while fetching', () => {
    axios.get.mockReturnValue(new Promise(() => {})); // never resolves
    render(<Results />);

    expect(screen.getByText('Searching movies...')).toBeInTheDocument();
  });

  it('renders movie cards when API returns results', async () => {
    axios.get
      .mockResolvedValueOnce(mockSearchResponse)
      .mockResolvedValueOnce(mockMovieDetail('tt0848228', 'The Avengers', '2012'))
      .mockResolvedValueOnce(mockMovieDetail('tt4154756', 'Avengers: Infinity War', '2018'));

    render(<Results />);

    await waitFor(() => {
      expect(screen.getByText('The Avengers')).toBeInTheDocument();
      expect(screen.getByText('Avengers: Infinity War')).toBeInTheDocument();
    });
  });

  it('displays the search term in the heading', async () => {
    axios.get
      .mockResolvedValueOnce(mockSearchResponse)
      .mockResolvedValueOnce(mockMovieDetail('tt0848228', 'The Avengers', '2012'))
      .mockResolvedValueOnce(mockMovieDetail('tt4154756', 'Avengers: Infinity War', '2018'));

    render(<Results />);

    await waitFor(() => {
      expect(screen.getByText("Search results for 'Avengers'")).toBeInTheDocument();
    });
  });

  it('shows error message when API returns an error', async () => {
    mockSearchTerm = 'xyznonexistent';
    axios.get.mockResolvedValueOnce({
      data: { Response: 'False', Error: 'Movie not found!' },
    });

    render(<Results />);

    await waitFor(() => {
      expect(screen.getByText('Movie not found!')).toBeInTheDocument();
    });
  });

  it('shows error message when network request fails', async () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    axios.get.mockRejectedValueOnce(new Error('Network Error'));

    render(<Results />);

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch movies')).toBeInTheDocument();
    });
    spy.mockRestore();
  });

  it('navigates home when Back to Home button is clicked', async () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    axios.get.mockRejectedValueOnce(new Error('fail'));

    render(<Results />);

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch movies')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('← Back to Home'));
    expect(mockNavigate).toHaveBeenCalledWith('/');
    spy.mockRestore();
  });

  it('navigates to checkout when Buy Now is clicked', async () => {
    axios.get
      .mockResolvedValueOnce(mockSearchResponse)
      .mockResolvedValueOnce(mockMovieDetail('tt0848228', 'The Avengers', '2012'))
      .mockResolvedValueOnce(mockMovieDetail('tt4154756', 'Avengers: Infinity War', '2018'));

    render(<Results />);

    await waitFor(() => {
      expect(screen.getByText('The Avengers')).toBeInTheDocument();
    });

    const buyButtons = screen.getAllByText('Buy Now');
    fireEvent.click(buyButtons[0]);
    expect(mockNavigate).toHaveBeenCalledWith('/checkout/tt0848228');
  });

  it('sorts the grid when sort option changes', async () => {
    axios.get
      .mockResolvedValueOnce(mockSearchResponse)
      .mockResolvedValueOnce(mockMovieDetail('tt0848228', 'The Avengers', '2012'))
      .mockResolvedValueOnce(mockMovieDetail('tt4154756', 'Avengers: Infinity War', '2018'));

    render(<Results />);

    await waitFor(() => {
      expect(screen.getByText('The Avengers')).toBeInTheDocument();
    });

    const sortSelect = screen.getByLabelText('Sort by:');
    fireEvent.change(sortSelect, { target: { value: 'newest-to-oldest' } });

    const titles = screen.getAllByRole('heading', { level: 3 });
    expect(titles[0]).toHaveTextContent('Avengers: Infinity War');
    expect(titles[1]).toHaveTextContent('The Avengers');
  });

  it('filters results when year dropdown changes', async () => {
    axios.get
      .mockResolvedValueOnce(mockSearchResponse)
      .mockResolvedValueOnce(mockMovieDetail('tt0848228', 'The Avengers', '2012'))
      .mockResolvedValueOnce(mockMovieDetail('tt4154756', 'Avengers: Infinity War', '2018'));

    render(<Results />);

    await waitFor(() => {
      expect(screen.getByText('The Avengers')).toBeInTheDocument();
    });

    const yearSelect = screen.getByLabelText('Year:');
    fireEvent.change(yearSelect, { target: { value: '2018' } });

    expect(screen.queryByText('The Avengers')).not.toBeInTheDocument();
    expect(screen.getByText('Avengers: Infinity War')).toBeInTheDocument();
  });
});
