import { render, screen } from '@testing-library/react';
import App from './App';
import LoginMainPage from './loginPage/LoginMainPage';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

// it('login here', () => {
//   expect();
// })
