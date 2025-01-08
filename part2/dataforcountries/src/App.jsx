import { useState, useEffect } from "react";
import axios from "axios";
import { Filter } from "./components/Filter";

const Weather = ({ country }) => {
  const [temp, setTemp] = useState();
  const [wind, setWind] = useState();
  const [icon, setIcon] = useState();
  const api_key = import.meta.env.VITE_API_KEY;
  const lat = country.capitalInfo.latlng[0];
  const lon = country.capitalInfo.latlng[1];
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`;

  useEffect(() => {
    console.log("getting temperature");
    axios.get(url).then((response) => {
      setTemp(response.data.main.temp);
      setWind(response.data.wind.speed);
      setIcon(response.data.weather[0].icon);
      console.log("temparature obtained");
    });
  }, [url]);

  return (
    <>
      <h2>{`Weather in ${country.capital[0]}`}</h2>
      <div>{`temperature ${temp} Celcius`}</div>
      <img src={`https://openweathermap.org/img/wn/${icon}@2x.png`} />
      <div>{`wind ${wind} m/s`}</div>
    </>
  );
};

const Country = ({ country }) => (
  <>
    <h2>{country.name.common}</h2>
    <div>
      <div>capital {country.capital[0]}</div>
      <div>area {country.area}</div>
    </div>
    <h4>languages</h4>
    <ul>
      {Object.entries(country.languages).map(([key, value]) => (
        <li key={key}>{value}</li>
      ))}
    </ul>
    <img src={country.flags["png"]} alt={country.flags["alt"]} />
    <Weather country={country} />
  </>
);

const Countries = ({ countries, filter, setFilter }) => {
  const matches = countries.filter((country) =>
    country.name.common
      .toLocaleLowerCase()
      .includes(filter.toLocaleLowerCase()),
  );

  if (matches.length === 1) {
    const country = matches[0];
    return <Country country={country} />;
  } else {
    if (matches.length <= 10) {
      return (
        <div>
          {matches.map((country) => (
            <div key={country.cca2}>
              {country.name.common}
              <button value={country.name.common} onClick={setFilter}>
                show
              </button>
            </div>
          ))}
        </div>
      );
    } else {
      return <div>Too many matches, specify another filter</div>;
    }
  }
};

const App = () => {
  const [countries, setCountries] = useState([]);
  const [newFilter, setNewFilter] = useState("");

  useEffect(() => {
    console.log("effect");
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then((response) => {
        setCountries(response.data);
        console.log("promise fulfilled");
      });
  }, []);

  const handleNewFilter = (event) => {
    console.log(event.target.value);
    setNewFilter(event.target.value);
  };

  return (
    <div>
      <Filter value={newFilter} onChange={handleNewFilter} />
      <Countries
        countries={countries}
        filter={newFilter}
        setFilter={handleNewFilter}
      />
    </div>
  );
};

export default App;
