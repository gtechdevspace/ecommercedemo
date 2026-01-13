import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Products from './Products';

const mockStore = configureStore([]);

describe('Products page', () => {
  it('renders product items from store', () => {
    const store = mockStore({ products: { items: [{ _id: '1', name: 'Prod 1', description: 'd', price: 9.99 }], status: 'succeeded', total: 1 } });
    render(
      <Provider store={store as any}>
        <Products />
      </Provider>
    );
    expect(screen.getByText('Prod 1')).toBeInTheDocument();
  });
});