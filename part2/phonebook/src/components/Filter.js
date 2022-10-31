import React from 'react'

const Filter = ({handleFilterPerson}) => {
  return (
    <div>
        filter show with: <input onChange={handleFilterPerson}/>
    </div>
  )
}

export default Filter