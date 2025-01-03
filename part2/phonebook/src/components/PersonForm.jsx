import phonebook from '../services/phonebook'
import { useState } from 'react'

export const PersonForm = ({ list, setter }) => {
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const handleNewName = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNewNumber = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()
    const person = {
      name: newName,
      number: newNumber,
    }
    if (list.some((p) => p.name === person.name)) {
      alert(`${person.name} is already in the phonebook`)
    } else {
      phonebook
        .create(person)
        .then(response => {
          console.log(response)
          setter(list.concat(response))
        })
    }
    setNewName('')
    setNewNumber('')
  }

  return (
    <form onSubmit={addPerson}>
      <div>
        name: <input value={newName} onChange={handleNewName} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNewNumber} />
      </div>
      <div>
        <button type='submit'>add</button>
      </div>
    </form>
  )
} 
