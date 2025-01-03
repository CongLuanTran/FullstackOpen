const Person = ({ person }) => (
  <div>
    {person.name} {person.number}
  </div>
)
export const Persons = ({ persons, filter }) => (
  <div>
    {persons
      .filter((person) => person.name.toLowerCase().includes(filter.toLowerCase())
      )
      .map(person => (
        <Person key={person.id} person={person} />
      ))}
  </div>
)
