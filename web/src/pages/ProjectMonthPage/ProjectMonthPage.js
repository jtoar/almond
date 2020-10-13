import { useEffect, useState } from 'react'
import { toMonthIndex } from 'common/common'
import DayCell from 'src/components/DayCell'

const ProjectMonthPage = ({ project, month }) => {
  const [notes, setNotes] = useState(null)

  const startsOn = new Date(2020, toMonthIndex(month)).getDay()
  const filler = [...Array(startsOn).keys()].map((el) => {
    return <div key={el}>&nbsp;</div>
  })

  const noOfDays = new Date(2020, toMonthIndex(month) + 1, 0).getDate()
  const days = [...Array(noOfDays).keys()].map((el) => {
    const date = new Date(2020, toMonthIndex(month), el + 1).toISOString()
    return <DayCell key={el + 1} {...{ project, date, setNotes }} />
  })

  return (
    <div className="p-4 space-y-4">
      <ProjectMonthNav {...{ project, month }} />
      <div className="flex flex-row space-x-4">
        <ProjectMonthCalendar>
          {filler}
          {days}
        </ProjectMonthCalendar>
        {notes}
      </div>
    </div>
  )
}

const ProjectMonthNav = ({ project, month }) => {
  return (
    <button className="px-2 py-1 border border-gray-900 rounded font-mono tracking-tight shadow-kp">
      {project} / {month}
    </button>
  )
}

const ProjectMonthCalendar = ({ children }) => {
  const [jumping, setJumping] = useState(false)

  useEffect(() => {
    const handleKeydown = (e) => {
      switch (e.key) {
        case 'j':
          e.preventDefault()
          e.ctrlKey
            ? setJumping(true)
            : document.querySelector(`#day${new Date().getDate()}`)?.focus()
      }
    }

    const id = window.addEventListener('keydown', handleKeydown)

    return () => {
      window.removeEventListener('keydown', id)
    }
  }, [])

  const handleKeyDown = (e) => {
    e.stopPropagation()
    switch (e.key) {
      case 'Enter':
        document.querySelector(`#day${e.target.value}`)?.focus()
        setJumping(false)
        break
      case 'Escape':
        setJumping(false)
        break
    }
  }

  const daysOfTheWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
  const header = daysOfTheWeek.map((day) => {
    return (
      <div key={day} className="font-mono tracking-tight text-center">
        {day}
      </div>
    )
  })

  return (
    <div className="w-64 grid grid-cols-7 border border-gray-900 rounded shadow-kp">
      {jumping ? (
        <input
          type="text"
          autoFocus={true}
          className="absolute m-1 w-8 bg-red-500 rounded focus:outline-none text-center font-mono tracking-tight shadow-kp"
          onKeyDown={handleKeyDown}
        />
      ) : null}
      {header}
      {children}
    </div>
  )
}

export default ProjectMonthPage
