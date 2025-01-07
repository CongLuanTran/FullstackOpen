import { useState, useEffect } from 'react'
import { Persons } from './components/Persons'
import { PersonForm } from './components/PersonForm'
import { Filter } from './components/Filter'
import { Notification } from './components/Notification'
import phonebook from './services/phonebook'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newFilter, setNewFilter] = useState('')
  const [errorMessage, setErrorMessage] = useState()

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
      <Notification message={errorMessage} setErrorMessage={setErrorMessage} />
      <Filter value={newFilter} onChange={handleNewFilter} />
      <h3>Add a new</h3>
      <PersonForm persons={persons} setPersons={setPersons} setErrorMessage={setErrorMessage} />
      <h3>Numbers</h3>
      <Persons persons={persons} setPersons={setPersons} filter={newFilter} />
    </div>
  )
}

export default App
