import { useState } from 'react'
import { useMutation } from '@redwoodjs/web'
import { toMonthIndex, isToday } from 'common/common'

export const QUERY = gql`
  query DaysByProjectMonthQuery($project: String!, $month: String!) {
    daysByProjectMonth(project: $project, month: $month) {
      projectName
      date
      hasEntry
      notes
    }
  }
`

export const Loading = ({ month }) => {
  const noOfDays = new Date(2020, toMonthIndex(month) + 1, 0).getDate()

  const days = [...Array(noOfDays).keys()].map((el) => {
    const date = new Date(2020, toMonthIndex(month), el + 1)

    return (
      <div key={date.toISOString()} className="flex flex-col relative">
        <div
          className={
            'text-center font-mono ' + (isToday(date) ? 'underline' : '')
          }
        >
          {date.getDate()}
        </div>
        <div className="text-center bg-gray-200 animate-pulse">&nbsp;</div>
      </div>
    )
  })

  return days
}

export const Failure = ({ error }) => <div>Error: {error.message}</div>

const Day = ({ date, hasEntry, toggle, setNotes, hasNotes }) => {
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
          document.querySelector(`#day${date.getDate() + 7}`)?.focus()
        }
        break
      case 'k':
        document.querySelector(`#day${date.getDate() - 7}`)?.focus()
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
      case 'Enter':
        e.preventDefault()
        setNotes()
        break
      case 'Escape':
        e.target.blur()
        break
    }
  }

  return (
    <div
      id={`day${date.getDate()}`}
      className="flex flex-col relative"
      tabIndex="0"
      onKeyDown={handleKeyDown}
    >
      <div
        className={
          'text-center font-mono ' + (isToday(date) ? 'underline' : '')
        }
      >
        {date.getDate()}
      </div>
      <div
        className={
          'text-center ' +
          (hasEntry
            ? 'bg-red-500 shadow-kp text-red-800'
            : 'bg-gray-200 text-gray-400')
        }
      >
        {hasNotes ? '\u2022' : '\u00A0'}
      </div>
    </div>
  )
}

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
      notes
    }
  }
`

export const Success = ({ project, month, daysByProjectMonth, setNotes }) => {
  const [toggleHasEntry] = useMutation(TOGGLE_MUTATION)
  const [createDay] = useMutation(CREATE_MUTATION)

  const noOfDays = new Date(2020, toMonthIndex(month) + 1, 0).getDate()
  const days = [...Array(noOfDays).keys()].map((el) => {
    const date = new Date(2020, toMonthIndex(month), el + 1)

    const hasDay = daysByProjectMonth.find(
      (day) => day.date === date.toISOString()
    )

    const toggle = hasDay
      ? () =>
          toggleHasEntry({
            variables: { project, date },
          })
      : () =>
          createDay({
            variables: { project, date },
          })

    return (
      <Day
        key={date.toISOString()}
        {...{
          date,
          hasEntry: hasDay?.hasEntry,
          toggle,
          setNotes: () =>
            setNotes(
              <Notes {...{ project, date, notes: hasDay?.notes, setNotes }} />
            ),
          hasNotes: hasDay?.notes,
        }}
      />
    )
  })

  return days
}

const CREATE_NOTES = gql`
  mutation CreateDayWithNotesMutation(
    $project: String!
    $date: DateTime!
    $notes: String!
  ) {
    createDayWithNotes(project: $project, date: $date, notes: $notes) {
      projectName
      date
      hasEntry
      notes
    }
  }
`

const UPDATE_NOTES = gql`
  mutation UpdateNotesMutation(
    $project: String!
    $date: DateTime!
    $notes: String!
  ) {
    updateNotes(project: $project, date: $date, notes: $notes) {
      projectName
      date
      notes
    }
  }
`

const Notes = ({ project, notes, date, setNotes }) => {
  const [createNotes] = useMutation(CREATE_NOTES)
  const [updateNotes] = useMutation(UPDATE_NOTES)

  const createOrUpdate =
    notes === undefined
      ? (notes_) => createNotes({ variables: { project, date, notes: notes_ } })
      : (notes_) => updateNotes({ variables: { project, date, notes: notes_ } })

  const [value, setValue] = useState(notes)

  const handleChange = (e) => {
    setValue(e.target.value)
  }

  const handleTextareaKeyDown = (e) => {
    e.stopPropagation()
    switch (e.key) {
      case 'Escape':
        if (value) {
          createOrUpdate(value)
        }
        document.querySelector(`#day${date.getDate()}`)?.focus()
        setNotes(null)
        break
    }
  }

  return (
    <textarea
      autoFocus={true}
      value={value}
      onChange={handleChange}
      onKeyDown={handleTextareaKeyDown}
      className="w-64 border border-gray-900 rounded bg-gray-50 px-2 py-1 font-mono tracking-tight focus:outline-none shadow-kp"
    />
  )
}
