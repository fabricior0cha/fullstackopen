import axios from 'axios'
import React, { useEffect, useState } from 'react'

const api_key = process.env.REACT_APP_API_KEY

export const Country = ({country}) => {

  const [weather, setWeather] = useState({})

  useEffect(() => {
    axios
    .get(`http://api.weatherstack.com/current?access_key=${api_key}&query=${country.capital}`)
    .then(resp => setWeather(resp.data.current))
  },[country.capital])
  
  return (
    <>
    <h1>{country.name}</h1>
    <table>
     <tbody>
       <tr>
         <td>capital</td>
         <td>{country.capital}</td>
       </tr>
       <tr>
         <td>area</td>
         <td>{country.area}</td>
       </tr>
     </tbody>
    </table>
    <h3>languages</h3>
    <ul>
     {
       country.languages.map(language => <li>{language.name}</li>)
     }
    </ul>
    <img height={200} width={200} src={country.flag} alt={`flag of ${country.name}`}/>
    <h2>Weather in {country.capital}</h2>
    <p>temperature {weather.temperature} celsius</p>
    <img src={weather.weather_icons}/>
    <p>wind {weather.temperature} 1.34 m/s</p>
   </>
  )
}
