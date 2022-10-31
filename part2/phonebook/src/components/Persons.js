import React from 'react'

const Persons = ({allPersons, deletePerson}) => {
  return (
    <>
    {allPersons.map(person => 
    <div key={person.id}>{person.name} {person.number} <button onClick={() => deletePerson(person.id)}>delete</button></div>)}
    </>
    
  )
}

export default Persons