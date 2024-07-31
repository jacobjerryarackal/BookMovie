import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

interface TheaterModalProps {
  show: boolean;
  handleClose: () => void;
  handleSave: (theater: Theater) => void;
  initialData?: Theater | null;
}

interface Theater {
  _id?: string;
  name: string;
  location: string;
  capacity: number;
}

const TheaterModal: React.FC<TheaterModalProps> = ({ show, handleClose, handleSave, initialData }) => {
  const [theater, setTheater] = useState<Theater>({
    name: "",
    location: "",
    capacity: 0,
  });

  useEffect(() => {
    if (initialData) {
      setTheater(initialData);
    } else {
      setTheater({
        name: "",
        location: "",
        capacity: 0,
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTheater({ ...theater, [name]: value });
  };

  const handleSubmit = () => {
    handleSave(theater);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{initialData ? "Edit Theater" : "Add Theater"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter theater name"
              name="name"
              value={theater.name}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formLocation">
            <Form.Label>Location</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter location"
              name="location"
              value={theater.location}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formCapacity">
            <Form.Label>Capacity</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter capacity"
              name="capacity"
              value={theater.capacity}
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

export default TheaterModal;
