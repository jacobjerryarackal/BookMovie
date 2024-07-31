import { useState, useEffect } from 'react';
import axios from 'axios';

export interface Movie {
    _id: string;
    title: string;
    date: string;
    genre: string;
    time: string;
  }
  
  interface Seat {
    row: string;
    number: number;
    isBooked: boolean;
  }
  
  interface Theater {
    _id: string;
    name: string;
    location: string;
    capacity: number;
    showtime: string;
    movie: string;
    time: string;
    seats: Seat[];
  }

export const useFetchData = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const moviesResponse = await axios.get('http://localhost:8000/api/movies/getmovie');
        const theatersResponse = await axios.get('http://localhost:8000/api/theater/gettheater');
        setMovies(moviesResponse.data);
        setTheaters(theatersResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return { movies, theaters, loading };
};
