import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], totalPrice: 0 });
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      // Load from localStorage for guest users
      const localCart = localStorage.getItem('guestCart');
      if (localCart) {
        setCart(JSON.parse(localCart));
      }
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      const { data } = await axios.get('/api/cart');
      setCart(data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    setLoading(true);
    try {
      if (isAuthenticated) {
        const { data } = await axios.post('/api/cart', { productId, quantity });
        setCart(data);
      } else {
        // Guest cart logic
        const response = await axios.get(`/api/products/${productId}`);
        const product = response.data;
        
        const existingItemIndex = cart.items.findIndex(
          item => item.product._id === productId
        );

        let newCart;
        if (existingItemIndex > -1) {
          newCart = { ...cart };
          newCart.items[existingItemIndex].quantity += quantity;
        } else {
          newCart = {
            items: [
              ...cart.items,
              {
                _id: Date.now().toString(),
                product,
                quantity,
                price: product.discountPrice > 0 ? product.discountPrice : product.price
              }
            ]
          };
        }

        newCart.totalPrice = newCart.items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );

        setCart(newCart);
        localStorage.setItem('guestCart', JSON.stringify(newCart));
      }
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    setLoading(true);
    try {
      if (isAuthenticated) {
        const { data } = await axios.put(`/api/cart/${itemId}`, { quantity });
        setCart(data);
      } else {
        const newCart = { ...cart };
        const itemIndex = newCart.items.findIndex(item => item._id === itemId);
        if (itemIndex > -1) {
          newCart.items[itemIndex].quantity = quantity;
          newCart.totalPrice = newCart.items.reduce(
            (total, item) => total + item.price * item.quantity,
            0
          );
          setCart(newCart);
          localStorage.setItem('guestCart', JSON.stringify(newCart));
        }
      }
    } catch (error) {
      console.error('Error updating cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    setLoading(true);
    try {
      if (isAuthenticated) {
        const { data } = await axios.delete(`/api/cart/${itemId}`);
        setCart(data);
      } else {
        const newCart = {
          ...cart,
          items: cart.items.filter(item => item._id !== itemId)
        };
        newCart.totalPrice = newCart.items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
        setCart(newCart);
        localStorage.setItem('guestCart', JSON.stringify(newCart));
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      if (isAuthenticated) {
        await axios.delete('/api/cart');
      }
      setCart({ items: [], totalPrice: 0 });
      localStorage.removeItem('guestCart');
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const value = {
    cart,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    itemCount: cart.items.reduce((total, item) => total + item.quantity, 0)
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
