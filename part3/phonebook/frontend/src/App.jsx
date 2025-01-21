import { useState, useEffect } from "react";
import { Persons } from "./components/Persons";
import { PersonForm } from "./components/PersonForm";
import { Filter } from "./components/Filter";
import { Notification } from "./components/Notification";
import phonebook from "./services/phonebook";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [filter, setFilter] = useState("");
  const [message, setMessage] = useState({ content: null });

  useEffect(() => {
    console.log("effect");
    phonebook.getAll().then((response) => {
      console.log("promise fulfilled");
      setPersons(response);
    });
  }, []);

  const handleFilterChange = (event) => {
    console.log(event.target.value);
    setFilter(event.target.value);
  };

  const notify = (message, type = "success") => {
    setMessage({
      content: message,
      type: type,
    });
    setTimeout(() => {
      setMessage({ message: null });
    }, 3000);
  };

  const addPerson = (person) => {
    if (person.name === "" || person.number === "") return;

    const collision = persons.find((p) => p.name === person.name);

    if (collision) {
      updatePerson(collision.id, person);
      return;
    }

    phonebook
      .create(person)
      .then((response) => {
        console.log(response);
        setPersons(persons.concat(response));
        notify(`${person.name} added to phonebook`);
      })
      .catch((error) => notify(error.response.data.error, "error"));
  };

  const updatePerson = (id, person) => {
    const ok = window.confirm(
      `${person.name} is already added to the phonebook, do you want to replace their number?`
    );
    if (ok) {
      phonebook
        .update(id, person)
        .then((response) => {
          console.log(response);
          setPersons(persons.map((p) => (p.id === id ? response : p)));
          notify(`${person.name}'s number updated`);
        })
        .catch((error) => {
          console.log(error);
          setPersons(persons.filter((p) => p.id !== id));
          notify(`Information of ${person.name} is already removed`, "error");
        });
    }
  };

  const removePerson = (person) => {
    const ok = window.confirm(`Delete ${person.name}`);
    if (ok) {
      phonebook.remove(person.id).then((response) => {
        console.log(response);
        notify(`${person.name} removed`);
      });
      setPersons(persons.filter((p) => p.id !== person.id));
    }
  };

  const filtered = persons.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <Filter value={filter} onChange={handleFilterChange} />
      <h3>Add a new</h3>
      <PersonForm add={addPerson} />
      <h3>Numbers</h3>
      <Persons persons={filtered} remove={removePerson} />
    </div>
  );
};

export default App;
