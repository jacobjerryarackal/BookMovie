import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

interface Movie {
  _id?: string;
  title: string;
  genre: string;
  releasedate: string;
  duration: string;
}

interface MovieModalProps {
  show: boolean;
  handleClose: () => void;
  handleSave: (movie: Movie) => void;
  initialData: Movie | null;
}

export default function MovieModal({ show, handleClose, handleSave, initialData }: MovieModalProps) {
  const [movie, setMovie] = useState<Movie>({
    title: '',
    genre: '',
    releasedate: '',
    duration: ''
  });

  useEffect(() => {
    if (initialData) {
      setMovie(initialData);
    } else {
      setMovie({
        title: '',
        genre: '',
        releasedate: '',
        duration: ''
      });
    }
  }, [initialData]);

  const handleSubmit = () => {
    handleSave(movie);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{initialData ? 'Edit Movie' : 'Add Movie'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formMovieTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={movie.title}
              onChange={(e) => setMovie({ ...movie, title: e.target.value })}
            />
          </Form.Group>
          <Form.Group controlId="formMovieGenre">
            <Form.Label>Genre</Form.Label>
            <Form.Control
              type="text"
              value={movie.genre}
              onChange={(e) => setMovie({ ...movie, genre: e.target.value })}
            />
          </Form.Group>
          <Form.Group controlId="formMovieReleaseDate">
            <Form.Label>Release Date</Form.Label>
            <Form.Control
              type="date"
              value={movie.releasedate}
              onChange={(e) => setMovie({ ...movie, releasedate: e.target.value })}
            />
          </Form.Group>
          <Form.Group controlId="formMovieDuration">
            <Form.Label>Duration</Form.Label>
            <Form.Control
              type="text"
              value={movie.duration}
              onChange={(e) => setMovie({ ...movie, duration: e.target.value })}
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
}
