"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./MovieList.module.css";

// Define types
type Show = {
  id: string;
  poster_path: string;
  original_title: string;
  release_date: string;
  vote_average: number;
  overview: string;
};

type Genre = {
  id: number;
  name: string;
};

// Card Component
const Card = ({ show, onClick }: { show: Show; onClick: () => void }) => {
  const [imgError, setImgError] = useState(false);
  
  const handleImageError = () => {
    setImgError(true);
  };

  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.card__img}>
        {!imgError && show.poster_path ? (
          <img
            src={show.poster_path}
            alt={show.original_title}
            onError={handleImageError}
          />
        ) : (
          <div className={styles.image_placeholder}>
            <span>No Image</span>
          </div>
        )}
      </div>
      <div className={styles.card__overlay}>
        <div className={styles.card__title}>{show.original_title}</div>
        <div className={styles.card__runtime}>
          {show.release_date}
          <span className={styles.card__rating}>
            {show.vote_average.toFixed(1)}
            <i className="fas fa-star" />
          </span>
        </div>
        <div className={styles.card__description}>
          {show.overview.slice(0, 118) + "..."}
        </div>
      </div>
    </div>
  );
};

// Main Component
const MovieList = () => {
  const [showList, setShowList] = useState<Show[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch genres on first load
  useEffect(() => {
    fetchGenres();
  }, []);

  // Fetch shows on first load
  useEffect(() => {
    getData();
  }, []);

  // Fix image URL to use HTTPS if needed
  const fixImageUrl = (url: string | null | undefined): string => {
    if (!url) return "";
    
    // Replace HTTP with HTTPS to avoid mixed content issues
    return url.replace(/^http:\/\//i, 'https://');
  };

  // Fetch unique genres from TVmaze shows
  const fetchGenres = async () => {
    try {
      const res = await fetch("https://api.tvmaze.com/shows?page=1");
      const shows = await res.json();

      const uniqueGenres = [...new Set(shows.flatMap((show: any) => show.genres))] as string[];
      setGenres(uniqueGenres.map((g, i) => ({ id: i, name: g })));
    } catch (error) {
      console.error("Error fetching genres:", error);
    }
  };

  // Fetch and map shows, optionally filter by genre
  const getData = async (genreName?: string) => {
    setLoading(true);
    try {
      const res = await fetch("https://api.tvmaze.com/shows?page=1");
      const shows = await res.json();

      let filtered = shows;
      if (genreName) {
        filtered = shows.filter((show: any) => show.genres.includes(genreName));
      }

      const mapped = filtered.map((show: any) => ({
        id: show.id.toString(),
        poster_path: fixImageUrl(show.image?.medium),
        original_title: show.name,
        release_date: show.premiered || "N/A",
        vote_average: show.rating?.average || 0,
        overview: show.summary?.replace(/<[^>]+>/g, "") || "No description available",
      }));

      setShowList(mapped);
    } catch (error) {
      console.error("Error fetching shows:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle show click - navigate to details page
  const handleShowClick = (showId: string) => {
    router.push(`/movie/${showId}`);
  };

  // Handle genre change
  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const genreName = e.target.value;
    if (genreName) {
      getData(genreName);
    } else {
      getData(); // reset if no genre selected
    }
  };

  return (
    <div className={styles.movie}>
      <div className={styles.movie__list}>
        <div className={styles.filter}>
          <h2 className={styles.list__title}>TV SHOWS</h2>

          {/* Genre dropdown */}
          <select className={styles.genreDropdown} onChange={handleGenreChange}>
            <option value="">Select Genre</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.name}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className={styles.loading}>Loading shows...</div>
        ) : (
          <div className={styles.list__cards}>
            {showList.map((show) => (
              <Card 
                key={show.id} 
                show={show} 
                onClick={() => handleShowClick(show.id)} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieList;