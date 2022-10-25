import { useState } from 'react'

const Header = ({title}) => {
  return (
    <h1>{title}</h1>
  )
}

const Display = ({text}) => (<div>{text}</div>)

const Button = ({text, handleClick}) => (<button onClick={handleClick}>{text}</button>)

const AnecdoteWinner = ({anecdotes,points}) => {
  const largestVotes = Math.max(...points)
  const firstPlace = points.indexOf(largestVotes)

  if(largestVotes === 0){
    return <div>No votes</div>
  }

  return (
    <div>{anecdotes[firstPlace]}</div>
  )

}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [points, setPoints] = useState(Array(anecdotes.length).fill(0))

  const handleNextAnecdote = () =>{
    setSelected(Math.floor(Math.random() * ((anecdotes.length-1) - 0 + 1) + 0))
  }

  const handleVoteAnecdote = () => {
      const copy = [...points]
      copy[selected] += 1
      setPoints(copy)
  }

  return (
    <div>
      <Header title="Anecdote of the day"/>
      <Display text={anecdotes[selected]}/>
      <Display text={`has ${points[selected]} votes`}/>
      <Button handleClick={handleVoteAnecdote} text="vote"/>
      <Button handleClick={handleNextAnecdote} text="next anecdotes"/>
      <Header title="Anecdote with the most votes"/>
      <AnecdoteWinner anecdotes={anecdotes} points={points}/>
    </div>
  )
}

export default App