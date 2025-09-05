"use client";

import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Alert } from "react-bootstrap";
import Header from "./components/header";
import Category from "./components/category";
import Menu from "./components/menu";
import OffCanvas from "./components/offCanvas";
import CheckOut from "./components/checkOut";
import LabelBottomNavigation from "./components/BottomNavigation";
import Branches from "./components/branches";

const RestaurantOrderApp = () => {
  // --- Data ---
  const menuCategories = ["All", "Shawarma", "Burgers", "Pizza", "Drinks"];

  const menuItems = {
    Shawarma: [
      {
        id: 1,
        name: "Chicken Shawarma",
        description: "Tender chicken with garlic sauce",
        price: 8.5,
        rating: 4.8,
        image:
          "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&h=300&fit=crop",
      },
      {
        id: 2,
        name: "Beef Shawarma",
        description: "Marinated beef with tahini",
        price: 9.5,
        rating: 4.9,
        image:
          "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
      },
    ],
    Burgers: [
      {
        id: 4,
        name: "Turkish Burger",
        description: "Special sauce and fresh vegetables",
        price: 7.5,
        rating: 4.6,
        image:
          "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
      },
    ],
    Pizza: [
      {
        id: 6,
        name: "Margherita",
        description: "Classic tomato and mozzarella",
        price: 12.0,
        rating: 4.4,
        image:
          "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
      },
    ],
    Drinks: [
      {
        id: 8,
        name: "Turkish Tea",
        description: "Traditional black tea",
        price: 2.5,
        rating: 4.7,
        image:
          "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop",
      },
    ],
  };

  const branches = [
    {
      id: 1,
      name: "Central Market",
      address: "Russian Market, Phnom Penh",
      map: "https://www.google.com/maps?q=Street+51,+BKK1,+Phnom+Penh",
    },
    {
      id: 2,
      name: "Riverside",
      address: "Sisowath Quay, Phnom Penh",
      map: "https://www.google.com/maps?q=Street+51,+BKK1,+Phnom+Penh",
    },
    {
      id: 3,
      name: "BKK1",
      address: "Street 51, BKK1, Phnom Penh",
      map: "https://www.google.com/maps?q=Street+51,+BKK1,+Phnom+Penh",
    },
  ];

  // --- State ---
  const [activeCategory, setActiveCategory] = useState("All");
  const [activePage, setActivePage] = useState("menu");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [orderModal, setOrderModal] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    address: "",
    note: "",
  });
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    variant: "success",
  });
  const [orderStep, setOrderStep] = useState(1);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("QR");
  const [qrUploaded, setQrUploaded] = useState(false);
  const [qrUrl, setQrUrl] = useState("");

  // --- Core Functions ---
  const addToCart = (item) => {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);
    if (existingItem) {
      setCart(
        cart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId) => {
    const existingItem = cart.find((cartItem) => cartItem.id === itemId);
    if (existingItem && existingItem.quantity > 1) {
      setCart(
        cart.map((cartItem) =>
          cartItem.id === itemId
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        )
      );
    } else {
      setCart(cart.filter((cartItem) => cartItem.id !== itemId));
    }
  };

  const getTotalPrice = () =>
    cart
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);

  const getTotalItems = () =>
    cart.reduce((total, item) => total + item.quantity, 0);

  const getQuantityInCart = (itemId) =>
    cart.find((cartItem) => cartItem.id === itemId)?.quantity || 0;

  const getItemsForCategory = (category) => {
    if (category === "All") return Object.values(menuItems).flat();
    return menuItems[category] || [];
  };

  const handlePlaceOrder = async () => {
    try {
      const response = await fetch(
        "https://orderwebappserver.onrender.com/order",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            cart.map((item) => ({
              menuCategory: item.category || activeCategory,
              menuItem: item.name,
              quantity: item.quantity,
              price: item.price,
              name: customerInfo.name,
              phone: customerInfo.phone,
              address: customerInfo.address,
              note: customerInfo.note,
              branchId: selectedBranch?.id,
              qrImage: qrUrl || null,
            }))
          ),
        }
      );

      const result = await response.json();

      if (response.ok) {
        showNotification(
          result.message || "Order sent to Telegram successfully!",
          "success"
        );
        setCart([]);
        setOrderModal(false);
        resetOrderProcess();
      } else {
        showNotification(result.message || "Failed to send order", "danger");
      }
    } catch (err) {
      console.error(err);
      showNotification("Something went wrong while sending order", "danger");
    }
  };

  const handleNextStep = () => {
    if (orderStep === 1) {
      if (customerInfo.name && customerInfo.phone) setOrderStep(2);
      else showNotification("Please fill in your name and phone number", "danger");
    } else if (orderStep === 2) {
      if (selectedBranch) {
        if (paymentMethod === "COD") handlePlaceOrder();
        else setOrderStep(3);
      } else showNotification("Please select a branch", "danger");
    } else if (orderStep === 3) {
      if (qrUploaded) handlePlaceOrder();
      else showNotification("Please upload the payment screenshot", "danger");
    }
  };

  const resetOrderProcess = () => {
    setOrderStep(1);
    setCustomerInfo({ name: "", phone: "", address: "", note: "" });
    setSelectedBranch(null);
    setPaymentMethod("QR");
    setQrUploaded(false);
    setQrUrl("");
  };

  // --- Fixed File Upload ---
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "QR_payments"); // must match your unsigned preset

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData
        }
      );

      if (!res.ok) {
        const text = await res.text();
        console.error("Cloudinary upload failed:", text);
        throw new Error("Cloudinary upload failed");
      }

      const data = await res.json();
      console.log("Cloudinary upload success:", data.secure_url);
      setQrUrl(data.secure_url);
      setQrUploaded(true);
      showNotification("Payment screenshot uploaded successfully!", "info");
    } catch (err) {
      console.error("Upload error:", err);
      showNotification("Failed to upload image", "danger");
    }
  };



  const showNotification = (message, variant) => {
    setNotification({ show: true, message, variant });
    setTimeout(
      () => setNotification({ show: false, message: "", variant: "success" }),
      3000
    );
  };

  return (
    <>
      <Header
        cartOpen={cartOpen}
        setCartOpen={setCartOpen}
        getTotalItems={getTotalItems}
      />

      <div style={{ flexGrow: 1, overflowY: "auto", minHeight: "100vh" }}>
        {activePage === "menu" ? (
          <div className="container my-4">
            <Category
              menuCategories={menuCategories}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
            />
            <Menu
              items={getItemsForCategory(activeCategory)}
              getQuantityInCart={getQuantityInCart}
              addToCart={addToCart}
              removeFromCart={removeFromCart}
            />
          </div>
        ) : (
          <div className="my-4">
            <Branches
              branches={branches}
              selectedBranch={selectedBranch}
              setSelectedBranch={setSelectedBranch}
            />
          </div>
        )}
      </div>

      <OffCanvas
        cart={cart}
        cartOpen={cartOpen}
        setCartOpen={setCartOpen}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
        setOrderModal={setOrderModal}
        getTotalPrice={getTotalPrice}
      />

      <CheckOut
        orderModal={orderModal}
        setOrderModal={setOrderModal}
        orderStep={orderStep}
        setOrderStep={setOrderStep}
        customerInfo={customerInfo}
        setCustomerInfo={setCustomerInfo}
        selectedBranch={selectedBranch}
        setSelectedBranch={setSelectedBranch}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        qrUploaded={qrUploaded}
        handleFileUpload={handleFileUpload}
        handleNextStep={handleNextStep}
        branches={branches}
      />

      {notification.show && (
        <Alert
          variant={notification.variant}
          className="position-fixed top-0 start-50 translate-middle-x m-3 shadow-lg"
          style={{ zIndex: 1100 }}
        >
          {notification.message}
        </Alert>
      )}

      <LabelBottomNavigation
        currentPage={activePage}
        setCurrentPage={setActivePage}
      />
    </>
  );
};

export default RestaurantOrderApp;
