"use client";

import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Alert } from "react-bootstrap";
import Header from "./components/header";
import Category from "./components/category";
import Menu from "./components/menu";
import OffCanvas from "./components/offCanvas";
import CheckOut from "./components/checkOut";
import LabelBottomNavigation from "./components/BottomNavigation";
import Branches from "./components/branches";
import ProfilePage from "./components/LoginPage";

const RestaurantOrderApp = () => {

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [isLogged, setIsLogged] = useState(false);
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
          "https://images.unsplash.com/photo-1734772591537-15ac1b3b3c04?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y2hpY2tlbiUyMHNoYXdhcm1hfGVufDB8fDB8fHww",
      },
      {
        id: 2,
        name: "Beef Shawarma",
        description: "Marinated beef with tahini",
        price: 9.5,
        rating: 4.9,
        image:
          "https://images.unsplash.com/photo-1642783944285-b33b18ef6c3b?w=500&auto=format&fit=crop&q=60",
      },
      {
        id: 3,
        name: "Lamb Shawarma",
        description: "Juicy lamb with spices and fresh veggies",
        price: 10.0,
        rating: 4.7,
        image:
          "https://images.unsplash.com/photo-1644615988562-31d2e98fb6b7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bGFtYiUyMHNoYXdhcm1hfGVufDB8fDB8fHww",
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
          "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60",
      },
      {
        id: 5,
        name: "Cheeseburger",
        description: "Beef patty with cheddar cheese",
        price: 8.0,
        rating: 4.5,
        image:
          "https://images.unsplash.com/photo-1748955308760-8339b52f9c62?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y2hlc3NidXJnZXJ8ZW58MHx8MHx8fDA%3D",
      },
      {
        id: 6,
        name: "Veggie Burger",
        description: "Grilled vegetables with vegan patty",
        price: 7.0,
        rating: 4.3,
        image:
          "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dmVnZ2llJTIwYnVyZ2VyfGVufDB8fDB8fHww",
      },
    ],
    Pizza: [
      {
        id: 7,
        name: "Margherita",
        description: "Classic tomato and mozzarella",
        price: 12.0,
        rating: 4.4,
        image:
          "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&auto=format&fit=crop&q=60",
      },
      {
        id: 8,
        name: "Pepperoni Pizza",
        description: "Loaded with pepperoni slices",
        price: 14.0,
        rating: 4.6,
        image:
          "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGVwcGVyb25pJTIwcGl6emF8ZW58MHx8MHx8fDA%3D",
      },
      {
        id: 9,
        name: "BBQ Chicken Pizza",
        description: "Grilled chicken with BBQ sauce",
        price: 15.0,
        rating: 4.7,
        image:
          "https://plus.unsplash.com/premium_photo-1672498193372-2b91ef813252?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YmJxJTIwY2hpY2tlbiUyMHBpenphfGVufDB8fDB8fHww",
      },
    ],
    Drinks: [
      {
        id: 10,
        name: "Turkish Tea",
        description: "Traditional black tea",
        price: 2.5,
        rating: 4.7,
        image:
          "https://plus.unsplash.com/premium_photo-1676232731729-c06e936bbd96?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      {
        id: 11,
        name: "Fresh Lemonade",
        description: "Refreshing lemon drink",
        price: 3.0,
        rating: 4.5,
        image:
          "https://plus.unsplash.com/premium_photo-1690291030264-108119cd2eea?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZnJlc2glMjBsZW1vbmFkZXxlbnwwfHwwfHx8MA%3D%3D",
      },
      {
        id: 12,
        name: "Orange Juice",
        description: "Freshly squeezed oranges",
        price: 3.5,
        rating: 4.6,
        image:
          "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8b3JhbmdlJTIwanVpY2V8ZW58MHx8MHx8fDA%3D",
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

  // Load cart from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    }
  }, []);

  // Save cart whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);


  const [cartOpen, setCartOpen] = useState(false);
  const [orderModal, setOrderModal] = useState(false);
  const [user, setUser] = useState(null);
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
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (isSubmitting) return; // prevent double-clicks
    setIsSubmitting(true);

    try {
      const telegramUserRaw = localStorage.getItem("telegramUser");
      if (!telegramUserRaw) {
        showNotification("Please log in with Telegram before placing order", "danger");
        setIsSubmitting(false);
        return;
      }

      if (cart.length === 0) {
        showNotification("Your cart is empty", "danger");
        setIsSubmitting(false);
        return;
      }

      const telegramUser = JSON.parse(telegramUserRaw);

      const orders = cart.map(item => ({
        menuCategory: item.category || activeCategory,
        menuItem: item.name,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity,

        name: customerInfo.name,
        phone: customerInfo.phone,
        address: customerInfo.address,
        note: customerInfo.note,

        branchName: selectedBranch?.name || null,
        qrImage: qrUrl || null,
        telegramId: telegramUser.id,
      }));

      const response = await fetch(`${BACKEND_URL}/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orders),
      });

      const result = await response.json();

      if (response.ok) {
        showNotification(result.message || "Order sent successfully!", "success");
        setCart([]);
        setOrderModal(false);
        resetOrderProcess();
      } else {
        console.error("Order failed:", result);
        showNotification(result.message || "Failed to send order", "danger");
      }
    } catch (err) {
      console.error("Order error:", err);
      showNotification("Something went wrong while sending order", "danger");
    } finally {
      setIsSubmitting(false); // always re-enable after request finishes
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
      const transformedUrl = data.secure_url.replace(
        "/upload/",
        "/upload/w_1280,q_auto,f_auto/"
      );
      setQrUrl(transformedUrl);
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
        ) : activePage === "branches" ? (
          <div className="my-4">
            <Branches
              branches={branches}
              selectedBranch={selectedBranch}
              setSelectedBranch={setSelectedBranch}
            />
          </div>
        ) : activePage === "login" ? (
          <ProfilePage
            user={user}
            setUser={setUser}
            isLogged={isLogged}
            setIsLogged={setIsLogged}
          />

        ) : null}
      </div>

      <OffCanvas
        cart={cart}
        cartOpen={cartOpen}
        setCartOpen={setCartOpen}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
        setOrderModal={setOrderModal}
        getTotalPrice={getTotalPrice}
        isLogged={isLogged}
        setCurrentPage={setActivePage}
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
        isLogged={isLogged}
        isSubmitting={isSubmitting}
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
