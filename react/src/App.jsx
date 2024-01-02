import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const [persons, setPersons] = useState([])

  const [displayPersons, setDisplayPersons] = useState([])

  const [newName, setNewName] = useState('')

  const [newNumber, setNewNumber] = useState('')

  const [newFilter, setNewFilter] = useState('')

  useEffect(() => {
    const AbortSignal = new AbortController()

    let signal = AbortSignal.signal

    axios
      .get("http://localhost:3001/persons", {signal})
      .then(response => {
        //console.log(response.data)
        setPersons(response.data)
        setDisplayPersons(response.data)
        }
      )
      .catch(error => {
        console.log(error.name)
      })

    setTimeout(()=> {
      AbortSignal.abort()
    },5000)

  },[])

  //console.log("persons:",persons)
  //console.log("display persons", displayPersons)

  const addNote = (event) => {
    event.preventDefault()
    for(let i = 0, j = persons.length; i < j; i ++)
    {
        if (persons[i].name.toUpperCase() === newName.toUpperCase())
        {
            alert( `${newName} is already added to phonebook.`);
            setNewName('')
            setNewNumber('')
            return
        }
    }
    setPersons([...persons,{id: persons.length+1 ,name: newName, number: newNumber}])
    setDisplayPersons([...persons,{id: persons.length+1 ,name: newName, number: newNumber}])
    setNewName('')
    setNewNumber('')
  }

  const handleChangeName = (event) => {
    setNewName(event.target.value)
  }

  const handleChangeNumber = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFiltering = (event) => {
    setNewFilter(event.target.value)
    let personsc = [...persons]
    let valueLength = event.target.value.length
    if (valueLength > 0)
    {
        let personsFilter = personsc.filter(person => person.name.substring(0,valueLength).toUpperCase() === event.target.value.toUpperCase())
        if (personsFilter.length > 0)
        {
            setDisplayPersons(personsFilter)
        }

    }
    else
    {
        setDisplayPersons(persons)
    }

  }


  return (
    <div>
      <h2>Phonebook with JSON server</h2>
      <fieldset>
        <form>
            <label htmlFor='filtering'>Filter shown with</label>
            <input id = 'filtering' type = 'text' value = {newFilter} onChange={handleFiltering}/>
        </form>
      </fieldset>
      <h2>Add new name</h2>
      <fieldset>
        <form onSubmit = {addNote}>
            <div>
              <label htmlFor='name'>Name:</label>
              <input id = "name" type = "text" value = {newName} onChange={handleChangeName}/>
              <label htmlFor="number">Number:</label>
              <input id = "number" type = "text" value = {newNumber} onChange={handleChangeNumber}/>
            </div>
            <br/>
            <div>
              <button disabled = {!newName || !newNumber} type="submit">Add</button>
            </div>
        </form>
      </fieldset>

      <h2>Numbers</h2>
      <ul>
        {displayPersons.map(person => <li key={person.name}> {`${person.name},`} {`NUMBER: ${person.number},`} {`ID: ${person.id}`}</li>)}
      </ul>
    </div>
  )
}

export default App
