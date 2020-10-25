import { useEffect, useState } from 'react'
import { useMutation } from '@redwoodjs/web'
import { navigate, routes } from '@redwoodjs/router'
import { Form, TextField, Submit } from '@redwoodjs/forms'

import DaysCell from 'src/components/DaysCell'
import ProjectsCell from 'src/components/ProjectsCell'

import { toMonthIndex } from 'src/lib/date'

const ProjectMonthPage = ({ project, month }) => {
  const [notes, setNotes] = useState(null)

  const startsOn = new Date(2020, toMonthIndex(month)).getDay()
  const filler = [...Array(startsOn).keys()].map((el) => {
    return <div key={el}>&nbsp;</div>
  })

  return (
    // Page
    <div className="p-4">
      <div className="space-y-4">
        <ProjectMonthNav {...{ project, month }} />
        <div className="flex flex-row space-x-4">
          <ProjectMonthCalendar>
            {filler}
            <DaysCell {...{ project, month, setNotes }} />
          </ProjectMonthCalendar>
          {notes}
        </div>
      </div>
    </div>
  )
}

const ProjectMonthNav = ({ project }) => {
  const [showProjectMenu, setShowProjectMenu] = useState(false)

  // @todo
  useEffect(() => {
    const handleKeydown = (e) => {
      switch (e.key) {
        case 'k':
          if (e.ctrlKey) {
            e.preventDefault()
            setShowDialog(true)
          }
          break
        case 'Escape':
          setShowDialog(false)
          break
      }
    }

    const id = window.addEventListener('keydown', handleKeydown)

    return () => {
      window.removeEventListener('keydown', id)
    }
  }, [])

  return (
    // Menu
    <div className="relative">
      {/* Menu button */}
      <button
        onClick={() =>
          setShowProjectMenu((showProjectMenu) => !showProjectMenu)
        }
        className={
          'px-2 py-1 border border-gray-900 rounded focus:outline-none ' +
          (showProjectMenu ? 'bg-gray-200 shadow-br-inset' : 'shadow-br')
        }
      >
        {project}
      </button>
      {/* Menu items */}
      {showProjectMenu ? (
        <div className="absolute z-10 top-6 left-2">
          <ProjectMenu project={project} />
        </div>
      ) : null}
    </div>
  )
}

const CREATE_PROJECT = gql`
  mutation CreateProjectMutation($name: String!) {
    createProject(name: $name) {
      id
      name
    }
  }
`

const ProjectMenu = ({ project }) => {
  const [createProject] = useMutation(CREATE_PROJECT)
  const [value, setValue] = useState('')

  const handleClick = () => {
    createProject({ variables: { name: value } })
    setValue('')
    const month = Intl.DateTimeFormat('en-US', { month: 'long' })
      .format(new Date())
      .toLowerCase()
    navigate(routes.projectMonth({ project: value, month: month }))
  }

  // gonna need some validation...

  return (
    <div className="w-48 bg-gray-50 border border-gray-900 rounded shadow-br divide-y divide-gray-900">
      {/* create project */}
      <div className="px-1 py-2">
        <div className="flex space-x-1">
          <input
            type="text"
            placeholder="project"
            autoFocus={true}
            value={value}
            onChange={({ target: { value } }) => setValue(value)}
            className="w-full px-2 py-1 focus:bg-gray-200 focus:shadow-br-inset rounded focus:outline-none"
          />
          <button
            onClick={handleClick}
            className="flex-shrink-0 border border-gray-900 rounded px-2"
          >
            add +
          </button>
        </div>
      </div>
      {/* choose project */}
      <div className="px-1 py-2">
        <ProjectsCell selected={project} />
      </div>
    </div>
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
      <div key={day} className="text-center">
        {day}
      </div>
    )
  })

  return (
    <div className="w-64 grid grid-cols-7 border border-gray-900 rounded shadow-br">
      {jumping ? (
        <input
          type="text"
          autoFocus={true}
          className="absolute m-1 w-8 bg-red-500 rounded focus:outline-none text-center shadow-br"
          onKeyDown={handleKeyDown}
        />
      ) : null}
      {/* <ProjectMonthNav_ /> */}
      {header}
      {children}
    </div>
  )
}

// const ProjectMonthNav_ = () => {
//   return (
//     <div
//       className="col-span-7 pt-1 text-center bg-red-600 border-b border-gray-900"
//       style={{ paddingBottom: '0.45rem' }}
//     >
//       <div className="inline-block divide-x divide-gray-900 border border-gray-900 rounded shadow-kp bg-red-400">
//         <button className="px-2 py-1">korean</button>
//         <button className="px-2 py-1">october</button>
//       </div>
//     </div>
//   )
// }

export default ProjectMonthPage
