import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Cart from './Cart';

const mockStore = configureStore([]);

describe('Cart page', () => {
  it('renders empty cart state', () => {
    const store = mockStore({ cart: { items: [], status: 'succeeded' } });
    render(
      <Provider store={store as any}>
        <Cart />
      </Provider>
    );
    expect(screen.getByText('Your Cart')).toBeInTheDocument();
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
  });
});