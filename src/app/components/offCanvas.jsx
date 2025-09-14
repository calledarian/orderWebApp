import React from "react";
import { Offcanvas, Button } from "react-bootstrap";

export default function OffCanvas({
    cart,
    cartOpen,
    setCartOpen,
    addToCart,
    removeFromCart,
    setOrderModal,
    getTotalPrice,
    isLogged,
    setCurrentPage
}) {
    return (
        <Offcanvas show={cartOpen} onHide={() => setCartOpen(false)} placement="end">
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Your Order</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body className="d-flex flex-column">
                {cart.length === 0 ? (
                    <div className="text-center m-auto">
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
                                        <small className="text-brand fw-bold">${(item.price * item.quantity).toFixed(2)}</small>
                                    </div>
                                    <div className="d-flex align-items-center gap-2">
                                        <Button variant="outline-danger" className="quantity-btn" onClick={() => removeFromCart(item.id)}>-</Button>
                                        <span className="fw-bold fs-5">{item.quantity}</span>
                                        <Button variant="danger" className="quantity-btn" onClick={() => addToCart(item)}>+</Button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-auto d-grid gap-2">
                            {isLogged ? (
                                <Button
                                    variant="brand"
                                    size="lg"
                                    onClick={() => {
                                        setCartOpen(false);
                                        setOrderModal(true);
                                    }}
                                >
                                    Go to Checkout - ${getTotalPrice()}
                                </Button>
                            ) : (
                                <Button
                                    variant="brand"
                                    size="lg"
                                    onClick={() => {
                                        setCartOpen(false);
                                        setCurrentPage('login');
                                    }}
                                >
                                    Go to Login - ${getTotalPrice()}
                                </Button>
                            )}

                        </div>
                    </>
                )}
            </Offcanvas.Body>
        </Offcanvas>
    );
}
