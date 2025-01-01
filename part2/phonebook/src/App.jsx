import { useState } from "react";

const Person = ({ person }) => <div>{person.name}</div>;

const Persons = ({ persons }) =>
  persons.map((person, id) => <Person key={id} person={person} />);

const App = () => {
  const [persons, setPersons] = useState([{ name: "Arto Hellas" }]);
  const [newName, setNewName] = useState("");

  const handleNewName = (event) => {
    console.log(event.target.value);
    setNewName(event.target.value);
  };

  const addPerson = (event) => {
    event.preventDefault();
    const person = {
      name: newName,
    };
    if (persons.some((p) => p.name === person.name)) {
      alert(`${person.name} is already in the phonebook`);
    } else {
      console.log(`Added ${newName}`);
      setPersons(persons.concat(person));
    }
    setNewName("");
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNewName} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <div>
        <Persons persons={persons} />
      </div>
    </div>
  );
};

export default App;
