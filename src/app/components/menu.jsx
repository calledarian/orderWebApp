import React from "react";
import { Button } from "react-bootstrap";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

export default function Menu({
    items,
    getQuantityInCart,
    addToCart,
    removeFromCart
}) {
    return (
        <div className="row g-3 mb-5">
            {items.map((item) => (
                <div className="col-12 col-md-6 col-lg-4" key={item.id}>
                    <div className="card h-100 border-0 card-menu-item">
                        <img
                            src={item.image}
                            className="card-img-top"
                            alt={item.name}
                            height="200"
                            style={{ objectFit: "cover" }}
                        />
                        <div className="card-body d-flex flex-column">
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className="card-title mb-1">{item.name}</h5>
                                <span>{item.rating}</span>
                            </div>
                            <p className="card-text text-muted small flex-grow-1">
                                {item.description}
                            </p>
                            <div className="mt-auto d-flex justify-content-between align-items-center">
                                <p className="h4 text-brand fw-bold mb-0">${item.price.toFixed(2)}</p>
                                {getQuantityInCart(item.id) > 0 ? (
                                    <div className="d-flex align-items-center gap-2">
                                        <Button
                                            variant="outline-danger"
                                            className="quantity-btn"
                                            onClick={() => removeFromCart(item.id)}
                                        >
                                            <RemoveIcon />
                                        </Button>
                                        <span className="fw-bold fs-5">{getQuantityInCart(item.id)}</span>
                                        <Button
                                            variant="danger"
                                            className="quantity-btn"
                                            onClick={() => addToCart(item)}
                                        >
                                            <AddIcon />
                                        </Button>
                                    </div>
                                ) : (
                                    <Button
                                        variant="outline-dark"
                                        onClick={() => addToCart(item)}
                                    >
                                        <AddShoppingCartIcon />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
