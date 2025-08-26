"use client"

import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Offcanvas, Modal, Button, Form, Badge, Alert } from 'react-bootstrap';
import {
  Moped,
  ShoppingCart,
  Add,
  Remove,
  Star,
  AccessTime,
  LocationOn,
  Store,
  CheckCircle,
  QrCode,
  ArrowRightAlt
} from '@mui/icons-material';

// --- Data (No Changes) ---
const menuCategories = [
  { name: 'Shawarma', icon: '🌯' },
  { name: 'Burgers', icon: '🍔' },
  { name: 'Pizza', icon: '🍕' },
  { name: 'Drinks', icon: '🥤' },
];

const menuItems = {
  'Shawarma': [
    { id: 1, name: 'Chicken Shawarma', description: 'Tender chicken with garlic sauce', price: 8.50, rating: 4.8, image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&h=300&fit=crop' },
    { id: 2, name: 'Beef Shawarma', description: 'Marinated beef with tahini', price: 9.50, rating: 4.9, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop' },
  ],
  'Burgers': [
    { id: 4, name: 'Turkish Burger', description: 'Special sauce and fresh vegetables', price: 7.50, rating: 4.6, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop' },
  ],
  'Pizza': [
    { id: 6, name: 'Margherita', description: 'Classic tomato and mozzarella', price: 12.00, rating: 4.4, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop' },
  ],
  'Drinks': [
    { id: 8, name: 'Turkish Tea', description: 'Traditional black tea', price: 2.50, rating: 4.7, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop' },
  ],
};

const branches = [
  { id: 1, name: 'Central Market', address: 'Russian Market, Phnom Penh' },
  { id: 2, name: 'Riverside', address: 'Sisowath Quay, Phnom Penh' },
  { id: 3, name: 'BKK1', address: 'Street 51, BKK1, Phnom Penh' },
];


const RestaurantOrderApp = () => {
  // --- State Management (No Changes) ---
  const [activeCategory, setActiveCategory] = useState(menuCategories[0].name);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [orderModal, setOrderModal] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', address: '' });
  const [notification, setNotification] = useState({ show: false, message: '', variant: 'success' });
  const [orderStep, setOrderStep] = useState(1);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [qrUploaded, setQrUploaded] = useState(false);

  // --- Core Functions (No Changes) ---
  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId) => {
    const existingItem = cart.find(cartItem => cartItem.id === itemId);
    if (existingItem && existingItem.quantity > 1) {
      setCart(cart.map(cartItem =>
        cartItem.id === itemId ? { ...cartItem, quantity: cartItem.quantity - 1 } : cartItem
      ));
    } else {
      setCart(cart.filter(cartItem => cartItem.id !== itemId));
    }
  };

  const getTotalPrice = () => cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  const getTotalItems = () => cart.reduce((total, item) => total + item.quantity, 0);
  const getQuantityInCart = (itemId) => cart.find(cartItem => cartItem.id === itemId)?.quantity || 0;

  const handlePlaceOrder = () => {
    const orderSummary = {
      customer: customerInfo, items: cart, total: getTotalPrice(), branch: selectedBranch, paymentMethod,
      timestamp: new Date().toISOString()
    };
    console.log('Order placed:', orderSummary);
    showNotification('Order placed successfully!', 'success');
    setCart([]);
    setOrderModal(false);
    resetOrderProcess();
  };

  const handleNextStep = () => {
    if (orderStep === 1) {
      if (customerInfo.name && customerInfo.phone) setOrderStep(2);
      else showNotification('Please fill in your name and phone number', 'danger');
    } else if (orderStep === 2) {
      if (selectedBranch) {
        if (paymentMethod === 'COD') handlePlaceOrder();
        else setOrderStep(3);
      } else {
        showNotification('Please select a branch', 'danger');
      }
    } else if (orderStep === 3) {
      if (qrUploaded) handlePlaceOrder();
      else showNotification('Please upload the payment screenshot', 'danger');
    }
  };

  const resetOrderProcess = () => {
    setOrderStep(1);
    setCustomerInfo({ name: '', phone: '', address: '' });
    setSelectedBranch(null);
    setPaymentMethod('COD');
    setQrUploaded(false);
  };

  const handleFileUpload = () => {
    setQrUploaded(true);
    showNotification('Payment screenshot "uploaded" successfully!', 'info');
  };

  const showNotification = (message, variant) => {
    setNotification({ show: true, message, variant });
    setTimeout(() => {
      setNotification({ show: false, message: '', variant: 'success' });
    }, 3000);
  };

  return (
    <>
      <style>{`
        body { background-color: #f8f9fa; }
        .btn-brand { background-color: #FF6347; border-color: #FF6347; color: white; }
        .btn-brand:hover { background-color: #E5533D; border-color: #E5533D; color: white; }
        .text-brand { color: #FF6347 !important; }
        .navbar-brand-custom { background-color: #FF6347; }
        .nav-tabs .nav-link { color: #6c757d; }
        .nav-tabs .nav-link.active { color: #FF6347; border-color: #dee2e6 #dee2e6 #FF6347; }
        .card-menu-item { transition: all 0.2s ease-in-out; }
        .card-menu-item:hover { transform: translateY(-5px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .quantity-btn { width: 30px; height: 30px; line-height: 1; border-radius: 50%; padding: 0; }
        .branch-card { cursor: pointer; border: 2px solid transparent; }
        .branch-card.selected { border-color: #FF6347; background-color: #fff5f2; }
        .view-cart-bar {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 1020;
            transition: transform 0.3s ease-in-out;
            transform: translateY(100%);
        }
        .view-cart-bar.show { transform: translateY(0); }
      `}</style>

      {/* Header */}
      <nav className="navbar navbar-light bg-white sticky-top shadow-sm">
        <div className="container">
          <a className="navbar-brand d-flex align-items-center" href="#">
            <span className="navbar-brand-custom p-2 rounded-circle me-2 d-flex align-items-center justify-content-center">
              <Moped style={{ color: 'white' }} />
            </span>
            <span className="fw-bold">Turkish Shawarma</span>
          </a>
          <button className="btn btn-light position-relative" onClick={() => setCartOpen(true)}>
            <ShoppingCart className="text-muted" />
            {getTotalItems() > 0 &&
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {getTotalItems()}
              </span>
            }
          </button>
        </div>
      </nav>

      <div className="container my-4" style={{ paddingBottom: '100px' }}>
        {/* Restaurant Info */}
        <div className="card mb-4 border-0">
          <div className="card-body">
            <h1 className="card-title h3">Turkish Shawarma & Fast Food in Phnom Penh 🇰🇭</h1>
            <div className="d-flex flex-wrap gap-3 text-muted small">
              <span className="d-flex align-items-center"><Star className="text-warning me-1" fontSize="small" /> <b>4.9</b> (500+ ratings)</span>
              <span className="d-flex align-items-center"><AccessTime className="me-1" fontSize="small" /> 20-30 min</span>
              <span className="d-flex align-items-center"><LocationOn className="me-1" fontSize="small" /> Free delivery</span>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <ul className="nav nav-tabs nav-fill mb-4 border-0">
          {menuCategories.map((category) => (
            <li className="nav-item" key={category.name}>
              <button
                className={`nav-link w-100 ${activeCategory === category.name ? 'active' : ''}`}
                onClick={() => setActiveCategory(category.name)}
              >
                <span className="me-2 fs-5">{category.icon}</span> {category.name}
              </button>
            </li>
          ))}
        </ul>

        {/* Menu Items */}
        <div className="row g-3">
          {menuItems[activeCategory]?.map((item) => (
            <div className="col-12 col-md-6 col-lg-4" key={item.id}>
              <div className="card h-100 border-0 card-menu-item">
                <img src={item.image} className="card-img-top" alt={item.name} height="200" style={{ objectFit: 'cover' }} />
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between">
                    <h5 className="card-title mb-1">{item.name}</h5>
                    <Badge bg="warning" text="dark" pill className="d-flex align-items-center">⭐ {item.rating}</Badge>
                  </div>
                  <p className="card-text text-muted small flex-grow-1">{item.description}</p>
                  <div className="mt-auto d-flex justify-content-between align-items-center">
                    <p className="h4 text-brand fw-bold mb-0">${item.price.toFixed(2)}</p>
                    {getQuantityInCart(item.id) > 0 ? (
                      <div className="d-flex align-items-center gap-2">
                        <Button variant="outline-danger" className="quantity-btn" onClick={() => removeFromCart(item.id)}><Remove fontSize="small" /></Button>
                        <span className="fw-bold fs-5">{getQuantityInCart(item.id)}</span>
                        <Button variant="danger" className="quantity-btn" onClick={() => addToCart(item)}><Add fontSize="small" /></Button>
                      </div>
                    ) : (
                      <Button variant="outline-dark" onClick={() => addToCart(item)}><Add className="me-1" /> Add</Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* View Cart Bar */}
      <div className={`view-cart-bar p-3 bg-white shadow-lg ${cart.length > 0 ? 'show' : ''}`}>
        <div className="container">
          <div className="d-grid">
            <Button variant="brand" size="lg" className="d-flex justify-content-between align-items-center" onClick={() => setCartOpen(true)}>
              <span>{getTotalItems()} item{getTotalItems() > 1 && 's'} | ${getTotalPrice()}</span>
              <span>View Cart <ArrowRightAlt /></span>
            </Button>
          </div>
        </div>
      </div>

      {/* Cart Offcanvas */}
      <Offcanvas show={cartOpen} onHide={() => setCartOpen(false)} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Your Order</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="d-flex flex-column">
          {cart.length === 0 ? (
            <div className="text-center m-auto">
              <p className="fs-1">🛒</p>
              <h5>Your cart is empty</h5>
              <p className="text-muted">Add items from the menu to start an order.</p>
            </div>
          ) : (
            <>
              <ul className="list-group list-group-flush mb-3 flex-grow-1">
                {cart.map(item => (
                  <li className="list-group-item d-flex justify-content-between align-items-center px-0" key={item.id}>
                    <div>
                      <div className="fw-bold">{item.name}</div>
                      <small className="text-brand fw-bold">${item.price.toFixed(2)}</small>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <Button variant="outline-danger" className="quantity-btn" onClick={() => removeFromCart(item.id)}><Remove fontSize="small" /></Button>
                      <span className="fw-bold fs-5">{item.quantity}</span>
                      <Button variant="danger" className="quantity-btn" onClick={() => addToCart(item)}><Add fontSize="small" /></Button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-auto d-grid gap-2">
                <Button variant="brand" size="lg" onClick={() => { setCartOpen(false); setOrderModal(true); }}>
                  Go to Checkout - ${getTotalPrice()}
                </Button>
              </div>
            </>
          )}
        </Offcanvas.Body>
      </Offcanvas>

      {/* Order Modal */}
      <Modal show={orderModal} onHide={() => { setOrderModal(false); resetOrderProcess(); }} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {orderStep === 1 && 'Confirm Delivery Details'}
            {orderStep === 2 && 'Checkout'}
            {orderStep === 3 && 'Complete Payment'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {orderStep === 1 && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Your Name</Form.Label>
                <Form.Control type="text" placeholder="Enter your name" value={customerInfo.name} onChange={e => setCustomerInfo({ ...customerInfo, name: e.target.value })} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control type="tel" placeholder="Enter phone number" value={customerInfo.phone} onChange={e => setCustomerInfo({ ...customerInfo, phone: e.target.value })} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Delivery Address</Form.Label>
                <Form.Control as="textarea" rows={2} placeholder="e.g. #123, Street 456, Sangkat Boeung Keng Kang I" value={customerInfo.address} onChange={e => setCustomerInfo({ ...customerInfo, address: e.target.value })} required />
              </Form.Group>
            </Form>
          )}
          {orderStep === 2 && (
            <>
              <h6>Select Pickup Branch:</h6>
              <div className="vstack gap-2 mb-4">
                {branches.map(branch => (
                  <div key={branch.id} className={`p-3 rounded border branch-card ${selectedBranch?.id === branch.id ? 'selected' : ''}`} onClick={() => setSelectedBranch(branch)}>
                    <div className="d-flex align-items-center">
                      <Store className="me-3 text-brand" />
                      <div>
                        <div className="fw-bold">{branch.name}</div>
                        <small className="text-muted">{branch.address}</small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <hr />
              <h6>Payment Method:</h6>
              <Form.Check type="radio" id="cod" label="Cash on Delivery" value="COD" checked={paymentMethod === 'COD'} onChange={e => setPaymentMethod(e.target.value)} />
              <Form.Check type="radio" id="qr" label="Pay via ABA QR" value="QR" checked={paymentMethod === 'QR'} onChange={e => setPaymentMethod(e.target.value)} />
            </>
          )}
          {orderStep === 3 && (
            <div className="text-center">
              <h6>Scan to pay with ABA Mobile:</h6>
              <img src="https://placehold.co/200x200/FFFFFF/000000?text=ABA+QR" alt="QR Code" className="img-fluid my-3 rounded" />
              <p className="text-muted">After paying, upload a screenshot of the receipt.</p>
              <Button variant="brand" onClick={handleFileUpload} disabled={qrUploaded}>
                {qrUploaded ? <><CheckCircle className="me-2" /> Uploaded</> : <><QrCode className="me-2" /> Upload Screenshot</>}
              </Button>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="d-grid">
          <Button variant="brand" size="lg" onClick={handleNextStep}>
            {(orderStep === 2 && paymentMethod === 'COD') || orderStep === 3 ? `Place Order - $${getTotalPrice()}` : 'Continue'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Notification Toast */}
      {notification.show && (
        <Alert variant={notification.variant} className="position-fixed top-0 start-50 translate-middle-x m-3 shadow-lg" style={{ zIndex: 1100 }}>
          {notification.message}
        </Alert>
      )}
    </>
  );
};

export default RestaurantOrderApp;