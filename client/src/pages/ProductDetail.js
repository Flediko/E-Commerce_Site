import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaStar, FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data } = await axios.get(`/api/products/${id}`);
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Product not found');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    const success = await addToCart(product._id, quantity);
    if (success) {
      toast.success(`Added ${quantity} item(s) to cart!`);
    } else {
      toast.error('Failed to add to cart');
    }
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  if (!product) {
    return <div className="container">Product not found</div>;
  }

  const finalPrice = product.discountPrice > 0 ? product.discountPrice : product.price;
  const discount = product.discountPrice > 0
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <div className="product-detail-page container">
      <div className="product-detail-layout">
        {/* Images */}
        <div className="product-images">
          <div className="main-image">
            <img src={product.images[selectedImage]} alt={product.name} />
            {discount > 0 && <span className="discount-badge">{discount}% OFF</span>}
          </div>
          <div className="image-thumbnails">
            {product.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`${product.name} ${index + 1}`}
                className={selectedImage === index ? 'active' : ''}
                onClick={() => setSelectedImage(index)}
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="product-details">
          <h1 className="product-title">{product.name}</h1>
          <div className="product-brand">Brand: {product.brand}</div>

          <div className="product-rating-section">
            <div className="rating">
              <FaStar className="star-icon" />
              <span className="rating-value">{product.rating.toFixed(1)}</span>
            </div>
            <span className="reviews-count">({product.numReviews} reviews)</span>
          </div>

          <div className="product-price-section">
            <div className="current-price">₹{finalPrice.toLocaleString()}</div>
            {discount > 0 && (
              <>
                <div className="original-price">₹{product.price.toLocaleString()}</div>
                <div className="savings">You save ₹{(product.price - finalPrice).toLocaleString()}</div>
              </>
            )}
          </div>

          <div className="stock-status">
            {product.stock > 0 ? (
              <span className="in-stock">In Stock ({product.stock} available)</span>
            ) : (
              <span className="out-of-stock">Out of Stock</span>
            )}
          </div>

          <div className="product-actions">
            <div className="quantity-selector">
              <label>Quantity:</label>
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                max={product.stock}
              />
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                disabled={quantity >= product.stock}
              >
                +
              </button>
            </div>

            <button
              className="btn btn-primary add-to-cart-btn"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <FaShoppingCart /> Add to Cart
            </button>
          </div>

          <div className="product-description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="product-specs">
              <h3>Specifications</h3>
              <table>
                <tbody>
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <tr key={key}>
                      <td className="spec-key">{key}</td>
                      <td className="spec-value">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      {product.reviews && product.reviews.length > 0 && (
        <div className="reviews-section">
          <h2>Customer Reviews</h2>
          <div className="reviews-list">
            {product.reviews.map((review, index) => (
              <div key={index} className="review-card">
                <div className="review-header">
                  <strong>{review.name}</strong>
                  <div className="review-rating">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={i < review.rating ? 'star-filled' : 'star-empty'}
                      />
                    ))}
                  </div>
                </div>
                <p>{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
