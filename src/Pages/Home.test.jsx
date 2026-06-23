import { render, screen, fireEvent } from '@testing-library/react';
import Home from './Home';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

describe('Home Page', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders the app title and subtitle', () => {
    render(<Home />);
    expect(screen.getByRole('heading', { name: 'MovieFlix' })).toBeInTheDocument();
    expect(screen.getByText('Search and discover your favorite movies')).toBeInTheDocument();
  });

  it('renders the search input with placeholder text', () => {
    render(<Home />);
    expect(screen.getByPlaceholderText('Search for movies...')).toBeInTheDocument();
  });

  it('renders the search button', () => {
    render(<Home />);
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('navigates to results page on form submit with valid input', () => {
    render(<Home />);

    const input = screen.getByPlaceholderText('Search for movies...');
    fireEvent.change(input, { target: { value: 'Avengers' } });
    fireEvent.submit(input.closest('form'));

    expect(mockNavigate).toHaveBeenCalledWith('/results/Avengers');
  });

  it('does not navigate on empty search submission', () => {
    render(<Home />);

    const input = screen.getByPlaceholderText('Search for movies...');
    fireEvent.submit(input.closest('form'));

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('does not navigate when search is only whitespace', () => {
    render(<Home />);

    const input = screen.getByPlaceholderText('Search for movies...');
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.submit(input.closest('form'));

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('trims whitespace from the search term before navigating', () => {
    render(<Home />);

    const input = screen.getByPlaceholderText('Search for movies...');
    fireEvent.change(input, { target: { value: '  Batman  ' } });
    fireEvent.submit(input.closest('form'));

    expect(mockNavigate).toHaveBeenCalledWith('/results/Batman');
  });

  it('encodes special characters in the search term', () => {
    render(<Home />);

    const input = screen.getByPlaceholderText('Search for movies...');
    fireEvent.change(input, { target: { value: 'Harry & Sally' } });
    fireEvent.submit(input.closest('form'));

    expect(mockNavigate).toHaveBeenCalledWith('/results/Harry%20%26%20Sally');
  });

  describe('example search chips', () => {
    it('renders all three example search buttons', () => {
      render(<Home />);
      expect(screen.getByRole('button', { name: 'Avengers' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Harry Potter' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Star Wars' })).toBeInTheDocument();
    });

    it('populates the input when Avengers chip is clicked', () => {
      render(<Home />);
      fireEvent.click(screen.getByRole('button', { name: 'Avengers' }));
      expect(screen.getByPlaceholderText('Search for movies...').value).toBe('Avengers');
    });

    it('populates the input when Harry Potter chip is clicked', () => {
      render(<Home />);
      fireEvent.click(screen.getByRole('button', { name: 'Harry Potter' }));
      expect(screen.getByPlaceholderText('Search for movies...').value).toBe('Harry Potter');
    });

    it('populates the input when Star Wars chip is clicked', () => {
      render(<Home />);
      fireEvent.click(screen.getByRole('button', { name: 'Star Wars' }));
      expect(screen.getByPlaceholderText('Search for movies...').value).toBe('Star Wars');
    });
  });

  describe('navigation links', () => {
    it('renders the Browse nav link', () => {
      render(<Home />);
      expect(screen.getByText('Browse')).toBeInTheDocument();
    });

    it('navigates to /browse when Browse link is clicked', () => {
      render(<Home />);
      fireEvent.click(screen.getByText('Browse'));
      expect(mockNavigate).toHaveBeenCalledWith('/browse');
    });
  });
});
