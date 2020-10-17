import { InMemoryCache } from '@apollo/client'

export default new InMemoryCache({
  typePolicies: {
    Day: {
      keyFields: ['projectName', 'date'],
    },
    Mutation: {
      fields: {
        createDay: {
          merge(_, incoming, { cache, variables: { project } }) {
            cache.modify({
              fields: {
                daysByProjectMonth(existing, { storeFieldName }) {
                  if (storeFieldName.includes(project)) {
                    return [...existing, incoming]
                  }
                },
              },
            })
            return incoming
          },
        },
        createDayWithNotes: {
          merge(_, incoming, { cache, variables: { project } }) {
            cache.modify({
              fields: {
                daysByProjectMonth(existing, { storeFieldName }) {
                  if (storeFieldName.includes(project)) {
                    return [...existing, incoming]
                  }
                },
              },
            })
            return incoming
          },
        },
        createProject: {
          merge(_, incoming, { cache }) {
            cache.modify({
              fields: {
                projects(existing) {
                  return [...existing, incoming]
                },
              },
            })
            return incoming
          },
        },
      },
    },
  },
})
