import { InMemoryCache } from '@apollo/client'

export default new InMemoryCache({
  typePolicies: {
    Day: {
      keyFields: ['projectName', 'date'],
    },
  },
})
