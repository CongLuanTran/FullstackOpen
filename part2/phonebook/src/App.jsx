import { useState, useEffect } from 'react'
import axios from 'axios'
import { Persons } from './components/Persons'
import { PersonForm } from './components/PersonForm'
import { Filter } from './components/Filter'
import phonebook from './services/phonebook'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newFilter, setNewFilter] = useState('')

  useEffect(() => {
    console.log('effect')
    phonebook
      .getAll()
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response)
      })
  }, [])

  const handleNewFilter = (event) => {
    console.log(event.target.value)
    setNewFilter(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter value={newFilter} onChange={handleNewFilter} />
      <h3>Add a new</h3>
      <PersonForm list={persons} setter={setPersons} />
      <h3>Numbers</h3>
      <Persons persons={persons} filter={newFilter} />
    </div>
  )
}

export default App
