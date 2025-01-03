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
      .map((person, id) => (
        <Person key={id} person={person} />
      ))}
  </div>
)
