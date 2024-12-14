"use client"
import { useState, useRef, useEffect } from 'react';
import MovieCard from './Card';

const moviesData = [
  
  { name: 'Flappy', info: 'All sports information...', image: '/images/flappy.png' },
  { name: 'All', info: 'All sports information...', image: '/images/live.png' },
  { name: 'Cricket', info: 'Cricket information...', image: '/images/cricketf.png' },
  { name: 'Football', info: 'Football information...', image: '/images/footballl.png' },
  { name: 'Esports', info: 'esports information...', image: '/images/esports.png' },
  { name: 'Basketball', info: 'Basketball information...', image: '/images/basketballl.png' },
  // Add more sports as needed
];

const Slider = () => {
  const [selectedSport, setSelectedSport] = useState(null);
  const [sortedData, setSortedData] = useState(moviesData);
  const [currentSlide, setCurrentSlide] = useState(0); // Track the current slide
  const sliderRef = useRef(null);

  const handleSportChange = (sport) => {
    setSelectedSport(sport);

    // Implement your sorting logic here based on the selected sport
    // If "All" is selected, show all movie data
    if (sport === 'All') {
      setSortedData(moviesData);
    } else {
      // Otherwise, filter data based on the selected sport
      const filteredData = moviesData.filter((item) => item.name === sport);
      setSortedData(filteredData);
    }
  };

  useEffect(() => {
    const slider = sliderRef.current;

    const handleScroll = () => {
      // Calculate the current slide based on scroll position
      const slideWidth = slider.clientWidth;
      const newSlide = Math.round(slider.scrollLeft / slideWidth);
      setCurrentSlide(newSlide);
    };

    slider.addEventListener('scroll', handleScroll);

    return () => {
      slider.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div>
      <div className="carousel w-[300px] sm:w-full" ref={sliderRef}>
        {sortedData.map((item, index) => (
          <div key={item.name} className={`carousel-item w-full ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
            <MovieCard
              imageUrl={item.image}
              title={item.name}
              description={item.info}
              buttonText="Watch Now"
              style={{
                width: '100%',
                boxSizing: 'border-box',
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
            className={`btn btn-xs ${index === currentSlide ? 'btn-accent' : 'btn-neutral'}`}
            onClick={() => sliderRef.current.scrollTo({ left: index * sliderRef.current.clientWidth, behavior: 'smooth' })}
          >
            {index + 1}
          </a>
        ))}
      </div>
    </div>
  );
};

export default Slider;
