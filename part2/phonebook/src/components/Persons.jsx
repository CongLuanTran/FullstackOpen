import phonebook from "../services/phonebook"

const Person = ({ person }) => (
  <>
    {person.name} {person.number}
  </>
)

export const Persons = ({ persons, setPersons, filter }) => {
  const handleRemove = (person) => {
    if (window.confirm(`Delete ${person.name}`)) {
      phonebook.remove(person.id)
      setPersons(persons.filter(p => p.id != person.id))
    }
  }
  return (
    <div>
      {persons
        .filter((person) => person.name.toLowerCase().includes(filter.toLowerCase())
        )
        .map(person => (
          <div key={person.id}>
            <Person person={person} /> &#20;
            <button onClick={() => handleRemove(person)}>delete</button>
          </div>
        ))}
    </div>
  )
}
