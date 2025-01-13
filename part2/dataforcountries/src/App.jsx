import { useEffect, useState } from "react";
import axios from "axios";

const Filter = ({ value, handleChange }) => (
  <div>
    find countries <input value={value} onChange={handleChange} />
  </div>
);

const Country = ({ country }) => {
  const [weather, setWeather] = useState(null);

  const name = country.name.common;
  const [capital] = country.capital;
  const area = country.area;
  const languages = Object.keys(country.languages);
  const flagURL = country.flags.png;

  useEffect(() => {
    const api_key = import.meta.env.VITE_SOME_KEY;
    const [lat, lon] = country.capitalInfo.latlng;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`;
    axios.get(url).then(({ data }) => setWeather(data));
  }, [country]);

  if (!weather) return null;

  const icon = weather.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

  return (
    <div>
      <h2>{name}</h2>
      <div>capital {capital}</div>
      <div>area {area}</div>
      <h4>languages</h4>
      <ul>
        {languages.map((key) => (
          <li key={key}>{country.languages[key]}</li>
        ))}
      </ul>
      <img src={flagURL} />
      <h3>Weather in {capital}</h3>
      <div>temperature {weather.main.temp} Celcius</div>
      <img src={iconUrl} alt={weather.weather.description} />
      <div>wind {weather.wind.speed} m/s</div>
    </div>
  );
};

const Countries = ({ countries, setShow }) => {
  if (countries.length === 1) {
    return <Country country={countries[0]} />;
  }

  if (countries.length <= 10) {
    return (
      <div>
        {countries.map((c) => (
          <div key={c.ccn3}>
            {c.name.common}{" "}
            <button onClick={() => setShow(c.name.common)}>show</button>
          </div>
        ))}
      </div>
    );
  }

  return <div>Too many matches, specify another filter</div>;
};

const App = () => {
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then((response) => setCountries(response.data));
  }, []);

  const handleFilterChange = ({ target }) => {
    console.log(target.value);
    setFilter(target.value);
  };

  const matches = countries.filter((c) =>
    c.name.common.toLowerCase().includes(filter.toLocaleLowerCase()),
  );

  return (
    <div>
      <Filter value={filter} handleChange={handleFilterChange} />
      <Countries countries={matches} setShow={setFilter} />
    </div>
  );
};
export default App;
