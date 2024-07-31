"use client"
import CaroselBanner from "@/components/CaroselBanner";
import MovieList from "./movie/list/[type]/page";

export default function Home() {
  return (
   <div>
    <CaroselBanner />
    <MovieList />
   </div>
  );
}
