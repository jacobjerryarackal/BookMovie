import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

interface AdminModalProps {
  show: boolean;
  handleClose: () => void;
  handleSave: (admin: Admin) => void;
  initialData?: Admin | null;
}

interface Admin {
  _id?: string;
  email: string;
  password: string;
}

const AdminModal: React.FC<AdminModalProps> = ({ show, handleClose, handleSave, initialData }) => {
  const [admin, setAdmin] = useState<Admin>({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (initialData) {
      setAdmin(initialData);
    } else {
      setAdmin({
        email: "",
        password: "",
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAdmin({ ...admin, [name]: value });
  };

  const handleSubmit = () => {
    handleSave(admin);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{initialData ? "Edit Admin" : "Add Admin"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              name="email"
              value={admin.email}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              name="password"
              value={admin.password}
              onChange={handleChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AdminModal;
