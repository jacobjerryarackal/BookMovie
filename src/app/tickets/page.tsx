// app/tickets/page.tsx
"use client"
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
import toast, { Toaster } from "react-hot-toast";
import useRazorpay from "../hooks/useRazorpay";

interface TheaterShow {
  show: {
    id: string;
    name: string;
    premiered: string;
    genres: string[];
    runtime: number;
    image: {
      medium: string;
      original: string;
    } | null;
    summary: string;
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

declare global {
  interface Window {
    Razorpay: any;
  }
}

const TicketBooking: React.FC = () => {
  const searchParams = useSearchParams();
  const tvmazeId = searchParams.get("tvmazeId");
  const [theaterShows, setTheaterShows] = useState<TheaterShow[]>([]);
  const [selectedTheater, setSelectedTheater] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDetails, setShowDetails] = useState<TheaterShow["show"] | null>(null);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const isRazorpayLoaded = useRazorpay();
  const [isPaymentDone, setIsPaymentDone] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleHide = () => setShowModal(false);

  const handlePayment = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/payment/order", {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          amount: totalPrice * 100 
        })
      });

      const data = await res.json();
      console.log(data);
      handlePaymentVerify(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePaymentVerify = async (data: any) => {
    if (!isRazorpayLoaded) {
      console.error("Razorpay script not loaded");
      return;
    }
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: data.amount,
      currency: data.currency,
      name: "BookShow",
      description: "TV Show Booking",
      order_id: data.id,
      handler: async (response: any) => {
        console.log("response", response);
        try {
          const res = await fetch("http://localhost:8000/api/payment/verify", {
            method: 'POST',
            headers: {
              'content-type': 'application/json'
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            })
          });

          const verifyData = await res.json();

          if (verifyData.message) {
            toast.success(verifyData.message);
            setIsPaymentDone(true);
          }
        } catch (error) {
          console.error("Payment verification error:", error);
          toast.error("Error verifying payment");
        }
      },
      theme: {
        color: "#5f63b8"
      }
    };
    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  useEffect(() => {
    const fetchTheaterShows = async () => {
      if (!tvmazeId) {
        return;
      }
      try {
        // Mock data since TVmaze doesn't provide theater information
        // In a real app, you would fetch this from your backend
        const mockTheaterShows: TheaterShow[] = [
          {
            show: {
              id: tvmazeId,
              name: "TV Show",
              premiered: "2023-01-01",
              genres: ["Drama", "Comedy"],
              runtime: 60,
              image: null,
              summary: "A great TV show"
            },
            theater: {
              id: "1",
              name: "Cineplex Downtown",
              location: "123 Main St"
            },
            showtime: "18:30"
          },
          {
            show: {
              id: tvmazeId,
              name: "TV Show",
              premiered: "2023-01-01",
              genres: ["Drama", "Comedy"],
              runtime: 60,
              image: null,
              summary: "A great TV show"
            },
            theater: {
              id: "2",
              name: "AMC Theater",
              location: "456 Oak Ave"
            },
            showtime: "20:00"
          },
          {
            show: {
              id: tvmazeId,
              name: "TV Show",
              premiered: "2023-01-01",
              genres: ["Drama", "Comedy"],
              runtime: 60,
              image: null,
              summary: "A great TV show"
            },
            theater: {
              id: "3",
              name: "Regal Cinemas",
              location: "789 Pine Blvd"
            },
            showtime: "21:30"
          }
        ];
        
        setTheaterShows(mockTheaterShows);
      } catch (error) {
        console.error("Error fetching theater shows:", error);
        setTheaterShows([]);
      }
    };

    fetchTheaterShows();
  }, [tvmazeId]);

  useEffect(() => {
    const fetchShowDetails = async () => {
      if (!tvmazeId) {
        return;
      }
      try {
        const response = await axios.get(
          `https://api.tvmaze.com/shows/${tvmazeId}`
        );
        const showData = response.data;
        setShowDetails({
          id: showData.id,
          name: showData.name,
          premiered: showData.premiered,
          genres: showData.genres,
          runtime: showData.runtime || 60,
          image: showData.image,
          summary: showData.summary || "No summary available"
        });
      } catch (error) {
        console.error("Error fetching show details from TVmaze:", error);
        setShowDetails(null);
      }
    };

    fetchShowDetails();
  }, [tvmazeId]);

  useEffect(() => {
    const theaterTimes = theaterShows
      .filter((ts) => ts.theater.id === selectedTheater)
      .map((ts) => ts.showtime);
    setAvailableTimes(theaterTimes);
  }, [selectedTheater, theaterShows]);

  const handleBooking = async () => {
    const selectedTheaterData = theaterShows.find(
      (ts) => ts.theater.id === selectedTheater
    )?.theater;
    
    if (
      !selectedTheaterData ||
      !tvmazeId ||
      !showDetails?.name ||
      !selectedDate ||
      !selectedTime
    ) {
      alert("Please select a valid show, theater, date, and time.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/ticket/createticket",
        {
          theatername: selectedTheaterData.name,
          price: totalPrice,
          date: selectedDate.toISOString().split("T")[0],
          time: selectedTime,
          show: showDetails.name,
          seats: selectedSeats.length,
          showId: tvmazeId,
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
        <div className={styles.show_info}>
          {showDetails && (
            <>
              <h2 className={styles.h2}>{showDetails.name}</h2>
              <p className={styles.p}>
                Premiered: {showDetails.premiered}
              </p>
              <p className={styles.p}>Genre: {showDetails.genres.join(", ")}</p>
              <p className={styles.p}>Runtime: {showDetails.runtime} minutes</p>
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
            {theaterShows.map((ts) => (
              <option key={ts.theater.id} value={ts.theater.id}>
                {ts.theater.name} - {ts.theater.location}
              </option>
            ))}
          </select>
        </div>
        
        {selectedTheater && (
          <>
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
                  minDate={new Date()}
                  dateFormat="yyyy-MM-dd"
                  className={styles.date_picker}
                />
                <FaCalendarAlt className={styles.calendar_icon} />
              </div>
            </div>
          </>
        )}
        
        {selectedTime && selectedDate && (
          <>
            <div className={styles.form_group}>
              <Button variant="primary" onClick={handleShow}>
                Select Seats
              </Button>
            </div>
            
            {selectedSeats.length > 0 && (
              <>
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
                
                <div className={styles.button_group}>
                  <Button
                    variant="dark"
                    onClick={handlePayment}
                    disabled={selectedSeats.length === 0}
                    className={styles.payment_button}
                  >
                    Proceed to Payment
                  </Button>
                  
                  <Button
                    variant="success"
                    onClick={handleBooking}
                    disabled={!isPaymentDone}
                    className={styles.booking_button}
                  >
                    Confirm Booking
                  </Button>
                </div>
              </>
            )}
          </>
        )}
        
        <Toaster />
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