import { InMemoryCache } from '@apollo/client'

export default new InMemoryCache({
  typePolicies: {
    Day: {
      keyFields: ['projectName', 'date'],
    },
    Mutation: {
      fields: {
        createDay: {
          merge(_, incoming, { cache }) {
            cache.modify({
              fields: {
                daysByProjectMonth(existing) {
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
