import { useEffect, useState } from 'react'

const ProjectMonthPage = ({ project, month }) => {
  return (
    <div className="p-4 space-y-4">
      <ProjectMonthNav {...{ project, month }} />
      <ProjectMonthCalendar {...{ project, month }} />
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

const ProjectMonthCalendar = ({ project, month }) => {
  const [jumping, setJumping] = useState(false)

  useEffect(() => {
    const handleKeydown = (e) => {
      switch (e.key) {
        case 'j':
          document.querySelector('#day1')?.focus()
          break
        case '/':
          e.preventDefault()
          setJumping(true)
          break
      }
    }

    const id = window.addEventListener('keydown', handleKeydown)

    return () => {
      window.removeEventListener(id)
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
    return <Day key={el + 1} {...{ project, month, day: el + 1 }} />
  })

  return (
    <div
      className="w-64 grid grid-cols-7 border border-gray-900 rounded"
      style={{ boxShadow: '3px 3px #a0aec0' }}
    >
      {jumping ? (
        <input
          type="text"
          autoFocus={true}
          className="absolute m-1 w-8 bg-red-500 rounded focus:outline-none text-center font-mono tracking-tight"
          onKeyDown={handleKeyDown}
          style={{ boxShadow: '3px 3px #a0aec0' }}
        />
      ) : null}
      {header}
      {filler}
      {days}
    </div>
  )
}

const Notes = ({ project, month, day, setShowNotes }) => {
  const [value, setValue] = useState(
    localStorage.getItem([project, month, day, 'notes'].join('-')) || ''
  )

  useEffect(() => {
    localStorage.setItem([project, month, day, 'notes'].join('-'), value)
  }, [project, month, day, value])

  const handleChange = (e) => {
    setValue(e.target.value)
  }

  const handleTextareaKeyDown = (e) => {
    e.stopPropagation()
    switch (e.key) {
      case 'Escape':
        e.target.parentElement?.focus()
        setShowNotes(false)
        break
    }
  }

  return (
    <textarea
      autoFocus={true}
      value={value}
      onChange={handleChange}
      onKeyDown={handleTextareaKeyDown}
      className="h-64 w-64 absolute z-10 border border-gray-900 rounded bg-white px-2 py-1 font-mono tracking-tight focus:outline-none"
      style={{ boxShadow: '3px 3px #a0aec0', left: '15px', top: '33px' }}
    />
  )
}

const Day = ({ project, month, day }) => {
  const [hasEntry, setHasEntry] = useState(
    JSON.parse(localStorage.getItem([project, month, day].join('-'))) || false
  )

  useEffect(() => {
    localStorage.setItem(
      [project, month, day].join('-'),
      JSON.stringify(hasEntry)
    )
  }, [project, month, day, hasEntry])

  const [showNotes, setShowNotes] = useState(false)

  const handleKeyDown = (e) => {
    switch (e.key) {
      /**
       * Navigation
       */
      case 'h':
        e.target.previousElementSibling?.focus()
        break
      case 'j':
        e.stopPropagation()
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
      case 'Enter':
        e.preventDefault()
        setHasEntry(true)
        setShowNotes(true)
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
      <div className="text-center font-mono">{day}</div>
      <div
        className={hasEntry ? 'bg-red-500' : 'bg-gray-300'}
        style={hasEntry ? { boxShadow: '3px 3px #a0aec0' } : {}}
      >
        &nbsp;
      </div>
      {showNotes ? <Notes {...{ project, month, day, setShowNotes }} /> : null}
    </div>
  )
}

export default ProjectMonthPage
