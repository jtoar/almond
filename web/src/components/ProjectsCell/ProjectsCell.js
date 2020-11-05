import { Link, navigate, routes } from '@redwoodjs/router'
import { useApolloClient } from '@redwoodjs/web'
import { useMachine } from '@xstate/react'
import { getCurrentMonth } from 'src/lib/date'
import { createMachine, assign } from 'xstate'

export const QUERY = gql`
  query ProjectsQuery {
    projects {
      id
      createdAt
      updatedAt
      name
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }) => <div>Error: {error.message}</div>

const updateProject = ({ client, name, newName }) => {
  return client.mutate({
    mutation: gql`
      mutation UpdateProjectNameByName($name: String!, $newName: String!) {
        updateProjectNameByName(name: $name, newName: $newName) {
          id
          name
        }
      }
    `,
    variables: {
      name,
      newName,
    },
  })
}

const useProjectMachine = ({ projects, currentProject }) => {
  const [state, send] = useMachine(
    projectMachine({ projects, currentProject, client: useApolloClient() })
  )
  return [state, send]
}

const projectMachine = ({ projects, currentProject, client }) =>
  createMachine(
    {
      id: 'projects',
      context: {
        projects,
        currentProject,
        client,
        value: currentProject,
      },
      entry: assign({
        currentProject: (context) =>
          context.projects.find((project) => project.name === currentProject),
      }),
      initial: 'active',
      states: {
        active: {
          on: {
            CHANGE: {
              actions: 'updateValue',
            },
            UPDATE: 'updating',
            DELETE: {
              actions: 'deleteProjectByName',
            },
          },
        },
        updating: {
          invoke: {
            id: 'updateProject',
            src: ({ client, currentProject: { name }, value: newName }) =>
              updateProject({
                client,
                name,
                newName,
              }),
            onDone: {
              target: 'active',
              actions: [
                assign({
                  currentProject: ({ currentProject, value }) => {
                    return {
                      ...currentProject,
                      name: value,
                    }
                  },
                }),
                (context) =>
                  navigate(
                    routes.projectMonth({
                      project: context.value,
                      month: getCurrentMonth(),
                    })
                  ),
              ],
            },
          },
        },
      },
    },
    {
      actions: {
        updateValue: assign({
          value: (_, event) => event.value,
          projects: (context, event) => {
            const projects = [...context.projects]

            projects.splice(
              projects.findIndex(
                (project) => project.id === context.currentProject.id
              ),
              1,
              {
                ...context.currentProject,
                name: event.value,
              }
            )

            return projects
          },
        }),
        deleteProjectByName: (context) => {
          context.client.mutate({
            mutation: gql`
              mutation DeleteProjectByName($name: String!) {
                deleteProjectByName(name: $name) {
                  id
                }
              }
            `,
            variables: {
              name: context.project,
            },
          })
        },
      },
    }
  )

export const Success = ({ projects, currentProject, children }) => {
  const [state, send] = useProjectMachine({
    projects,
    currentProject,
  })

  const handleBlur = () => {
    if (
      state.context.value &&
      state.context.value != state.context.currentProject.name
    ) {
      send('UPDATE')
    }
  }

  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'j':
        e.stopPropagation()
        e.target.nextElementSibling?.focus()
        break
      case 'k':
        e.stopPropagation()
        e.target.previousElementSibling?.focus()
        break
    }
  }

  const projectMonthPageLinks = state.context.projects.map((project) => {
    const isSelected = project.name === state.context.currentProject.name
    return (
      <Link
        key={project.id}
        to={routes.projectMonth({
          project: project.name,
          month: getCurrentMonth(),
        })}
        onKeyDown={handleKeyDown}
        className={
          'focus:outline-none focus:bg-gray-200 focus:shadow-br ' +
          (isSelected
            ? 'bg-gray-200 shadow-br-inset rounded px-2 py-1'
            : 'hover:bg-gray-200 hover:shadow-br rounded px-2 py-1 ')
        }
      >
        {project.name}
      </Link>
    )
  })

  return (
    <div className="w-48 bg-gray-50 border border-gray-900 rounded shadow-br divide-y divide-gray-900">
      {/* rename, remove project */}
      <div className="px-1 py-2">
        <div className="flex space-x-1">
          <input
            type="text"
            value={state.context.value}
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
        <div className="flex flex-col">{projectMonthPageLinks}</div>
      </div>
    </div>
  )
}
