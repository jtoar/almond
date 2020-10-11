export const schema = gql`
  type Day {
    id: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    project: Project!
    projectName: String!
    date: DateTime!
    hasEntry: Boolean!
    notes: String!
  }

  type Query {
    days: [Day!]!
    day(id: Int!): Day
  }

  input CreateDayInput {
    projectName: String!
    date: DateTime!
    hasEntry: Boolean!
    notes: String!
  }

  input UpdateDayInput {
    projectName: String
    date: DateTime
    hasEntry: Boolean
    notes: String
  }

  type Mutation {
    createDay(input: CreateDayInput!): Day!
    updateDay(id: Int!, input: UpdateDayInput!): Day!
    deleteDay(id: Int!): Day!
  }
`
