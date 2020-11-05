import { useMutation } from '@redwoodjs/web'
import { navigate, routes } from '@redwoodjs/router'
import { createMachine } from 'xstate'
import { assign } from '@xstate/immer'
import { useMachine } from '@xstate/react'

import ProjectsCell from 'src/components/ProjectsCell'

import { getCurrentMonth } from 'src/lib/date'
import { useClickOutside, useKeyDown } from 'src/lib/hooks'

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
          <ProjectMenu project={project}>
            <CreateProject closeNav={() => send('HIDE')} />
          </ProjectMenu>
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

const projectMenuMachine = (project) =>
  createMachine({
    id: 'projectMenu',
    // We're typing as soon as this opens
    initial: 'active',
    context: {
      project,
      value: project,
    },
    states: {
      active: {
        on: {
          CHANGE: {
            actions: assign((context, event) => {
              context.value = event.value
            }),
          },
          // This has to be better...
          UPDATE: {
            actions: ['updateProject', 'navigateUpdate'],
          },
          // Keep the nav open here...
          DELETE: {
            actions: ['deleteProjectByName', 'navigateDelete'],
          },
        },
      },
    },
  })

const ProjectMenu = ({ project, children }) => {
  const [updateProject] = useMutation(UPDATE_PROJECT_NAME_BY_NAME)
  const deleteProjectByName = useDeleteProjectByName(project)

  const [current, send] = useMachine(projectMenuMachine(project), {
    actions: {
      updateProject: (context) => {
        console.log(context.project, context.value)
        updateProject({
          variables: {
            name: context.project,
            newName: context.value,
          },
        })
      },
      navigateUpdate: (context) => {
        navigate(
          routes.projectMonth({
            project: context.value,
            month: getCurrentMonth(),
          })
        )
      },
      deleteProjectByName,
      navigateDelete: () => {
        navigate(
          routes.projectMonth({
            project: document.querySelector('a').textContent,
            month: getCurrentMonth(),
          })
        )
      },
    },
  })

  const handleBlur = () => {
    if (current.context.value && current.context.value != project) {
      send('UPDATE')
    }
  }

  return (
    <div className="w-48 bg-gray-50 border border-gray-900 rounded shadow-br divide-y divide-gray-900">
      {/* rename, remove project */}
      <div className="px-1 py-2">
        <div className="flex space-x-1">
          <input
            type="text"
            value={current.context.value}
            onChange={({ target: { value } }) => send('CHANGE', { value })}
            className="w-full px-2 py-1 focus:bg-gray-200 focus:shadow-br-inset rounded focus:outline-none"
            onBlur={handleBlur}
          />
          <button
            className="flex-shrink-0 border border-gray-900 rounded px-2"
            onClick={() => send('DELETE')}
          >
            remove -
          </button>
        </div>
      </div>
      <div className="px-1 py-2">{children}</div>
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

const createProjectMachine = createMachine(
  {
    id: 'createProject',
    initial: 'typing',
    context: {
      value: '',
    },
    states: {
      typing: {
        on: {
          CHANGE: {
            actions: ['assignToValue'],
          },
          CREATE: {
            actions: ['createProjectFromValue', 'navigateToValue', 'closeNav'],
          },
        },
      },
    },
  },
  {
    actions: {
      assignToValue: assign((context, event) => {
        context.value = event.value
      }),
      navigateToValue: ({ value }) =>
        navigate(
          routes.projectMonth({
            project: value,
            month: getCurrentMonth(),
          })
        ),
    },
  }
)

const CreateProject = ({ closeNav }) => {
  const [createProject] = useMutation(CREATE_PROJECT)
  const [current, send] = useMachine(createProjectMachine, {
    actions: {
      createProjectFromValue: (context) => {
        createProject({ variables: { name: context.value } })
      },
      closeNav,
    },
  })

  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'Enter':
        if (e.ctrlKey) {
          send('CREATE')
        }
        break
    }
  }

  return (
    <div className="flex space-x-1">
      <input
        type="text"
        placeholder="project"
        value={current.context.value}
        onChange={({ target: { value } }) => send('CHANGE', { value })}
        autoFocus={true}
        className="w-full px-2 py-1 focus:bg-gray-200 focus:shadow-br-inset rounded focus:outline-none"
        onKeyDown={handleKeyDown}
      />
      <button
        className="flex-shrink-0 border border-gray-900 rounded px-2"
        onClick={() => send('CREATE')}
      >
        add +
      </button>
    </div>
  )
}

export default ProjectMonthNav
