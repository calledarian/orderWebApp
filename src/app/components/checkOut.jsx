import Image from "next/image";
import React, { useRef, useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";

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
    const [errors, setErrors] = useState({});
    const [showError, setShowError] = useState(false);
    const [loading, setLoading] = useState(false);

    // Validation functions
    const validateStep1 = () => {
        const newErrors = {};

        if (!customerInfo.name || customerInfo.name.trim().length === 0) {
            newErrors.name = "Name is required";
        } else if (customerInfo.name.trim().length < 2) {
            newErrors.name = "Name must be at least 2 characters long";
        } else if (!/^[a-zA-Z\s]+$/.test(customerInfo.name.trim())) {
            newErrors.name = "Name can only contain letters and spaces";
        }

        if (!customerInfo.phone || customerInfo.phone.trim().length === 0) {
            newErrors.phone = "Phone number is required";
        } else if (!/^[0-9+\-\s()]+$/.test(customerInfo.phone)) {
            newErrors.phone = "Please enter a valid phone number";
        } else if (customerInfo.phone.replace(/[^0-9]/g, '').length < 8) {
            newErrors.phone = "Phone number must be at least 8 digits";
        }

        if (!customerInfo.address || customerInfo.address.trim().length === 0) {
            newErrors.address = "Delivery address is required";
        } else if (customerInfo.address.trim().length < 10) {
            newErrors.address = "Please provide a more detailed address (at least 10 characters)";
        }

        // Note is optional, but if provided, validate it
        if (customerInfo.note && customerInfo.note.length > 200) {
            newErrors.note = "Note cannot exceed 200 characters";
        }

        return newErrors;
    };

    const validateStep2 = () => {
        const newErrors = {};

        if (!selectedBranch) {
            newErrors.branch = "Please select a branch";
        }

        if (!paymentMethod) {
            newErrors.paymentMethod = "Please select a payment method";
        }

        return newErrors;
    };

    const validateStep3 = () => {
        const newErrors = {};

        if (paymentMethod === "QR" && !qrUploaded) {
            newErrors.qrUpload = "Please upload payment screenshot";
        }

        return newErrors;
    };

    const handleValidatedNextStep = () => {
        let validationErrors = {};

        // Validate current step
        if (orderStep === 1) {
            validationErrors = validateStep1();
        } else if (orderStep === 2) {
            validationErrors = validateStep2();
        } else if (orderStep === 3) {
            validationErrors = validateStep3();
        }

        setErrors(validationErrors);

        // If there are validation errors, show them and don't proceed
        if (Object.keys(validationErrors).length > 0) {
            setShowError(true);
            setTimeout(() => setShowError(false), 5000); // Hide error after 5 seconds
            return;
        }

        // If validation passes, proceed to next step
        setShowError(false);
        handleNextStep();
    };

    const handleInputChange = (field, value) => {
        setCustomerInfo({ ...customerInfo, [field]: value });

        // Clear error for this field when user starts typing
        if (errors[field]) {
            setErrors({ ...errors, [field]: null });
        }
    };

    const handleFileUploadWithValidation = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setLoading(true);

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedTypes.includes(file.type)) {
            setErrors({ ...errors, qrUpload: "Please upload a valid image file (JPEG, PNG, JPG)" });
            setShowError(true);
            setTimeout(() => setShowError(false), 5000);
            setLoading(false);
            return;
        }

        // Validate file size (max 10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB in bytes
        if (file.size > maxSize) {
            setErrors({ ...errors, qrUpload: "File size must be less than 10MB" });
            setShowError(true);
            setTimeout(() => setShowError(false), 5000);
            setLoading(false);
            return;
        }

        // Clear upload error if validation passes
        if (errors.qrUpload) {
            setErrors({ ...errors, qrUpload: null });
        }

        try {
            await handleFileUpload(e); // wait until upload finishes
        } catch (err) {
            setErrors({ ...errors, qrUpload: "Upload failed, please try again" });
            setShowError(true);
            setTimeout(() => setShowError(false), 5000);
        } finally {
            setLoading(false); // only stop loading after upload/validation done
        }
    };

    const handleBranchSelection = (branch) => {
        setSelectedBranch(branch);
        // Clear branch error when user selects a branch
        if (errors.branch) {
            setErrors({ ...errors, branch: null });
        }
    };

    const handlePaymentMethodChange = (value) => {
        setPaymentMethod(value);
        // Clear payment method error when user selects one
        if (errors.paymentMethod) {
            setErrors({ ...errors, paymentMethod: null });
        }
    };

    const getButtonText = () => {
        if (orderStep === 1) return "Next";
        if (orderStep === 2) return paymentMethod === "QR" ? "Continue to Payment" : "Place Order";
        if (orderStep === 3) return "Place Order";
        return "Next";
    };

    const isFormValid = () => {
        if (orderStep === 1) {
            return customerInfo.name && customerInfo.phone && customerInfo.address && Object.keys(validateStep1()).length === 0;
        }
        if (orderStep === 2) {
            return selectedBranch && paymentMethod && Object.keys(validateStep2()).length === 0;
        }
        if (orderStep === 3) {
            return paymentMethod !== "QR" || qrUploaded;
        }
        return true;
    };

    return (
        <Modal show={orderModal} onHide={() => setOrderModal(false)} centered>
            <Modal.Header closeButton>
                <Modal.Title>Checkout - Step {orderStep} of 3</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {showError && Object.keys(errors).length > 0 && (
                    <Alert variant="danger" className="mb-3">
                        <strong>Please fix the following errors:</strong>
                        <ul className="mb-0 mt-2">
                            {Object.values(errors).filter(Boolean).map((error, index) => (
                                <li key={index}>{error}</li>
                            ))}
                        </ul>
                    </Alert>
                )}

                {orderStep === 1 && (
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Name <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                value={customerInfo.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                placeholder="Enter your full name"
                                isInvalid={!!errors.name}
                                maxLength="50"
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.name}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Phone <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="tel"
                                value={customerInfo.phone}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                placeholder="Enter your phone number"
                                isInvalid={!!errors.phone}
                                maxLength="20"
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.phone}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Delivery Address <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={customerInfo.address}
                                onChange={(e) => handleInputChange('address', e.target.value)}
                                placeholder="Enter your complete delivery address with landmarks"
                                isInvalid={!!errors.address}
                                maxLength="300"
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.address}
                            </Form.Control.Feedback>
                            <Form.Text className="text-muted">
                                Characters: {customerInfo.address.length}/300
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Special Instructions (Optional)</Form.Label>
                            <Form.Control
                                type="text"
                                value={customerInfo.note}
                                onChange={(e) => handleInputChange('note', e.target.value)}
                                placeholder="Any special instructions or notes?"
                                isInvalid={!!errors.note}
                                maxLength="200"
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.note}
                            </Form.Control.Feedback>
                            <Form.Text className="text-muted">
                                Characters: {customerInfo.note.length}/200
                            </Form.Text>
                        </Form.Group>
                    </Form>
                )}

                {orderStep === 2 && (
                    <>
                        <h6>Select Branch <span className="text-danger">*</span></h6>
                        {errors.branch && <div className="text-danger small mb-2">{errors.branch}</div>}
                        <div className="d-flex flex-column">
                            {branches && branches.length > 0 ? (
                                branches.map(branch => (
                                    <div
                                        key={branch.id}
                                        onClick={() => handleBranchSelection(branch)}
                                        style={{
                                            padding: "1rem",
                                            border: `2px solid ${errors.branch ? '#dc3545' : (selectedBranch?.id === branch.id ? '#0d6efd' : '#ccc')}`,
                                            borderRadius: "8px",
                                            cursor: "pointer",
                                            marginBottom: "0.5rem",
                                            display: "flex",
                                            flexDirection: "column",
                                            transition: "all 0.2s ease",
                                            position: "relative"
                                        }}
                                        onMouseEnter={(e) => {
                                            if (selectedBranch?.id !== branch.id) {
                                                e.target.style.backgroundColor = "#f8f9fa";
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (selectedBranch?.id !== branch.id) {
                                                e.target.style.backgroundColor = "white";
                                            }
                                        }}
                                    >
                                        <strong>{branch.name}</strong>
                                        <span className={selectedBranch?.id === branch.id ? "text-black" : "text-muted"} style={{ fontSize: "0.9em" }}>
                                            {branch.address}
                                        </span>
                                        {selectedBranch?.id === branch.id && (
                                            <div style={{ position: "absolute", top: "0.5rem", right: "0.5rem", fontSize: "1.2em" }}>
                                                ✓
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="text-muted text-center p-3">
                                    No branches available
                                </div>
                            )}
                        </div>

                        <Form.Group className="mt-3">
                            <Form.Label>Payment Method <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={paymentMethod}
                                onChange={(e) => handlePaymentMethodChange(e.target.value)}
                                isInvalid={!!errors.paymentMethod}
                            >
                                <option value="">Select payment method</option>
                                <option value="QR">QR Payment</option>
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                {errors.paymentMethod}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </>
                )}

                {orderStep === 3 && paymentMethod === "QR" && (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
                        <h6>Upload Payment Screenshot <span className="text-danger">*</span></h6>
                        {errors.qrUpload && <div className="text-danger small">{errors.qrUpload}</div>}

                        <div style={{ border: "2px dashed #ccc", padding: "1rem", borderRadius: "8px", textAlign: "center" }}>
                            <Image
                                src="/qr/qr.jpg"
                                alt="QR Code"
                                width={250}
                                height={250}
                                style={{ marginBottom: "1rem" }}
                            />
                            <div className="text-muted small">
                                Scan this QR code to make payment, then upload screenshot
                            </div>
                        </div>

                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: "none" }}
                            onChange={handleFileUploadWithValidation}
                            accept="image/*"
                        />

                        <Button
                            variant={qrUploaded ? "success" : "outline-primary"}
                            onClick={() => fileInputRef.current && fileInputRef.current.click()}
                            size="lg"
                        >
                            {qrUploaded ? "✓ Screenshot Uploaded" : " Upload Payment Screenshot"}
                        </Button>

                        <div className="text-muted small text-center">
                            Supported formats: JPEG, PNG, JPG<br />
                            Maximum file size: 10MB
                        </div>

                        {qrUploaded && (
                            <Alert variant="success" className="text-center">
                                <strong>Payment screenshot uploaded successfully!</strong><br />
                                You can now place your order.
                            </Alert>
                        )}
                    </div>
                )}

            </Modal.Body>
            <Modal.Footer className="d-flex justify-content-between">
                <Button
                    variant="outline-secondary"
                    onClick={() => {
                        if (orderStep === 1) {
                            setOrderModal(false);
                            setErrors({});
                        } else {
                            setOrderStep(orderStep - 1);
                            setErrors({});
                        }
                    }}
                >
                    {orderStep === 1 ? "Cancel" : "← Back"}
                </Button>

                <Button
                    variant="primary"
                    onClick={handleValidatedNextStep}
                    disabled={!isFormValid() && showError}
                >
                    {getButtonText()}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}