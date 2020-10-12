export const schema = gql`
  type Day {
    createdAt: DateTime!
    updatedAt: DateTime!
    project: Project!
    projectName: String!
    date: DateTime!
    hasEntry: Boolean!
    notes: String!
  }

  type Query {
    days(project: String!, month: String!): [Day!]!
    day(projectName: String!, date: DateTime!): Day
  }

  input CreateDayInput {
    projectName: String!
    date: DateTime!
    hasEntry: Boolean
    notes: String
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
