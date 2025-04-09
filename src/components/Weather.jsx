import React, { useEffect, useRef, useState } from 'react';
import './Weather.css';

import searchImg from '../assets/search.png';
import iconSunny from '../assets/clear.png';
import iconCloudy from '../assets/cloud.png';
import iconDrizzle from '../assets/drizzle.png';
import iconHumidity from '../assets/humidity.png';
import iconRainy from '../assets/rain.png';
import iconSnowy from '../assets/snow.png';
import iconWindy from '../assets/wind.png';

import bgSunny from '../assets/bg/sunny.jpg';
import bgCloudy from '../assets/bg/clody.jpg';
import bgRainy from '../assets/bg/rainy.jpg';
import bgSnowy from '../assets/bg/snowy.jpeg';

export default function AnshWeather() {
  const [shuklaData, setShuklaData] = useState(null);
  const [bgImage, setBgImage] = useState(bgSunny);
  const [locationList, setLocationList] = useState([]);
  const anshInput = useRef();

  const iconMap = {
    '01d': iconSunny,
    '01n': iconSunny,
    '02d': iconCloudy,
    '02n': iconCloudy,
    '03d': iconCloudy,
    '03n': iconCloudy,
    '04d': iconDrizzle,
    '04n': iconDrizzle,
    '09d': iconRainy,
    '09n': iconRainy,
    '10d': iconRainy,
    '10n': iconRainy,
    '13d': iconSnowy,
    '13n': iconSnowy,
  };

  const bgMap = {
    '01d': bgSunny,
    '01n': bgSunny,
    '02d': bgCloudy,
    '02n': bgCloudy,
    '03d': bgCloudy,
    '03n': bgCloudy,
    '09d': bgRainy,
    '09n': bgRainy,
    '10d': bgRainy,
    '10n': bgRainy,
    '13d': bgSnowy,
    '13n': bgSnowy,
  };

  const getWeather = async (city) => {
    if (!city) return;
    try {
      const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
      const res = await fetch(apiURL);
      const info = await res.json();

      if (!res.ok) {
        alert("City not found , type correct city name ");
        return;
      }

      const weatherCode = info.weather[0].icon;
      setShuklaData({
        temp: info.main.temp,
        humid: info.main.humidity,
        wind: info.wind.speed,
        city: info.name,
        icon: iconMap[weatherCode] || iconSunny,
      });

      setBgImage(bgMap[weatherCode] || bgSunny);
    } catch (err) {
      console.log("Error while getting weather:", err);
    }
  };

  const findSuggestions = async (text) => {
    if (text.length < 2) {
      setLocationList([]);
      return;
    }

    try {
      const res = await fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${text}&limit=10&type=city&apiKey=435585cc80fb48cb8417e6440d507471`
      );
      const data = await res.json();
      const names = data.features.map(
        (item) => item.properties.city || item.properties.name || item.properties.formatted
      );
      setLocationList(names);
    } catch (err) {
      console.log("Suggestion error:", err);
    }
  };

  const handleTyping = (e) => {
    findSuggestions(e.target.value);
  };

  const handlePick = (pickedCity) => {
    anshInput.current.value = pickedCity;
    setLocationList([]);
    getWeather(pickedCity);
  };

  useEffect(() => {
    getWeather('New Delhi');
  }, []);

  return (
    <div className="weather" style={{
      backgroundImage: `url(${bgImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      transition: 'background-image 0.5s ease-in-out',
    }}>
      <div className='search-bar'>
        <input
          type='text'
          ref={anshInput}
          placeholder='Type a city...'
          onChange={handleTyping}
        />
        <img src={searchImg} alt='search' onClick={() => getWeather(anshInput.current.value)} />
        {locationList.length > 0 && (
          <ul className='suggestions'>
            {locationList.map((place, index) => (
              <li key={index} onClick={() => handlePick(place)}>{place}</li>
            ))}
          </ul>
        )}
      </div>

      <img src={shuklaData?.icon || iconSunny} alt='icon' className='weather-icon' />
      {shuklaData && (
        <>
          <p className='temperature'>{shuklaData.temp}°C</p>
          <p className='location'>{shuklaData.city}</p>
          <div className='weather-data'>
            <div className='col'>
              <img src={iconHumidity} alt='Humidity' />
              <div>
                <p>{shuklaData.humid}%</p>
                <span>Humidity</span>
              </div>
            </div>
            <div className='col'>
              <img src={iconWindy} alt='Wind Speed' />
              <div>
                <p>{shuklaData.wind} km/h</p>
                <span>Wind Speed</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
