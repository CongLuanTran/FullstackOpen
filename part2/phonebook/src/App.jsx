import { useState, useEffect } from "react";
import { Persons } from "./components/Persons";
import { PersonForm } from "./components/PersonForm";
import { Filter } from "./components/Filter";
import { Notification } from "./components/Notification";
import phonebook from "./services/phonebook";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newFilter, setNewFilter] = useState("");
  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState();

  useEffect(() => {
    console.log("effect");
    phonebook.getAll().then((response) => {
      console.log("promise fulfilled");
      setPersons(response);
    });
  }, []);

  const handleNewFilter = (event) => {
    console.log(event.target.value);
    setNewFilter(event.target.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification
        message={message}
        setMessage={setMessage}
        messageType={messageType}
        setMessageType={setMessageType}
      />
      <Filter value={newFilter} onChange={handleNewFilter} />
      <h3>Add a new</h3>
      <PersonForm
        persons={persons}
        setPersons={setPersons}
        setMessage={setMessage}
        setMessageType={setMessageType}
      />
      <h3>Numbers</h3>
      <Persons
        persons={persons}
        setPersons={setPersons}
        filter={newFilter}
        setMessage={setMessage}
        setMessageType={setMessageType}
      />
    </div>
  );
};

export default App;
