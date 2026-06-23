import { render, screen } from '@testing-library/react';
import Home from './Pages/Home';

jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}));

test('renders MovieFlix home page without crashing', () => {
  render(<Home />);
  const titleElement = screen.getByRole('heading', { name: 'MovieFlix' });
  expect(titleElement).toBeInTheDocument();
});
