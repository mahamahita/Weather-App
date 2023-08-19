import hotBg from './assets/hot.jpg';
import coldBg from './assets/cold.jpg';
import Descriptions from './components/Descriptions';
import { useEffect, useState } from 'react';
import { getFormattedWeatherData } from './weatherService';
import { MdAdUnits } from 'react-icons/md';
import { FaSearch } from 'react-icons/fa';

function App() {
  const [city, setCity] = useState('casablanca');
  const [weather, setWeather] = useState(null);
  const [units, setUnits] = useState('metric');
  const [bg, setBg] = useState(hotBg);
  const [errorMessage, setErrorMessage] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  
  useEffect(
    () => {
      const fetchWeatherData = async () => {
        try {
          setErrorMessage(null);
          const data = await getFormattedWeatherData(city, units);
          setWeather(data);
          //dynamic bg

          const threshold = units === 'metric' ? 20 : 60;
          if (data.temp <= threshold) setBg(coldBg);
          else setBg(hotBg);
        } catch (error) {
         console.error("Error fetching weather data:", error);
  setWeather(null);
  setErrorMessage("The City you entered is not found");
        }
      };
      fetchWeatherData();
    }, [units, city]);
  
  const handleUnitsClick = (e) => {
    const button = e.currentTarget;
    const currentUnit = button.innerText.slice(1);
    const isCelsius = currentUnit === 'C';
    button.innerText = isCelsius ? '°F' : '°C';
    setUnits(isCelsius ? "metric" : "imperial");
  };

  const enterKeyPressed = (e) => { 
    if (e.keyCode === 13) {
      setCity(e.currentTarget.value);
      e.currentTarget.blur();
   }
  };


const handleCityInputChange = (e) => {
  setSearchValue(e.target.value);

  };

  const searchClicked = () => {
    // Set the value in the input field to the city state
    setCity(searchValue);
 
  };
  return (
    <div className="app" style={{backgroundImage: `url(${bg})`}}>
      <div className="overlay">
   {errorMessage && (
          <div className="error-message">
            <p>{errorMessage}</p>
            <button
              onClick={() => {
                setErrorMessage(null);
                setCity('casablanca'); 
                setWeather(null);
              }}
            >
              Try Again
            </button>
          </div>
        )}

        {weather && (
                  <div className="container">
          <div className="section section__inputs">
              <input onKeyDown={enterKeyPressed}  value={searchValue} type="text" name="city" placeholder="Enter City" onChange={handleCityInputChange}>
              </input>
                 <button className='search-button' onClick={searchClicked}> 
                  <FaSearch />
                  </button>
              <button onClick={(e) => handleUnitsClick(e)} >°F</button>

          </div>
          <div className="section section__temperature">
            <div className="icon">
                <h3>{`${weather.name},${weather.country}`}</h3>
              <img src={weather.iconURL}
                alt="weather icon"></img>
              <h3>{weather.description}</h3>
            </div>
            <div className="temperature">
                <h1>{`${weather.temp.toFixed()} °${units ==='metric'? "C" : "F"}`}</h1>
            </div>
          </div>
          {/*bottom description */}
            <Descriptions weather={weather} units={units} />
        </div>
        ) }

     </div>
    </div>
  );
}

export default App;
