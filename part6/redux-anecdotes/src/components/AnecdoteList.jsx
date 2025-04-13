import { useDispatch, useSelector } from 'react-redux'
import { voteFor } from '../reducers/anecdoteReducer'
import PropTypes from 'prop-types'
import { notify } from '../reducers/notificationReducer'

const Anecdote = ({ anecdote, handleClick }) => {
  return (
    <div>
      <div>
        {anecdote.content}
      </div>
      <div>
        has {anecdote.votes}
        <button onClick={handleClick}>vote</button>
      </div>
    </div>
  )
}

Anecdote.propTypes = {
  anecdote: PropTypes.object,
  handleClick: PropTypes.func
}

const AnecdoteList = () => {

  const anecdotes = useSelector(state =>
    state.anecdotes.filter((anecdote) => {
      return anecdote.content.toLowerCase().includes(state.filter.toLowerCase())
    })
  )
  const dispatch = useDispatch()

  return (
    <>
      {[...anecdotes].sort((a, b) => b.votes - a.votes)
        .map(anecdote =>
          <Anecdote
            key={anecdote.id}
            anecdote={anecdote}
            handleClick={
              () => {
                dispatch(voteFor(anecdote.id))
                dispatch(notify(`You voted '${anecdote.content}'`))
              }
            }
          />
        )
      }
    </>
  )
}

export default AnecdoteList
