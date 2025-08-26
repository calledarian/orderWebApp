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
  Send,
  Store,
  CheckCircle,
  QrCode,
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
    showNotification(`${item.name} added to cart!`, 'success');
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
      customer: customerInfo,
      items: cart,
      total: getTotalPrice(),
      branch: selectedBranch,
      paymentMethod,
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
  };

  // --- Render (Refactored with Bootstrap) ---
  return (
    <>
      {/* Header */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary sticky-top shadow-sm">
        <div className="container-fluid">
          <a className="navbar-brand d-flex align-items-center" href="#">
            <Moped className="me-2" />
            Turkish Shawarma & Fast Food
          </a>
          <button className="btn btn-primary position-relative" onClick={() => setCartOpen(true)}>
            <ShoppingCart />
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {getTotalItems()}
              <span className="visually-hidden">items in cart</span>
            </span>
          </button>
        </div>
      </nav>

      <div className="container my-4">
        {/* Restaurant Info */}
        <div className="card mb-4">
          <div className="card-body">
            <h1 className="card-title h3">Turkish Shawarma & Fast Food in Phnom Penh 🇰🇭</h1>
            <div className="d-flex flex-wrap gap-3 text-muted">
              <span className="d-flex align-items-center"><Star className="text-warning me-1" /> 4.9 ★ (500+)</span>
              <span className="d-flex align-items-center"><AccessTime className="me-1" /> Delivery: 20-30 min</span>
              <span className="d-flex align-items-center"><LocationOn className="me-1" /> Free delivery</span>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <ul className="nav nav-tabs nav-fill mb-4">
          {menuCategories.map((category) => (
            <li className="nav-item" key={category.name}>
              <button
                className={`nav-link w-100 ${activeCategory === category.name ? 'active' : ''}`}
                onClick={() => setActiveCategory(category.name)}
              >
                <span className="me-2">{category.icon}</span> {category.name}
              </button>
            </li>
          ))}
        </ul>

        {/* Menu Items */}
        <div className="row g-3">
          {menuItems[activeCategory]?.map((item) => (
            <div className="col-12 col-md-6 col-lg-4" key={item.id}>
              <div className="card h-100">
                <img src={item.image} className="card-img-top" alt={item.name} height="200" style={{ objectFit: 'cover' }} />
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between">
                    <h5 className="card-title">{item.name}</h5>
                    <Badge bg="primary" pill>⭐ {item.rating}</Badge>
                  </div>
                  <p className="card-text text-muted">{item.description}</p>
                  <div className="mt-auto d-flex justify-content-between align-items-center">
                    <p className="h4 text-primary mb-0">${item.price.toFixed(2)}</p>
                    {getQuantityInCart(item.id) > 0 ? (
                      <div className="d-flex align-items-center gap-2">
                        <Button variant="outline-primary" size="sm" onClick={() => removeFromCart(item.id)}><Remove /></Button>
                        <span className="fw-bold">{getQuantityInCart(item.id)}</span>
                        <Button variant="outline-primary" size="sm" onClick={() => addToCart(item)}><Add /></Button>
                      </div>
                    ) : (
                      <Button variant="primary" onClick={() => addToCart(item)}><Add className="me-1" /> Add</Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Action Button */}
      {cart.length > 0 && (
        <Button
          variant="danger"
          className="position-fixed bottom-0 end-0 m-3 rounded-circle shadow-lg"
          style={{ width: '60px', height: '60px' }}
          onClick={() => setOrderModal(true)}>
          <Send />
        </Button>
      )}

      {/* Cart Offcanvas (Sidebar) */}
      <Offcanvas show={cartOpen} onHide={() => setCartOpen(false)} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Your Order ({getTotalItems()} items)</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <>
              <ul className="list-group list-group-flush mb-3">
                {cart.map(item => (
                  <li className="list-group-item d-flex justify-content-between align-items-center" key={item.id}>
                    <div>
                      <div>{item.name}</div>
                      <small className="text-muted">${item.price.toFixed(2)} each</small>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <Button variant="outline-primary" size="sm" onClick={() => removeFromCart(item.id)}><Remove /></Button>
                      <span className="fw-bold">{item.quantity}</span>
                      <Button variant="outline-primary" size="sm" onClick={() => addToCart(item)}><Add /></Button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="d-grid gap-2">
                <div className="card bg-light">
                  <div className="card-body text-center">
                    <h5 className="card-title">Total: ${getTotalPrice()}</h5>
                  </div>
                </div>
                <Button variant="primary" size="lg" onClick={() => { setCartOpen(false); setOrderModal(true); }}>
                  Place Order
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
            {orderStep === 1 && 'Complete Your Order'}
            {orderStep === 2 && 'Select Branch & Payment'}
            {orderStep === 3 && 'Pay with QR Code'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Step 1: Customer Info */}
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
                <Form.Control as="textarea" rows={2} placeholder="Enter delivery address" value={customerInfo.address} onChange={e => setCustomerInfo({ ...customerInfo, address: e.target.value })} required />
              </Form.Group>
              <div className="card bg-light mt-3">
                <div className="card-body">
                  <h6 className="card-title">Order Summary</h6>
                  {cart.map(item => (
                    <div className="d-flex justify-content-between" key={item.id}>
                      <span>{item.name} x{item.quantity}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <hr />
                  <div className="d-flex justify-content-between fw-bold">
                    <span>Total:</span>
                    <span>${getTotalPrice()}</span>
                  </div>
                </div>
              </div>
            </Form>
          )}

          {/* Step 2: Branch & Payment */}
          {orderStep === 2 && (
            <>
              <h6>Select a Branch:</h6>
              <div className="row g-2 mb-4">
                {branches.map(branch => (
                  <div className="col-12" key={branch.id}>
                    <div
                      className={`card card-body ${selectedBranch?.id === branch.id ? 'border-primary' : ''}`}
                      onClick={() => setSelectedBranch(branch)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="d-flex align-items-center">
                        <Store className="me-3 text-primary" />
                        <div>
                          <div className="fw-bold">{branch.name}</div>
                          <small className="text-muted">{branch.address}</small>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <hr />
              <h6>Select Payment Method:</h6>
              <Form.Check type="radio" id="cod" label="Cash on Delivery" value="COD" checked={paymentMethod === 'COD'} onChange={e => setPaymentMethod(e.target.value)} />
              <Form.Check type="radio" id="qr" label="Scan QR Code" value="QR" checked={paymentMethod === 'QR'} onChange={e => setPaymentMethod(e.target.value)} />
            </>
          )}

          {/* Step 3: QR Code */}
          {orderStep === 3 && (
            <div className="text-center">
              <h6>Please scan the QR code to pay:</h6>
              <img src="https://placehold.co/200x200/000000/FFFFFF?text=QR+Code" alt="QR Code" className="img-fluid my-3" />
              <p className="text-muted">After payment, please upload a screenshot of the receipt.</p>
              <Button variant="primary" onClick={handleFileUpload} disabled={qrUploaded}>
                {qrUploaded ? <><CheckCircle className="me-2" /> Uploaded</> : <><QrCode className="me-2" /> Upload Screenshot</>}
              </Button>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          {orderStep > 1 && <Button variant="secondary" onClick={() => setOrderStep(orderStep - 1)}>Back</Button>}
          <Button variant="outline-secondary" onClick={() => { setOrderModal(false); resetOrderProcess(); }}>Cancel</Button>
          <Button variant="primary" onClick={handleNextStep}>
            {(orderStep === 2 && paymentMethod === 'COD') || orderStep === 3 ? 'Place Order' : 'Next'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Notification Toast */}
      {notification.show && (
        <Alert
          variant={notification.variant}
          onClose={() => setNotification({ ...notification, show: false })}
          dismissible
          className="position-fixed bottom-0 start-50 translate-middle-x m-3 shadow-lg"
          style={{ zIndex: 1100 }}
        >
          {notification.message}
        </Alert>
      )}
    </>
  );
};

export default RestaurantOrderApp;