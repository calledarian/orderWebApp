import React from "react";
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
                        <div className="d-flex flex-column gap-2">
                            {branches.map(branch => (
                                <div
                                    key={branch.id}
                                    className={`p-2 border branch-card ${selectedBranch?.id === branch.id ? "selected" : ""}`}
                                    onClick={() => setSelectedBranch(branch)}
                                >
                                    <strong>{branch.name}</strong>
                                    <div className="text-muted small">{branch.address}</div>
                                </div>
                            ))}
                        </div>
                        <Form.Group className="mt-3">
                            <Form.Label>Payment Method</Form.Label>
                            <Form.Select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                                <option value="COD">Cash on Delivery</option>
                                <option value="QR">QR Payment</option>
                            </Form.Select>
                        </Form.Group>
                    </>
                )}

                {orderStep === 3 && paymentMethod === "QR" && (
                    <>
                        <h6>Upload Payment Screenshot</h6>
                        <Button variant="outline-dark" onClick={handleFileUpload}>Upload Screenshot</Button>
                        {qrUploaded && <div className="mt-2 text-success">Uploaded successfully!</div>}
                    </>
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
                    {orderStep === 2 && paymentMethod === "COD" ? "Place Order" : (orderStep === 3 ? "Place Order" : "Next")}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
