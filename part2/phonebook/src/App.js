import { useEffect, useState } from 'react'
import Filter from './components/Filter'
import Notification from './components/Notification'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])

  const [allPersons, setAllPersons] = useState([...persons])

  const [newName, setNewName] = useState('')

  const [newNumber, setNewNumber] = useState('')

  const [message, setMessage] = useState(null)

  useEffect(() => {
    personService
    .getAll()
    .then(persons => {
      setPersons(persons)
    })
  },[])

  useEffect(() => {
    setAllPersons([...persons])
  }, [persons])
  
  const handleNewName = (event) => {
      setNewName(event.target.value)
  }

  
  const handleNewNumber = (event) => {
    setNewNumber(event.target.value)
}

  const addPerson = (event) =>{
    event.preventDefault()
    if(persons.filter(person => person.name === newName).length > 0){
      if(window.confirm(`${newName} is already added to phonebook, replace the old number, with a new one?`)){
        const person = persons.find(person => person.name === newName)
        const changedPerson = {...person, number: newNumber}

        personService
        .update(changedPerson)
        .then(returnedPerson => {
          setPersons(persons.map(person => person.id !== changedPerson.id ? person : returnedPerson))
          setNewName('')
          setNewNumber('')
        })
        
        return;
      }


      return;
    }
    const newPerson = {
      name : newName, 
      number: newNumber}
    
      personService
      .create(newPerson)
      .then(returnedPerson => {
        setMessage(`Added ${returnedPerson.name}`)
        setTimeout(() => {
          setMessage(null)
        }, 2000);
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
      })
      .catch(error => {
        console.log(error.response.data)
        setMessage(`Error:${error.response.data.error}`)
        setTimeout(() => {
          setMessage(null)
        }, 2000);
      })
    
  }

  const deletePerson = (id) => {
    const person = persons.find(person => person.id === id)
    if(window.confirm(`Delete ${person.name} ?`)){
      personService.deleteObject(id)
      .then(() => {
        setPersons(persons.filter(person => person.id !== id))
      })
      .catch(err => {
        setMessage(`Error: Information of ${person.name} has already been removed from server`)
        setTimeout(() => {
          setMessage(null)
        }, 2000)
        setPersons(persons.filter(p => p.id !== id))
      })
    }
    
  }

  const handleFilterPerson = (event) => {
    const filterPersons = persons.filter(person => 
      person.name.toLowerCase().includes(event.target.value.toLowerCase()))
    setAllPersons(filterPersons)
  }

  return (
    <div>
      
      <h2>Phonebook</h2>
      <Notification message={message}/>
      <Filter handleFilterPerson={handleFilterPerson}/>
      <h2>add new</h2>
      <PersonForm 
      handleNewPerson={addPerson}
      handleNewName={handleNewName}
      handleNewNumber={handleNewNumber}
      newName={newName}
      newNumber={newNumber}/>
      <h2>Numbers</h2>
      <Persons allPersons={allPersons} deletePerson={deletePerson}/>
    </div>
  )
}

export default App