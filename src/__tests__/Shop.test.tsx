import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Shop from '@/pages/Shop';
import { BrowserRouter } from 'react-router-dom';

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('Shop page', () => {
  it('renders product groups and a sample product', () => {
    render(<Shop />, { wrapper: Wrapper as any });
    expect(screen.getByText(/Robot Store/i)).toBeDefined();
    // check for a known product name
    expect(screen.getByText(/Guardian Bot X1/i)).toBeDefined();
  });

  it('filters by search query', () => {
    render(<Shop />, { wrapper: Wrapper as any });
    const search = screen.getByPlaceholderText(/Search products.../i) as HTMLInputElement;
    fireEvent.change(search, { target: { value: 'Sentinel' } });
    expect(screen.queryByText(/Guardian Bot X1/i)).toBeNull();
    expect(screen.getByText(/Sentinel Rover P3/i)).toBeDefined();
  });
});
