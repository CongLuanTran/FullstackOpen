const Person = ({ person }) => (
  <>
    {person.name} {person.number}
  </>
);

export const Persons = ({ persons, remove }) => {
  return (
    <div>
      {persons.map((person) => (
        <div key={person.id}>
          <Person person={person} /> &#20;
          <button onClick={() => remove(person)}>delete</button>
        </div>
      ))}
    </div>
  );
};
