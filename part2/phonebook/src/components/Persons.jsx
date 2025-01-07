import phonebook from "../services/phonebook";

const Person = ({ person }) => (
  <>
    {person.name} {person.number}
  </>
);

export const Persons = ({
  persons,
  setPersons,
  filter,
  setMessage,
  setMessageType,
}) => {
  const handleRemove = (person) => {
    if (window.confirm(`Delete ${person.name}`)) {
      phonebook
        .remove(person.id)
        .then((response) => {
          console.log(response);
          setMessageType("success");
          setMessage(`Deleted ${person.name}`);
        })
        .catch((error) => {
          console.log(error);
          setMessageType("error");
          setMessage(`Information of ${person.name} was already removed`);
        });
      setPersons(persons.filter((p) => p.id != person.id));
    }
  };
  return (
    <div>
      {persons
        .filter((person) =>
          person.name.toLowerCase().includes(filter.toLowerCase()),
        )
        .map((person) => (
          <div key={person.id}>
            <Person person={person} /> &#20;
            <button onClick={() => handleRemove(person)}>delete</button>
          </div>
        ))}
    </div>
  );
};
