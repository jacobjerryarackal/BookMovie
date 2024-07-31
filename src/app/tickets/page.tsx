"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa";
import styles from "./TicketBooking.module.css";
import { Button } from "react-bootstrap";
import SeatSelectionModal from "@/components/SeatSelectionModal";
import Link from "next/link";

interface TheaterMovie {
  movie: {
    id: string;
    title: string;
    releaseDate: string;
    genre: string;
    duration: string;
  };
  theater: {
    id: string;
    name: string;
    location: string;
  };
  showtime: string;
}

interface Seat {
  id: string;
  name: string;
  selected: boolean;
}

const TMDB_API_KEY = "fc575ea163f0128176ca77150fd7c76b";

const TicketBooking: React.FC = () => {
  const searchParams = useSearchParams();
  const tmdbId = searchParams.get("tmdbId");
  const [theaterMovies, setTheaterMovies] = useState<TheaterMovie[]>([]);
  const [selectedTheater, setSelectedTheater] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [seats, setSeats] = useState<number>(1);
  const [movieDetails, setMovieDetails] = useState<
    TheaterMovie["movie"] | null
  >(null);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);

  // New state variables for selected seats and total price
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  const handleShow = () => setShowModal(true);
  const handleHide = () => setShowModal(false);

  useEffect(() => {
    const fetchTheaterMovies = async () => {
      if (!tmdbId) {
        return;
      }
      try {
        const response = await axios.get(
          `http://localhost:8000/api/theatermovies/gettheatermovies/${tmdbId}`
        );
        setTheaterMovies(response.data);
      } catch (error) {
        console.error("Error fetching theater movies:", error);
        setTheaterMovies([]);
      }
    };

    fetchTheaterMovies();
  }, [tmdbId]);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!tmdbId) {
        return;
      }
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${TMDB_API_KEY}`
        );
        setMovieDetails({
          id: response.data.id,
          title: response.data.title,
          releaseDate: response.data.release_date,
          genre: response.data.genres.map((g: any) => g.name).join(", "),
          duration: response.data.runtime
            ? `${response.data.runtime} minutes`
            : "Unknown",
        });
      } catch (error) {
        console.error("Error fetching movie details from TMDB:", error);
        setMovieDetails(null);
      }
    };

    fetchMovieDetails();
  }, [tmdbId]);

  useEffect(() => {
    const theaterTimes = theaterMovies
      .filter((tm) => tm.theater.id === selectedTheater)
      .map((tm) => tm.showtime);
    setAvailableTimes(theaterTimes);
  }, [selectedTheater, theaterMovies]);

  const handleBooking = async () => {
    const selectedTheaterData = theaterMovies.find(
      (tm) => tm.theater.id === selectedTheater
    )?.theater;
    if (
      !selectedTheaterData ||
      !tmdbId ||
      !movieDetails?.title ||
      !selectedDate ||
      !selectedTime
    ) {
      alert("Please select a valid movie, theater, date, and time.");
      return;
    }

    try {
      const totalAmount = totalPrice;

      const response = await axios.post(
        "http://localhost:8000/api/ticket/createticket",
        {
          theatername: selectedTheaterData.name,
          price: totalAmount,
          date: selectedDate.toISOString().split("T")[0],
          time: selectedTime,
          movie: movieDetails.title,
          seats: selectedSeats.length,
          movieId: tmdbId,
          theaterId: selectedTheaterData.id,
          seatnames: selectedSeats.map((seat) => seat.name),
        }
      );

      const createdTicket = response.data;
      alert("Booking successful!");
      window.location.href = `/confirmation?ticketId=${createdTicket._id}`;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error booking ticket:",
          error.response?.data || error.message
        );
      } else {
        console.error("Unexpected error booking ticket:", error);
      }
      alert("Error booking ticket. Please try again.");
    }
  };

  const handleSeatSelectionConfirm = (
    selectedSeats: Seat[],
    totalPrice: number
  ) => {
    setSelectedSeats(selectedSeats);
    setTotalPrice(totalPrice);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.h1}>Book Your Tickets</h1>
      <div className={styles.booking_form}>
        <div className={styles.movie_info}>
          {movieDetails && (
            <>
              <h2 className={styles.h2}>{movieDetails.title}</h2>
              <p className={styles.p}>
                Release Date: {movieDetails.releaseDate}
              </p>
              <p className={styles.p}>Genre: {movieDetails.genre}</p>
              <p className={styles.p}>Duration: {movieDetails.duration}</p>
            </>
          )}
        </div>
        <div className={styles.form_group}>
          <label htmlFor="theaterSelect">Select Theater:</label>
          <select
            id="theaterSelect"
            value={selectedTheater}
            onChange={(e) => setSelectedTheater(e.target.value)}
          >
            <option value="">Select a theater</option>
            {theaterMovies.map((tm) => (
              <option key={tm.theater.id} value={tm.theater.id}>
                {tm.theater.name}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.form_group}>
          <label htmlFor="timeSelect">Select Time:</label>
          <select
            id="timeSelect"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
          >
            <option value="">Select a time</option>
            {availableTimes.map((time, index) => (
              <option key={index} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.form_group}>
          <label htmlFor="datePicker">Select Date:</label>
          <div className={styles.date_picker_wrapper}>
            <DatePicker
              id="datePicker"
              selected={selectedDate}
              onChange={(date: Date | null) => setSelectedDate(date)}
              dateFormat="yyyy-MM-dd"
              className={styles.date_picker}
            />
            <FaCalendarAlt className={styles.calendar_icon} />
          </div>
        </div>
        <div className={styles.form_group}>
          <Button variant="primary" onClick={handleShow}>
            Select Seats
          </Button>
        </div>
        <div className={styles.selected_seats}>
          <strong>Selected Seats:</strong> {selectedSeats.length}
        </div>
        <div className={styles.selected_seats}>
          <strong>Selected Seats Names:</strong>{" "}
          {selectedSeats.map((seat) => seat.name).join(", ")}
        </div>
        <div className={styles.form_group}>
          <strong>Total Price: </strong>₹{totalPrice}
        </div>
        <Button
          variant="dark"
          disabled={
            !selectedTheater ||
            !selectedDate ||
            !selectedTime ||
            selectedSeats.length === 0
          }
        >
          <Link
            href="https://buy.stripe.com/test_bIYdUoaAU1vdb4IeUX"
            className="text-decoration-none text-white"
          >
            Proceed to Payment
          </Link>
        </Button>
        <Button
          variant="success"
          onClick={handleBooking}
          disabled={
            !selectedTheater ||
            !selectedDate ||
            !selectedTime ||
            selectedSeats.length === 0
          }
        >
          Book Ticket
        </Button>
      </div>

      <SeatSelectionModal
        show={showModal}
        onHide={handleHide}
        onConfirm={handleSeatSelectionConfirm}
      />
    </div>
  );
};

export default TicketBooking;
