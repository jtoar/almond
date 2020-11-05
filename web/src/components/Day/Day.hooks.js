import { useApolloClient } from '@redwoodjs/web'
import { createMachine, assign } from 'xstate'
import { useMachine } from '@xstate/react'

export const useDayMachine = ({ project, date, hasEntry }) => {
  const [state, send] = useMachine(
    dayMachine({ project, date, hasEntry, client: useApolloClient() })
  )

  return [state, send]
}

const dayMachine = ({ project, date, hasEntry, client }) =>
  createMachine(
    {
      id: 'day',
      initial: 'active',
      context: {
        project,
        date,
        hasEntry,
        client,
      },
      states: {
        active: {
          on: {
            TOGGLE: {
              actions: ['toggle', 'mutate'],
            },
          },
        },
      },
    },
    {
      actions: {
        toggle: assign({
          hasEntry: (context) => !context.hasEntry,
        }),
        mutate: ({ project, date, client }) => {
          client.mutate({
            mutation: gql`
              mutation ToggleHasEntry($project: String!, $date: DateTime!) {
                toggleHasEntry(project: $project, date: $date) {
                  projectName
                  date
                }
              }
            `,
            variables: {
              project,
              date,
            },
          })
        },
      },
    }
  )
