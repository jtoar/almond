import { useEffect, useState } from 'react'

const ProjectMonthPage = ({ project, month }) => {
  return (
    <div className="p-4 space-y-4">
      <ProjectMonthNav project={project} month={month} />
      <ProjectMonthCalendar month={month} />
    </div>
  )
}

const ProjectMonthNav = ({ project, month }) => {
  return (
    <button
      className="px-2 py-1 border border-gray-900 rounded font-mono tracking-tight"
      style={{ boxShadow: '3px 3px #a0aec0' }}
    >
      {project} / {month}
    </button>
  )
}

const ProjectMonthCalendar = ({ month }) => {
  const daysOfTheWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
  const header = daysOfTheWeek.map((day) => {
    return (
      <div key={day} className="font-mono tracking-tight text-center">
        {day}
      </div>
    )
  })

  const toMonthIndex = {
    january: 0,
    february: 1,
    march: 2,
    april: 3,
    may: 4,
    june: 5,
    july: 6,
    august: 7,
    september: 8,
    october: 9,
    november: 10,
    december: 11,
  }

  const startsOn = new Date(2020, toMonthIndex[month]).getDay()
  const filler = [...Array(startsOn).keys()].map((el) => {
    return <div key={el}>&nbsp;</div>
  })

  const noOfDays = new Date(2020, toMonthIndex[month] + 1, 0).getDate()
  const days = [...Array(noOfDays).keys()].map((el) => {
    return <Day key={el + 1} day={el + 1} />
  })

  return (
    <div
      className="w-64 grid grid-cols-7 border border-gray-900 rounded"
      style={{ boxShadow: '3px 3px #a0aec0' }}
    >
      {header}
      {filler}
      {days}
    </div>
  )
}

const Day = ({ day }) => {
  const [hasEntry, setHasEntry] = useState(
    JSON.parse(localStorage.getItem(`day${day}`)) || false
  )

  useEffect(() => {
    localStorage.setItem(`day${day}`, JSON.stringify(hasEntry))
  }, [day, hasEntry])

  const handleKeyDown = (e) => {
    switch (e.key) {
      /**
       * Navigation
       */
      case 'h':
        e.target.previousElementSibling?.focus()
        break
      case 'j':
        document.querySelector(`#day${day + 7}`)?.focus()
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
        setHasEntry((hasEntry) => !hasEntry)
        break
    }
  }

  return (
    <div
      id={`day${day}`}
      className="flex flex-col"
      tabIndex="0"
      onKeyDown={handleKeyDown}
    >
      <div className="text-center font-mono">{day}</div>
      <div
        className={hasEntry ? 'bg-red-500' : 'bg-gray-300'}
        style={hasEntry ? { boxShadow: '3px 3px #a0aec0' } : {}}
      >
        &nbsp;
      </div>
    </div>
  )
}

export default ProjectMonthPage
