import { useState } from "react";

export const PersonForm = ({ add }) => {
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");

  const handleNewName = (event) => {
    console.log(event.target.value);
    setNewName(event.target.value);
  };

  const handleNewNumber = (event) => {
    console.log(event.target.value);
    setNewNumber(event.target.value);
  };

  const handleAddEvent = (event) => {
    event.preventDefault();
    add({
      name: newName,
      number: newNumber,
    });
    setNewName("");
    setNewNumber("");
  };

  return (
    <form onSubmit={handleAddEvent}>
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
  );
};
