import phonebook from "../services/phonebook";
import { useState } from "react";

export const PersonForm = ({
  persons,
  setPersons,
  setMessage,
  setMessageType,
}) => {
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

  const addPerson = (event) => {
    event.preventDefault();
    const person = {
      name: newName,
      number: newNumber,
    };
    const collision = persons.find((p) => p.name === person.name);
    if (collision != undefined) {
      if (
        window.confirm(
          `${person.name} was already added to phonebook, ` +
            "replace old number with a new one?",
        )
      ) {
        phonebook
          .update(collision.id, person)
          .then((response) => {
            console.log(response);
            setPersons(
              persons.map((p) => (p.id === collision.id ? response : p)),
            );
            setMessage(`Changed ${person.name}'s number to ${person.number}`);
            setMessageType("success");
          })
          .catch((error) => {
            console.log(error);
            setMessage(`Information of ${person.name} was already removed`);
            setMessageType("error");
            setPersons(persons.filter((p) => p.id !== collision.id));
          });
      }
    } else {
      phonebook.create(person).then((response) => {
        console.log(response);
        setPersons(persons.concat(response));
        setMessage(`Added ${person.name}`);
        setMessageType("success");
      });
    }
    setNewName("");
    setNewNumber("");
  };

  return (
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
  );
};
