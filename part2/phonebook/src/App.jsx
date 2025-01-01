import { useState } from "react";

const Person = ({ person }) => (
  <div>
    {person.name} {person.number}
  </div>
);

const Persons = ({ persons, filter }) => (
  <div>
    {persons
      .filter((person) => person.name.toLowerCase().includes(filter.toLowerCase()))
      .map((person, id) => (
        <Person key={id} person={person} />
      ))}
  </div>
);

const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "040-123456", id: 1 },
    { name: "Ada Lovelace", number: "39-44-5323523", id: 2 },
    { name: "Dan Abramov", number: "12-43-234345", id: 3 },
    { name: "Mary Poppendieck", number: "39-23-6423122", id: 4 },
  ]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [newSearch, setNewSearch] = useState("");

  const handleNewName = (event) => {
    console.log(event.target.value);
    setNewName(event.target.value);
  };

  const handleNewNumber = (event) => {
    console.log(event.target.value);
    setNewNumber(event.target.value);
  };

  const handleNewSearch = (event) => {
    console.log(event.target.value);
    setNewSearch(event.target.value);
  };

  const addPerson = (event) => {
    event.preventDefault();
    const person = {
      name: newName,
      number: newNumber,
      id: persons.length + 1,
    };
    if (persons.some((p) => p.name === person.name)) {
      alert(`${person.name} is already in the phonebook`);
    } else {
      console.log(`Added ${newName}`);
      setPersons(persons.concat(person));
    }
    setNewName("");
    setNewNumber("");
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        filter shown with <input value={newSearch} onChange={handleNewSearch} />
      </div>
      <h3>add a new</h3>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNewName} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNewNumber} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h3>Numbers</h3>
      <Persons persons={persons} filter={newSearch} />
    </div>
  );
};

export default App;
