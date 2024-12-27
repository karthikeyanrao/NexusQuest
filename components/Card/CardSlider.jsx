"use client";
import { useState, useRef, useEffect } from "react";
import MovieCard from "./Card";

const moviesData = [
  { name: "Flappy", info: "All sports information...", image: "/images/flappy.png" },
  { name: "All", info: "All sports information...", image: "/images/live.png" },
  { name: "Cricket", info: "Cricket information...", image: "/images/cricketf.png" },
  { name: "Football", info: "Football information...", image: "/images/footballl.png" },
  { name: "Esports", info: "Esports information...", image: "/images/esports.png" },
  { name: "Basketball", info: "Basketball information...", image: "/images/basketball.jpeg" },
  // Add more sports as needed
];

const Slider = () => {
  const [selectedSport, setSelectedSport] = useState(null);
  const [sortedData, setSortedData] = useState(moviesData);
  const [currentSlide, setCurrentSlide] = useState(0); // Track the current slide
  const sliderRef = useRef(null);

  const handleSportChange = (sport) => {
    setSelectedSport(sport);

    if (sport === "All") {
      setSortedData(moviesData);
    } else {
      const filteredData = moviesData.filter((item) => item.name === sport);
      setSortedData(filteredData);
    }
  };

  // Automatically move slides every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const nextSlide = (currentSlide + 1) % sortedData.length; // Loop back to the first slide
      setCurrentSlide(nextSlide);
      sliderRef.current.scrollTo({
        left: nextSlide * sliderRef.current.clientWidth,
        behavior: "smooth",
      });
    }, 5000);

    return () => clearInterval(interval); // Clean up on component unmount
  }, [currentSlide, sortedData]);

  // Update slide when user scrolls
  useEffect(() => {
    const slider = sliderRef.current;

    const handleScroll = () => {
      const slideWidth = slider.clientWidth;
      const newSlide = Math.round(slider.scrollLeft / slideWidth);
      setCurrentSlide(newSlide);
    };

    slider.addEventListener("scroll", handleScroll);

    return () => {
      slider.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div>
      <div className="carousel w-[300px] sm:w-full" ref={sliderRef}>
        {sortedData.map((item, index) => (
          <div
            key={item.name}
            className={`carousel-item w-full ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <MovieCard
              imageUrl={item.image}
              title={item.name}
              description={item.info}
              buttonText="Watch Now"
              style={{
                width: "100%",
                boxSizing: "border-box",
              }}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-center w-full py-2 gap-2">
        {sortedData.map((item, index) => (
          <a
            key={item.name}
            href={`#item${index}`}
            className={`btn btn-xs ${
              index === currentSlide ? "btn-accent" : "btn-neutral"
            }`}
            onClick={() =>
              sliderRef.current.scrollTo({
                left: index * sliderRef.current.clientWidth,
                behavior: "smooth",
              })
            }
          >
            {index + 1}
          </a>
        ))}
      </div>
    </div>
  );
};

export default Slider;
