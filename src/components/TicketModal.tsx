import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

interface TicketModalProps {
  show: boolean;
  handleClose: () => void;
  handleSave: (ticket: Ticket) => void;
  initialData?: Ticket | null;
}

interface Ticket {
  _id?: string;
  theatername: string;
  price: number;
  date: string;
  time: string;
  movie: string;
  seats: number;
  seatnames: string[];
  movieId: string;
  theaterId: string;
}

const TicketModal: React.FC<TicketModalProps> = ({ show, handleClose, handleSave, initialData }) => {
  const [ticket, setTicket] = useState<Ticket>({
    theatername: "",
    price: 0,
    date: "",
    time: "",
    movie: "",
    seats: 0,
    seatnames: [],
    movieId: "",
    theaterId: "",
  });

  useEffect(() => {
    if (initialData) {
      setTicket(initialData);
    } else {
      setTicket({
        theatername: "",
        price: 0,
        date: "",
        time: "",
        movie: "",
        seats: 0,
        seatnames: [],
        movieId: "",
        theaterId: "",
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTicket({ ...ticket, [name]: value });
  };

  const handleSeatNamesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setTicket({ ...ticket, seatnames: value.split(",") });
  };

  const handleSubmit = () => {
    handleSave(ticket);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{initialData ? "Edit Ticket" : "Add Ticket"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formTheatername">
            <Form.Label>Theater Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter theater name"
              name="theatername"
              value={ticket.theatername}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formPrice">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter price"
              name="price"
              value={ticket.price}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formDate">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter date"
              name="date"
              value={ticket.date}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formTime">
            <Form.Label>Time</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter time"
              name="time"
              value={ticket.time}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formMovie">
            <Form.Label>Movie</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter movie"
              name="movie"
              value={ticket.movie}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formSeats">
            <Form.Label>Seats</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter number of seats"
              name="seats"
              value={ticket.seats}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formSeatNames">
            <Form.Label>Seat Names</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter seat names, separated by commas"
              name="seatnames"
              value={ticket.seatnames.join(",")}
              onChange={handleSeatNamesChange}
            />
          </Form.Group>
          <Form.Group controlId="formMovieId">
            <Form.Label>Movie ID</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter movie ID"
              name="movieId"
              value={ticket.movieId}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formTheaterId">
            <Form.Label>Theater ID</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter theater ID"
              name="theaterId"
              value={ticket.theaterId}
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

export default TicketModal;
