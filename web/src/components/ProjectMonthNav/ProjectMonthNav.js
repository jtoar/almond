import { createMachine } from 'xstate'
import { useMachine } from '@xstate/react'

import ProjectsCell from 'src/components/ProjectsCell'

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
          <ProjectsCell currentProject={project} />
        </div>
      ) : null}
    </div>
  )
}

export default ProjectMonthNav

// const CREATE_PROJECT = gql`
//   mutation CreateProjectMutation($name: String!) {
//     createProject(name: $name) {
//       id
//       createdAt
//       updatedAt
//       name
//     }
//   }
// `

// const createProjectMachine = createMachine(
//   {
//     id: 'createProject',
//     initial: 'typing',
//     context: {
//       value: '',
//     },
//     states: {
//       typing: {
//         on: {
//           CHANGE: {
//             actions: ['assignToValue'],
//           },
//           CREATE: {
//             actions: ['createProjectFromValue', 'navigateToValue', 'closeNav'],
//           },
//         },
//       },
//     },
//   },
//   {
//     actions: {
//       assignToValue: assign((context, event) => {
//         context.value = event.value
//       }),
//       navigateToValue: ({ value }) =>
//         navigate(
//           routes.projectMonth({
//             project: value,
//             month: getCurrentMonth(),
//           })
//         ),
//     },
//   }
// )

// const CreateProject = ({ closeNav }) => {
//   const [createProject] = useMutation(CREATE_PROJECT)
//   const [current, send] = useMachine(createProjectMachine, {
//     actions: {
//       createProjectFromValue: (context) => {
//         createProject({ variables: { name: context.value } })
//       },
//       closeNav,
//     },
//   })

//   const handleKeyDown = (e) => {
//     switch (e.key) {
//       case 'Enter':
//         if (e.ctrlKey) {
//           send('CREATE')
//         }
//         break
//     }
//   }

//   return (
//     <div className="flex space-x-1">
//       <input
//         type="text"
//         placeholder="project"
//         value={current.context.value}
//         onChange={({ target: { value } }) => send('CHANGE', { value })}
//         autoFocus={true}
//         className="w-full px-2 py-1 focus:bg-gray-200 focus:shadow-br-inset rounded focus:outline-none"
//         onKeyDown={handleKeyDown}
//       />
//       <button
//         className="flex-shrink-0 border border-gray-900 rounded px-2"
//         onClick={() => send('CREATE')}
//       >
//         add +
//       </button>
//     </div>
//   )
// }
