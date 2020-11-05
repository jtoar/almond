import { toMonthIndex, isToday } from 'src/lib/date'
import Day from 'src/components/Day'

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
        <div className={'text-center ' + (isToday(date) ? 'underline' : '')}>
          {date.getDate()}
        </div>
        <div className="text-center bg-gray-200 animate-pulse">&nbsp;</div>
      </div>
    )
  })

  return days
}

export const Failure = ({ error }) => <div>Error: {error.message}</div>

export const Success = ({ project, month, daysByProjectMonth }) => {
  const noOfDays = new Date(2020, toMonthIndex(month) + 1, 0).getDate()

  const days = [...Array(noOfDays).keys()].map((el) => {
    const date = new Date(2020, toMonthIndex(month), el + 1)

    const hasDay = daysByProjectMonth.find(
      (day) => day.date === date.toISOString()
    )

    return (
      <Day
        key={date.toISOString()}
        {...{
          project,
          date,
          hasEntry: hasDay ? hasDay.hasEntry : false,
        }}
      />
    )
  })

  return days
}
