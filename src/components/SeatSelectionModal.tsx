

import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./SeatSelectionModal.module.css";

const SEAT_PRICE = 100;

interface Seat {
  id: string;
  name: string;
  selected: boolean;
}

interface SeatSelectionModalProps {
  show: boolean;
  onHide: () => void;
  onConfirm: (selectedSeats: Seat[], totalPrice: number) => void;
}

const generateSeats = (rows: number, seatsPerRow: number): Seat[] => {
  const seats: Seat[] = [];
  const rowLabels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  for (let row = 0; row < rows; row++) {
    for (let seat = 1; seat <= seatsPerRow; seat++) {
      seats.push({
        id: `${rowLabels[row]}-${seat}`,
        name: `Seat ${rowLabels[row]}${seat}`,
        selected: false,
      });
    }
  }
  return seats;
};

const SeatSelectionModal: React.FC<SeatSelectionModalProps> = ({ show, onHide, onConfirm }) => {
  const [seats, setSeats] = useState<Seat[]>(generateSeats(10, 10));
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  const toggleSeatSelection = (id: string) => {
    setSeats((prevSeats) =>
      prevSeats.map((seat) =>
        seat.id === id ? { ...seat, selected: !seat.selected } : seat
      )
    );
  };

  useEffect(() => {
    const newSelectedSeats = seats.filter((seat) => seat.selected);
    setSelectedSeats(newSelectedSeats);
    setTotalPrice(newSelectedSeats.reduce((total, seat) => total + SEAT_PRICE, 0));
  }, [seats]);

  const handleConfirm = () => {
    onConfirm(selectedSeats, totalPrice);
    onHide();
  };

  const handleReset = () => {
    setSeats((prevSeats) =>
      prevSeats.map((seat) => ({ ...seat, selected: false }))
    );
    setSelectedSeats([]);
    setTotalPrice(0);
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Select Your Seats</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className={styles.seat_grid}>
          {seats.map((seat, index) => (
            <React.Fragment key={seat.id}>
              {index % 10 === 0 && index > 0 && index % 50 === 0 && (
                <div className={styles.gap}></div>
              )}
              <Button
                variant={seat.selected ? "success" : "outline-secondary"}
                onClick={() => toggleSeatSelection(seat.id)}
                className={styles.seat_button}
              >
                {seat.name}
              </Button>
            </React.Fragment>
          ))}
        </div>
        <div className="mt-3">
          <strong>Selected Seats:</strong>
          <ul>
            {selectedSeats.map((seat) => (
              <li key={seat.id}>{seat.name}</li>
            ))}
          </ul>
          <strong>Total Price: </strong>₹{totalPrice}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleReset}>
          Reset
        </Button>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={handleConfirm}>
          Confirm Selection
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SeatSelectionModal;
