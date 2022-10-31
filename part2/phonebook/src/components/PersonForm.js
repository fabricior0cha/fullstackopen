import React from 'react'

const PersonForm = ({handleNewPerson, newName, newNumber, handleNewNumber, handleNewName}) => {
  return (
    <form onSubmit={handleNewPerson}>
    <div>
      name: <input value={newName} onChange={handleNewName}/>
      <div>number: <input value={newNumber} onChange={handleNewNumber}/></div>
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
  )
}

export default PersonForm