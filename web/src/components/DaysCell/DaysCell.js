import { useMutation } from '@redwoodjs/web'
import { toMonthIndex, isToday } from 'common/common'

export const QUERY = gql`
  query DaysByProjectMonthQuery($project: String!, $month: String!) {
    daysByProjectMonth(project: $project, month: $month) {
      projectName
      date
      hasEntry
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

const Day = ({ date, hasEntry, toggle }) => {
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
          'text-center ' + (hasEntry ? 'bg-red-500 shadow-kp' : 'bg-gray-200')
        }
      >
        &nbsp;
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
    }
  }
`

export const Success = ({ project, month, daysByProjectMonth }) => {
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
        }}
      />
    )
  })

  return days
}

//   update(cache, { data: { createDay } }) {
//     cache.modify({
//       fields: {
//         daysByProjectMonth(existing) {
//           const createDayRef = cache.writeFragment({
//             data: createDay,
//             fragment: gql`
//               fragment NewDay on Day {
//                 projectName
//                 date
//                 hasEntry
//               }
//             `,
//           })
//           return [...existing, createDayRef]
//         },
//       },
//     })
//   },
