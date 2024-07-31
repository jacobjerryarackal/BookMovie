import React, { useState, useEffect } from "react";
import styles from "./TheaterMovieModal.module.css";

export interface TheaterMovie {
  _id: string;
  movieId: string;
  theaterId: string;
  showtime: string;
}

interface TheaterMovieModalProps {
  show: boolean;
  handleClose: () => void;
  handleSave: (theaterMovie: Partial<TheaterMovie>) => Promise<void>;
  initialData?: Partial<TheaterMovie>;
}

const TheaterMovieModal: React.FC<TheaterMovieModalProps> = ({
  show,
  handleClose,
  handleSave,
  initialData,
}) => {
  const [theaterMovie, setTheaterMovie] = useState<Partial<TheaterMovie>>(
    initialData || {}
  );

  useEffect(() => {
    setTheaterMovie(initialData || {});
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTheaterMovie((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSave(theaterMovie);
  };

  if (!show) {
    return null;
  }

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <span className={styles.close} onClick={handleClose}>
          &times;
        </span>
        <h2 className={styles.h2}>Theater Movie</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label}>
            Movie ID:
            <input
              className={styles.input}
              type="text"
              name="movieId"
              value={theaterMovie.movieId || ""}
              onChange={handleChange}
              required
            />
          </label>
          <label className={styles.label}>
            Theater ID:
            <input
              className={styles.input}
              type="text"
              name="theaterId"
              value={theaterMovie.theaterId || ""}
              onChange={handleChange}
              required
            />
          </label>
          <label className={styles.label}>
            Showtime:
            <input
              className={styles.input}
              type="text"
              name="showtime"
              value={theaterMovie.showtime || ""}
              onChange={handleChange}
              required
            />
          </label>
          <button className={styles.button} type="submit">
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default TheaterMovieModal;
