import React from "react";
import { Button } from "react-bootstrap";

export default function CartBar({ cart, getTotalItems, getTotalPrice, setCartOpen }) {
    return (
        <div className={`view-cart-bar p-3 bg-white shadow-lg ${cart.length > 0 ? "show" : ""}`}>
            <div className="container">
                <div className="d-grid">
                    <Button
                        variant="brand"
                        size="lg"
                        className="d-flex justify-content-between align-items-center"
                        onClick={() => setCartOpen(true)}
                    >
                        <span>
                            {getTotalItems()} item{getTotalItems() > 1 && "s"} | ${getTotalPrice()}
                        </span>
                        <span>View Cart</span>
                    </Button>
                </div>
            </div>
        </div>
    );
}
