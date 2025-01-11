import { useEffect, useState } from "react";
import axios from "axios";

const Filter = ({ value, handleChange }) => (
  <div>
    find countries{" "}
    <input
      value={value}
      onChange={handleChange}
    />
  </div>
);

const Country = ({ country }) => {
  const name = country.name.common;
  const capital = country.capital[0];
  const area = country.area;
  const languages = Object.keys(country.languages);
  const flagURL = country.flags.png;

  return (
    <div>
      <h2>{name}</h2>
      <div>
        capital {capital}
      </div>
      <div>
        area {area}
      </div>
      <h4>languages</h4>
      <ul>
        {languages.map((key) => (
          <li key={key}>{country.languages[key]}</li>
        ))}
      </ul>
      <img src={flagURL} />
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
          <div key={c.fifa}>
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
    c.name.common.toLowerCase().includes(filter.toLocaleLowerCase())
  );

  return (
    <div>
      <Filter value={filter} handleChange={handleFilterChange} />
      <Countries countries={matches} setShow={setFilter} />
    </div>
  );
};
export default App;
