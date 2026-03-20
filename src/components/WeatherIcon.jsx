import React from 'react';
export function WeatherIcon({ icon, description, size = 'md' }) {
  const sizes = { sm: 'w-10 h-10', md: 'w-16 h-16', lg: 'w-24 h-24' };
  const imgSizes = { sm: 40, md: 64, lg: 96 };

  return (
    <img
      src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
      alt={description}
      width={imgSizes[size]}
      height={imgSizes[size]}
      className={`${sizes[size]} object-contain drop-shadow`}
    />
  );
}
