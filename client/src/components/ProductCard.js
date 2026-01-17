import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    const success = await addToCart(product._id, 1);
    if (success) {
      toast.success('Added to cart!');
    } else {
      toast.error('Failed to add to cart');
    }
  };

  const finalPrice = product.discountPrice > 0 ? product.discountPrice : product.price;
  const discount = product.discountPrice > 0
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <div className="product-card">
      <Link to={`/products/${product._id}`} className="product-image-link">
        <img
          src={product.images[0]}
          alt={product.name}
          className="product-image"
        />
        {discount > 0 && <span className="discount-badge">{discount}% OFF</span>}
      </Link>

      <div className="product-info">
        <Link to={`/products/${product._id}`} className="product-name">
          {product.name}
        </Link>

        <div className="product-brand">{product.brand}</div>

        <div className="product-rating">
          <FaStar className="star-icon" />
          <span>{product.rating.toFixed(1)}</span>
          <span className="reviews-count">({product.numReviews})</span>
        </div>

        <div className="product-price">
          <span className="current-price">₹{finalPrice.toLocaleString()}</span>
          {discount > 0 && (
            <span className="original-price">₹{product.price.toLocaleString()}</span>
          )}
        </div>

        <button className="btn btn-primary add-to-cart-btn" onClick={handleAddToCart}>
          <FaShoppingCart /> Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
