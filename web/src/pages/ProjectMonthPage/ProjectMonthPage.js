import { useEffect, useState } from 'react'
import { useMutation } from '@redwoodjs/web'
import { navigate, routes } from '@redwoodjs/router'
import { createMachine } from 'xstate'
import { useMachine } from '@xstate/react'

import DaysCell from 'src/components/DaysCell'
import ProjectsCell from 'src/components/ProjectsCell'

import { getCurrentMonth, toMonthIndex } from 'src/lib/date'
import { useClickOutside, useKeyDown } from 'src/lib/hooks'

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

const toggleMachine = createMachine({
  id: 'toggle',
  initial: 'hidden',
  states: {
    hidden: {
      on: {
        TOGGLE: 'visible',
      },
    },
    visible: {
      on: {
        HIDE: 'hidden',
        TOGGLE: 'hidden',
      },
    },
  },
})

const ProjectMonthNav = ({ project }) => {
  const [current, send] = useMachine(toggleMachine)

  const ref = useClickOutside(() => send('HIDE'))
  useKeyDown('k', () => send('TOGGLE'), { control: true })
  useKeyDown('Escape', () => send('HIDE'))

  return (
    // Menu
    <div className="relative" ref={ref}>
      {/* Menu button */}
      <button
        onClick={() => send('TOGGLE')}
        className={
          'px-2 py-1 border border-gray-900 rounded focus:outline-none ' +
          (current.matches('visible')
            ? 'bg-gray-200 shadow-br-inset'
            : 'shadow-br')
        }
      >
        {project}
      </button>
      {/* Menu items */}
      {current.matches('visible') ? (
        <div className="absolute z-10 top-6 left-2">
          <ProjectMenu project={project} />
        </div>
      ) : null}
    </div>
  )
}

const UPDATE_PROJECT_NAME_BY_NAME = gql`
  mutation UpdateProjectNameByName($name: String!, $newName: String!) {
    updateProjectNameByName(name: $name, newName: $newName) {
      id
      updatedAt
      name
    }
  }
`

const DELETE_PROJECT_BY_NAME = gql`
  mutation DeleteProjectByName($name: String!) {
    deleteProjectByName(name: $name) {
      id
    }
  }
`

const useDeleteProjectByName = (project) => {
  const [deleteProjectByName] = useMutation(DELETE_PROJECT_BY_NAME, {
    variables: {
      name: project,
    },
  })

  return deleteProjectByName
}

const ProjectMenu = ({ project }) => {
  const [value, setValue] = useState(project)
  const [updateProject] = useMutation(UPDATE_PROJECT_NAME_BY_NAME)

  const handleBlur = () => {
    if (value && value != project) {
      updateProject({
        variables: {
          name: project,
          newName: value,
        },
      })
    }
  }

  const deleteProjectByName = useDeleteProjectByName(project)

  const handleClick = () => {
    deleteProjectByName()
    navigate(
      routes.projectMonth({
        project: document.querySelector('a').textContent,
        month: getCurrentMonth(),
      })
    )
  }

  return (
    <div className="w-48 bg-gray-50 border border-gray-900 rounded shadow-br divide-y divide-gray-900">
      {/* rename, remove project */}
      <div className="px-1 py-2">
        <div className="flex space-x-1">
          <input
            type="text"
            value={value}
            onChange={({ target: { value } }) => setValue(value)}
            className="w-full px-2 py-1 focus:bg-gray-200 focus:shadow-br-inset rounded focus:outline-none"
            onBlur={handleBlur}
          />
          <button
            className="flex-shrink-0 border border-gray-900 rounded px-2"
            onClick={handleClick}
          >
            remove -
          </button>
        </div>
      </div>
      <div className="px-1 py-2">
        <CreateProject />
      </div>
      {/* choose project */}
      <div className="px-1 py-2">
        <ProjectsCell selected={project} />
      </div>
    </div>
  )
}

const CREATE_PROJECT = gql`
  mutation CreateProjectMutation($name: String!) {
    createProject(name: $name) {
      id
      createdAt
      updatedAt
      name
    }
  }
`

const useCreateProject = () => {
  const [mutation] = useMutation(CREATE_PROJECT)

  const [value, setValue] = useState('')

  const createProject = () => {
    mutation({ variables: { name: value } })
    setValue('')
    navigate(
      routes.projectMonth({
        project: value,
        month: getCurrentMonth(),
      })
    )
  }

  return [value, setValue, createProject]
}

const CreateProject = () => {
  const [value, setValue, createProject] = useCreateProject()

  /**
   * On j, focus the list.
   * Not really working...
   */
  // const handleKeyDown = (e) => {
  //   switch (e.key) {
  //     case 'j':
  //       e.stopPropagation()
  //       if (e.ctrlKey) {
  //         document.querySelector('a')?.focus()
  //         break
  //       }
  //   }
  // }

  return (
    <div className="flex space-x-1">
      <input
        type="text"
        placeholder="project"
        value={value}
        onChange={({ target: { value } }) => setValue(value)}
        autoFocus={true}
        className="w-full px-2 py-1 focus:bg-gray-200 focus:shadow-br-inset rounded focus:outline-none"
        // onKeyDown={handleKeyDown}
      />
      <button
        className="flex-shrink-0 border border-gray-900 rounded px-2"
        onClick={createProject}
      >
        add +
      </button>
    </div>
  )
}

const jumpMachine = createMachine({
  id: 'jump',
  initial: 'idle',
  states: {
    idle: {
      on: {
        JUMP: 'jumping',
      },
    },
    jumping: {
      on: {
        LAND: {
          target: 'idle',
          actions: (_, { day }) => {
            document.querySelector(`#day${day}`)?.focus()
          },
        },
        CANCEL: 'idle',
      },
    },
  },
})

const ProjectMonthCalendar = ({ children }) => {
  const [current, send] = useMachine(jumpMachine)

  useEffect(() => {
    const handler = (e) => {
      switch (e.key) {
        case 'j':
          e.preventDefault()
          e.ctrlKey
            ? send('JUMP')
            : document.querySelector(`#day${new Date().getDate()}`)?.focus()
      }
    }

    document.addEventListener('keydown', handler)

    return () => {
      document.removeEventListener('keydown', handler)
    }
  }, [send])

  const handleKeyDown = (e) => {
    e.stopPropagation()
    switch (e.key) {
      case 'Enter':
        send({ type: 'LAND', day: e.target.value })
        break
      case 'Escape':
        send('CANCEL')
        break
    }
  }

  const ref = useClickOutside(() => send('CANCEL'))

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
      {current.matches('jumping') ? (
        <input
          ref={ref}
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
