import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Country } from './components/Country'

const App = () => {

  const [countries, setCountries] = useState([])
  const [allCountries, setAllCountries] = useState([])


  useEffect(() => {
    axios
    .get('https://restcountries.com/v2/all')
    .then(resp => setAllCountries(resp.data))
  }, [])
  
  const handleFilterCountries = (event) =>{
    const filteredCountries = allCountries
    .filter((country) => 
    country.name.toLowerCase().includes(event.target.value.toLowerCase()))
    setCountries(filteredCountries)
  
  }

  return (
    <div>
      <div>
        find countries <input  onChange={handleFilterCountries}/>
      </div>
      <div>
        {
          countries.length > 10 ? 
          <p>To many matches, specify another filter</p>
          : 
          countries.length !== 1 
          ? 
          <ul>
          {countries.map(country => 
          <li>{country.name}<button onClick={() => setCountries([country])}>show</button></li>)}
          </ul>
          :
          <Country country={countries[0]}/>
        }
      </div>
    </div>
  )
}

export default App