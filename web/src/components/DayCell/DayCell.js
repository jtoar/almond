/**
 * @todo maybe persisting the cache will skip loading?
 */
import { isToday } from 'common/common'
import { useMutation } from '@redwoodjs/web'

export const QUERY = gql`
  query DayByProjectDateQuery($project: String!, $date: DateTime!) {
    dayByProjectDate(project: $project, date: $date) {
      projectName
      date
      hasEntry
    }
  }
`

export const Loading = ({ date }) => {
  const date_ = new Date(date)
  const day = date_.getDate()

  return (
    <div className="flex flex-col relative">
      <div
        className={
          'text-center font-mono ' + (isToday(date_) ? 'underline' : '')
        }
      >
        {day}
      </div>
      <div className="text-center bg-gray-200 animate-pulse">&nbsp;</div>
    </div>
  )
}

export const Failure = ({ error }) => <div>Error: {error.message}</div>

const TOGGLE_MUTATION = gql`
  mutation ToggleHasEntryMutation($project: String!, $date: DateTime!) {
    toggleHasEntry(project: $project, date: $date) {
      projectName
      date
      hasEntry
    }
  }
`

const CREATE_MUTATION = gql`
  mutation CreateDayMutation($project: String!, $date: DateTime!) {
    createDay(project: $project, date: $date) {
      projectName
      date
      hasEntry
    }
  }
`

/**
 * @todo add notes
 */
export const Success = ({ project, date, dayByProjectDate }) => {
  const date_ = new Date(date)
  const day = date_.getDate()

  const [toggle] = useMutation(
    dayByProjectDate ? TOGGLE_MUTATION : CREATE_MUTATION,
    {
      variables: { project, date },
      update: dayByProjectDate
        ? undefined
        : (cache, { data: { createDay } }) => {
            cache.writeQuery({
              query: QUERY,
              variables: { project, date },
              data: {
                dayByProjectDate: createDay,
              },
            })
          },
    }
  )

  const handleKeyDown = (e) => {
    switch (e.key) {
      /**
       * Navigation
       */
      case 'h':
        e.target.previousElementSibling?.focus()
        break
      case 'j':
        if (!e.ctrlKey) {
          e.stopPropagation()
          document.querySelector(`#day${day + 7}`)?.focus()
        }
        break
      case 'k':
        document.querySelector(`#day${day - 7}`)?.focus()
        break
      case 'l':
        e.target.nextElementSibling?.focus()
        break
      /**
       * Logic
       */
      case 't':
        toggle()
        break
      // case 'Enter':
      //   e.preventDefault()
      //   setNotes(
      //     <Notes {...{ notes: dayByProjectDate?.notes, day, setNotes }} />
      //   )
      //   break
      case 'Escape':
        e.target.blur()
        break
    }
  }

  return (
    <div
      id={`day${day}`}
      className="flex flex-col relative"
      tabIndex="0"
      onKeyDown={handleKeyDown}
    >
      <div
        className={
          'text-center font-mono ' + (isToday(date_) ? 'underline' : '')
        }
      >
        {day}
      </div>
      <div
        className={
          'text-center ' +
          (dayByProjectDate?.hasEntry
            ? 'bg-red-500 shadow-kp text-red-800'
            : 'bg-gray-200 text-gray-400')
        }
      >
        {/* {dayByProjectDate?.notes ? '\u2022' : '\u00A0'} */}
        &nbsp;
      </div>
    </div>
  )
}

// const Notes = ({ notes, day, setNotes }) => {
//   const [value, setValue] = useState(notes)

//   const handleChange = (e) => {
//     setValue(e.target.value)
//   }

//   const handleTextareaKeyDown = (e) => {
//     e.stopPropagation()
//     switch (e.key) {
//       case 'Escape':
//         document.querySelector(`#day${day}`)?.focus()
//         setNotes(null)
//         break
//     }
//   }

//   return (
//     <textarea
//       autoFocus={true}
//       value={value}
//       onChange={handleChange}
//       onKeyDown={handleTextareaKeyDown}
//       className="w-64 border border-gray-900 rounded bg-gray-50 px-2 py-1 font-mono tracking-tight focus:outline-none shadow-kp"
//     />
//   )
// }
