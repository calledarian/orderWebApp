"use client"

import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  IconButton,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Fab,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  Avatar,
  styled,
  Paper,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
} from '@mui/material';
import {
  ShoppingCart,
  Add,
  Remove,
  Phone,
  LocationOn,
  AccessTime,
  Star,
  Send,
  ArrowForwardIos,
  Store,
  QrCode,
  CheckCircle,
} from '@mui/icons-material';

// Customizing MUI components with styled() for a unified look
const OrangeBlackButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#FF5722',
  color: 'white',
  '&:hover': {
    backgroundColor: '#E64A19',
  },
}));

const OrangeBlackFab = styled(Fab)(({ theme }) => ({
  backgroundColor: '#FF5722',
  color: 'white',
  '&:hover': {
    backgroundColor: '#E64A19',
  },
}));

const RestaurantOrderApp = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [orderDialog, setOrderDialog] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', address: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [orderStep, setOrderStep] = useState(1); // 1: Customer Info, 2: Branch/Payment, 3: QR Upload
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('COD'); // 'COD' or 'QR'
  const [qrUploaded, setQrUploaded] = useState(false);

  // Sample menu data organized by categories
  const menuCategories = [
    { name: 'Popular', icon: '🔥' },
    { name: 'Appetizers', icon: '🥗' },
    { name: 'Shawarma', icon: '🌯' },
    { name: 'Plates', icon: '🍽️' },
    { name: 'Beverages', icon: '🥤' }
  ];

  const branches = [
    { id: 'b1', name: 'Phnom Penh Center Branch', address: '123, Street 51, Phnom Penh' },
    { id: 'b2', name: 'Boeung Keng Kang Branch', address: '456, Street 310, Phnom Penh' },
    { id: 'b3', name: 'Tuol Tompoung Branch', address: '789, Street 155, Phnom Penh' },
    { id: 'b4', name: 'Riverside Branch', address: '101, Sisowath Quay, Phnom Penh' },
  ];

  const menuItems = {
    'Popular': [
      { id: 1, name: 'Beef Shawarma Plate', price: 12.99, image: 'https://images.unsplash.com/photo-1615555415707-e815e98547cb?w=300&h=200&fit=crop', description: 'Tender beef slices with pickles, fries and toum', rating: 4.8 },
      { id: 2, name: 'Chicken Shawarma Wrap', price: 8.99, image: 'https://images.unsplash.com/photo-1620864380735-502a35368686?w=300&h=200&fit=crop', description: 'Marinated chicken wrap with toum and pickles', rating: 4.7 }
    ],
    'Appetizers': [
      { id: 3, name: 'Hummus with Pita', price: 5.99, image: 'https://images.unsplash.com/photo-1619865614397-9e2003c27e36?w=300&h=200&fit=crop', description: 'Creamy chickpea dip with warm pita bread', rating: 4.5 },
      { id: 4, name: 'Fattoush Salad', price: 6.99, image: 'https://images.unsplash.com/photo-1598460677843-d021f1d1829e?w=300&h=200&fit=crop', description: 'Crispy vegetable salad with sumac dressing', rating: 4.6 }
    ],
    'Shawarma': [
      { id: 5, name: 'Beef Shawarma Wrap', price: 8.99, image: 'https://images.unsplash.com/photo-1615555415707-e815e98547cb?w=300&h=200&fit=crop', description: 'Tender beef slices with fresh vegetables and sauce', rating: 4.9 },
      { id: 6, name: 'Chicken Shawarma Plate', price: 12.99, image: 'https://images.unsplash.com/photo-1597379796791-03dbdd98695d?w=300&h=200&fit=crop', description: 'Grilled chicken with rice, salad and sauce', rating: 4.4 }
    ],
    'Plates': [
      { id: 7, name: 'Kebab Plate', price: 15.99, image: 'https://images.unsplash.com/photo-1589133465492-4f36a3e200e4?w=300&h=200&fit=crop', description: 'Skewered grilled meat with a side of rice', rating: 4.8 },
      { id: 8, name: 'Falafel Plate', price: 10.99, image: 'https://images.unsplash.com/photo-1621539276486-3575979bb1f6?w=300&h=200&fit=crop', description: 'Crispy fried falafel balls with tahini sauce', rating: 4.7 }
    ],
    'Beverages': [
      { id: 9, name: 'Turkish Coffee', price: 3.99, image: 'https://images.unsplash.com/photo-1563603417646-ac78d052b083?w=300&h=200&fit=crop', description: 'Strong and rich traditional coffee', rating: 4.3 },
      { id: 10, name: 'Ayran', price: 2.99, image: 'https://images.unsplash.com/photo-1628045624738-4f515c13e5f2?w=300&h=200&fit=crop', description: 'Refreshing yogurt drink with a hint of salt', rating: 4.5 }
    ]
  };

  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
    setSnackbar({ open: true, message: `${item.name} added to cart!`, severity: 'success' });
  };

  const removeFromCart = (itemId) => {
    const existingItem = cart.find(cartItem => cartItem.id === itemId);
    if (existingItem && existingItem.quantity > 1) {
      setCart(cart.map(cartItem =>
        cartItem.id === itemId
          ? { ...cartItem, quantity: cartItem.quantity - 1 }
          : cartItem
      ));
    } else {
      setCart(cart.filter(cartItem => cartItem.id !== itemId));
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getQuantityInCart = (itemId) => {
    const item = cart.find(cartItem => cartItem.id === itemId);
    return item ? item.quantity : 0;
  };

  const handleOrder = () => {
    // This function now handles the final order submission
    const orderSummary = {
      customer: customerInfo,
      items: cart,
      total: getTotalPrice(),
      branch: selectedBranch,
      paymentMethod: paymentMethod,
      timestamp: new Date().toISOString()
    };

    console.log('Order placed:', orderSummary);

    // Simulate order success
    setSnackbar({ open: true, message: 'Order placed successfully! We\'ll contact you soon.', severity: 'success' });
    setCart([]);
    setOrderDialog(false);
    setOrderStep(1); // Reset to the first step for the next order
    setCustomerInfo({ name: '', phone: '', address: '' });
    setSelectedBranch(null);
    setPaymentMethod('COD');
    setQrUploaded(false);
  };

  const handleNextStep = () => {
    if (orderStep === 1) {
      if (customerInfo.name && customerInfo.phone) {
        setOrderStep(2);
      } else {
        setSnackbar({ open: true, message: 'Please fill in your name and phone number', severity: 'error' });
      }
    } else if (orderStep === 2) {
      if (selectedBranch) {
        if (paymentMethod === 'COD') {
          handleOrder();
        } else {
          setOrderStep(3); // Go to QR upload step
        }
      } else {
        setSnackbar({ open: true, message: 'Please select a branch', severity: 'error' });
      }
    } else if (orderStep === 3) {
      if (qrUploaded) {
        handleOrder();
      } else {
        setSnackbar({ open: true, message: 'Please upload the payment screenshot', severity: 'error' });
      }
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleFileUpload = () => {
    // This is a simplified, non-functional file upload for demonstration.
    // In a real app, this would handle the file data.
    setQrUploaded(true);
    setSnackbar({ open: true, message: 'Payment screenshot "uploaded" successfully!', severity: 'info' });
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#121212', minHeight: '100vh', color: '#E0E0E0' }}>
      {/* Header */}
      <AppBar position="sticky" sx={{ bgcolor: '#000000', borderBottom: '2px solid #FF5722' }}>
        <Toolbar>
          <Avatar sx={{ mr: 2, bgcolor: '#FF5722' }}>🌯</Avatar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Turkish Shawarma & Grill
          </Typography>
          <IconButton color="inherit" onClick={() => setCartOpen(true)}>
            <Badge badgeContent={getTotalItems()} sx={{
              '& .MuiBadge-badge': {
                bgcolor: '#FF5722',
                color: 'white',
              }
            }}>
              <ShoppingCart />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Restaurant Info */}
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Card sx={{ mb: 4, background: 'linear-gradient(135deg, #1A1A1A 0%, #333333 100%)', color: 'white', border: '1px solid #FF5722' }}>
          <CardContent>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              Authentic Turkish Shawarma in Phnom Penh 🇰🇭
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, flexWrap: 'wrap' }}>
              <Star sx={{ color: '#FFB300', mr: 1 }} />
              <Typography variant="body1" sx={{ mr: 2 }}>4.9 ★ (500+ reviews)</Typography>
              <AccessTime sx={{ mr: 1 }} />
              <Typography variant="body2" sx={{ mr: 2 }}>Delivery: 20-30 min</Typography>
              <LocationOn sx={{ mr: 1 }} />
              <Typography variant="body2">Free delivery over $15</Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Category Tabs */}
        <Card sx={{ mb: 4, bgcolor: '#212121' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              '& .MuiTab-root': {
                color: '#BDBDBD',
                '&.Mui-selected': {
                  color: '#FF5722',
                  fontWeight: 'bold',
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#FF5722',
              }
            }}
          >
            {menuCategories.map((category, index) => (
              <Tab
                key={index}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span style={{ fontSize: '18px' }}>{category.icon}</span>
                    {category.name}
                  </Box>
                }
              />
            ))}
          </Tabs>
        </Card>

        {/* Menu Items */}
        <Grid container spacing={3}>
          {menuItems[menuCategories[activeTab].name]?.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: '#212121',
                color: '#E0E0E0',
                transition: 'all 0.3s',
                border: '1px solid #333333',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
                  border: '1px solid #FF5722',
                }
              }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={item.image}
                  alt={item.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                    <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                      {item.name}
                    </Typography>
                    <Chip label={`⭐ ${item.rating}`} size="small" sx={{ bgcolor: '#FF5722', color: 'white', fontWeight: 'bold' }} />
                  </Box>
                  <Typography variant="body2" color="#BDBDBD" sx={{ mb: 2 }}>
                    {item.description}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h5" color="#FF5722" fontWeight="bold">
                      ${item.price}
                    </Typography>
                    {getQuantityInCart(item.id) > 0 ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton size="small" onClick={() => removeFromCart(item.id)} sx={{ color: '#FF5722' }}>
                          <Remove />
                        </IconButton>
                        <Typography sx={{ color: '#FF5722', fontWeight: 'bold', minWidth: '20px', textAlign: 'center' }}>{getQuantityInCart(item.id)}</Typography>
                        <IconButton size="small" onClick={() => addToCart(item)} sx={{ color: '#FF5722' }}>
                          <Add />
                        </IconButton>
                      </Box>
                    ) : (
                      <OrangeBlackButton
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => addToCart(item)}
                        sx={{ borderRadius: 3 }}
                      >
                        Add
                      </OrangeBlackButton>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Floating Order Button */}
      {cart.length > 0 && (
        <OrangeBlackFab
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
          }}
          onClick={() => setOrderDialog(true)}
        >
          <Send />
        </OrangeBlackFab>
      )}

      {/* Cart Drawer */}
      <Drawer anchor="right" open={cartOpen} onClose={() => setCartOpen(false)} PaperProps={{ sx: { bgcolor: '#212121', color: '#E0E0E0' } }}>
        <Box sx={{ width: 350, p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            Your Order ({getTotalItems()} items)
          </Typography>
          {cart.length === 0 ? (
            <Typography color="#BDBDBD">Your cart is empty</Typography>
          ) : (
            <>
              <List>
                {cart.map((item) => (
                  <ListItem key={item.id} sx={{ borderBottom: '1px solid #333333' }}>
                    <ListItemText
                      primary={item.name}
                      secondary={<Typography color="#BDBDBD">${item.price} each</Typography>}
                    />
                    <ListItemSecondaryAction>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton size="small" onClick={() => removeFromCart(item.id)} disabled={item.quantity === 1} sx={{ color: item.quantity === 1 ? '#424242' : '#FF5722' }}>
                          <Remove />
                        </IconButton>
                        <Typography sx={{ color: '#FF5722', fontWeight: 'bold' }}>{item.quantity}</Typography>
                        <IconButton size="small" onClick={() => addToCart(item)} sx={{ color: '#FF5722' }}>
                          <Add />
                        </IconButton>
                      </Box>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
              <Box sx={{ mt: 3, p: 2, bgcolor: '#333333', borderRadius: 2 }}>
                <Typography variant="h5" align="center" sx={{ fontWeight: 'bold' }}>
                  Total: ${getTotalPrice()}
                </Typography>
                <OrangeBlackButton
                  fullWidth
                  variant="contained"
                  sx={{ mt: 2 }}
                  onClick={() => {
                    setCartOpen(false);
                    setOrderDialog(true);
                  }}
                  disabled={cart.length === 0}
                >
                  Place Order
                </OrangeBlackButton>
              </Box>
            </>
          )}
        </Box>
      </Drawer>

      {/* Order Dialog */}
      <Dialog open={orderDialog} onClose={() => { setOrderDialog(false); setOrderStep(1); }} maxWidth="sm" fullWidth PaperProps={{ sx: { bgcolor: '#212121', color: '#E0E0E0' } }}>
        <DialogTitle sx={{ borderBottom: '1px solid #333333', fontWeight: 'bold' }}>
          {orderStep === 1 && 'Complete Your Order'}
          {orderStep === 2 && 'Select Branch & Payment'}
          {orderStep === 3 && 'Pay with QR Code'}
        </DialogTitle>
        <DialogContent>
          {/* Step 1: Customer Info */}
          {orderStep === 1 && (
            <Box sx={{ mt: 1 }}>
              <TextField
                fullWidth
                label="Your Name"
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                margin="normal"
                required
                sx={{
                  '& .MuiInputBase-input': { color: '#E0E0E0' },
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#BDBDBD' },
                  '& .MuiInputLabel-root': { color: '#BDBDBD' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#FF5722' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#FF5722' },
                }}
              />
              <TextField
                fullWidth
                label="Phone Number"
                value={customerInfo.phone}
                onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                margin="normal"
                required
                sx={{
                  '& .MuiInputBase-input': { color: '#E0E0E0' },
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#BDBDBD' },
                  '& .MuiInputLabel-root': { color: '#BDBDBD' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#FF5722' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#FF5722' },
                }}
              />
              <TextField
                fullWidth
                label="Delivery Address"
                value={customerInfo.address}
                onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                margin="normal"
                multiline
                rows={2}
                required
                sx={{
                  '& .MuiInputBase-input': { color: '#E0E0E0' },
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#BDBDBD' },
                  '& .MuiInputLabel-root': { color: '#BDBDBD' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#FF5722' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#FF5722' },
                }}
              />
              <Box sx={{ mt: 3, p: 2, bgcolor: '#333333', borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>Order Summary:</Typography>
                {cart.map((item) => (
                  <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>{item.name} x{item.quantity}</Typography>
                    <Typography>${(item.price * item.quantity).toFixed(2)}</Typography>
                  </Box>
                ))}
                <Box sx={{ borderTop: 1, borderColor: '#424242', pt: 1, mt: 1 }}>
                  <Typography variant="h5" sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                    <span>Total:</span>
                    <span>${getTotalPrice()}</span>
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}

          {/* Step 2: Branch & Payment Method */}
          {orderStep === 2 && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>Select a Branch:</Typography>
              <Grid container spacing={2}>
                {branches.map((branch) => (
                  <Grid item xs={12} key={branch.id}>
                    <Paper
                      onClick={() => setSelectedBranch(branch)}
                      sx={{
                        p: 2,
                        cursor: 'pointer',
                        bgcolor: selectedBranch?.id === branch.id ? '#333333' : '#1A1A1A',
                        border: selectedBranch?.id === branch.id ? '2px solid #FF5722' : '2px solid transparent',
                        transition: 'all 0.2s',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Store sx={{ color: '#FF5722', mr: 2 }} />
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{branch.name}</Typography>
                          <Typography variant="body2" color="#BDBDBD">{branch.address}</Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>

              <Divider sx={{ my: 3, bgcolor: '#424242' }} />

              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>Select Payment Method:</Typography>
              <RadioGroup
                aria-label="payment-method"
                name="payment-method"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <FormControlLabel
                  value="COD"
                  control={<Radio sx={{ color: '#FF5722' }} />}
                  label={<Typography sx={{ color: '#E0E0E0' }}>Cash on Delivery</Typography>}
                />
                <FormControlLabel
                  value="QR"
                  control={<Radio sx={{ color: '#FF5722' }} />}
                  label={<Typography sx={{ color: '#E0E0E0' }}>Scan QR Code</Typography>}
                />
              </RadioGroup>
            </Box>
          )}

          {/* Step 3: QR Upload */}
          {orderStep === 3 && (
            <Box sx={{ mt: 1, textAlign: 'center' }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Please scan the QR code to pay:</Typography>
              <Box sx={{ p: 2, bgcolor: '#fff', display: 'inline-block', borderRadius: 2 }}>
                <img
                  src="https://placehold.co/200x200/000000/FFFFFF?text=QR+Code"
                  alt="QR Code for Payment"
                  style={{ display: 'block' }}
                />
              </Box>
              <Typography variant="body2" color="#BDBDBD" sx={{ mt: 2 }}>
                After payment, please upload a screenshot of the receipt.
              </Typography>
              <OrangeBlackButton
                variant="contained"
                sx={{ mt: 3 }}
                onClick={handleFileUpload}
                disabled={qrUploaded}
                startIcon={qrUploaded ? <CheckCircle /> : null}
              >
                {qrUploaded ? 'Screenshot Uploaded' : 'Upload Screenshot'}
              </OrangeBlackButton>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #333333' }}>
          {orderStep > 1 && (
            <Button onClick={() => setOrderStep(orderStep - 1)} sx={{ color: '#BDBDBD' }}>Back</Button>
          )}
          <Button onClick={() => { setOrderDialog(false); setOrderStep(1); }} sx={{ color: '#BDBDBD' }}>Cancel</Button>
          <OrangeBlackButton
            variant="contained"
            onClick={handleNextStep}
            disabled={
              (orderStep === 1 && (!customerInfo.name || !customerInfo.phone)) ||
              (orderStep === 2 && !selectedBranch) ||
              (orderStep === 3 && !qrUploaded)
            }
          >
            {paymentMethod === 'COD' && orderStep === 2 ? 'Place Order' : 'Next'}
          </OrangeBlackButton>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })} sx={{ bgcolor: snackbar.severity === 'success' ? '#2E7D32' : '#D32F2F', color: 'white' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RestaurantOrderApp;
