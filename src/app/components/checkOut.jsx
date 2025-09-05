import Image from "next/image";
import React, { useRef } from "react";
import { Modal, Button, Form } from "react-bootstrap";

export default function CheckOut({
    orderModal,
    setOrderModal,
    orderStep,
    setOrderStep,
    customerInfo,
    setCustomerInfo,
    selectedBranch,
    setSelectedBranch,
    paymentMethod,
    setPaymentMethod,
    qrUploaded,
    handleFileUpload,
    handleNextStep,
    branches
}) {
    const fileInputRef = useRef(null);

    return (
        <Modal show={orderModal} onHide={() => setOrderModal(false)} centered>
            <Modal.Header closeButton>
                <Modal.Title>Checkout</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {orderStep === 1 && (
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={customerInfo.name}
                                onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                                placeholder="Enter your name"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Phone</Form.Label>
                            <Form.Control
                                type="text"
                                value={customerInfo.phone}
                                onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                                placeholder="Enter your phone"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Address</Form.Label>
                            <Form.Control
                                type="text"
                                value={customerInfo.address}
                                onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                                placeholder="Enter delivery address"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Note (Optional)</Form.Label>
                            <Form.Control
                                type="text"
                                value={customerInfo.note}
                                onChange={(e) => setCustomerInfo({ ...customerInfo, note: e.target.value })}
                                placeholder="Any note?"
                            />
                        </Form.Group>
                    </Form>
                )}

                {orderStep === 2 && (
                    <>
                        <h6>Select Branch</h6>
                        <div className="d-flex flex-column">
                            {branches.map(branch => (
                                <div
                                    key={branch.id}
                                    onClick={() => setSelectedBranch(branch)}
                                    style={{
                                        padding: "1rem",
                                        border: "1px solid #ccc",
                                        borderRadius: "5px",
                                        cursor: "pointer",
                                        marginBottom: "0.5rem", // spacing between cards
                                        backgroundColor: selectedBranch?.id === branch.id ? "#0d6efd" : "white",
                                        color: selectedBranch?.id === branch.id ? "white" : "black",
                                        display: "flex",
                                        flexDirection: "column", // make content inside column
                                        transition: "all 0.2s ease"
                                    }}
                                >
                                    <strong>{branch.name}</strong>
                                    <span className="text-muted small">{branch.address}</span>
                                </div>
                            ))}
                        </div>

                        <Form.Group className="mt-3">
                            <Form.Label>Payment Method</Form.Label>
                            <Form.Select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                                <option value="QR">QR Payment</option>
                            </Form.Select>
                        </Form.Group>
                    </>
                )}

                {orderStep === 3 && paymentMethod === "QR" && (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
                        <h6>Upload Payment Screenshot</h6>

                        <Image
                            src="/logo/turkish_head.jpg"
                            alt="QR Code"
                            width={300}
                            height={300}
                        />

                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: "none" }}
                            onChange={handleFileUpload}
                            accept="image/*"
                        />

                        <Button
                            variant="outline-dark"
                            onClick={() => fileInputRef.current && fileInputRef.current.click()}
                        >
                            Upload Screenshot
                        </Button>

                        {qrUploaded && (
                            <div className="mt-2 text-success">Uploaded successfully!</div>
                        )}
                    </div>
                )}

            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => {
                    if (orderStep === 1) setOrderModal(false);
                    else setOrderStep(orderStep - 1);
                }}>
                    Back
                </Button>
                <Button variant="primary" onClick={handleNextStep}>
                    {orderStep === 2 && paymentMethod === "QR" ? "Place Order" : (orderStep === 3 ? "Place Order" : "Next")}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
