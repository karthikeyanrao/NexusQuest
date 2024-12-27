import React from 'react';

const SportCard = ({ imageUrl, title,  style }) => {
  return (
    <div className="w-full  sm:w-[300px] sm:h-[300px] border-solid border-2 border-gray-200 bg-base-200 rounded-lg shadow-xl relative" style={style}>
        <img
          src={imageUrl}
          className="w-full h-full rounded-lg object-cover"
          alt={title}

     />

    </div>
  );
};

export default SportCard