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
    daysByProjectMonth(project: String!, month: String!): [Day!]!
  }

  type Mutation {
    createDay(project: String!, date: DateTime!): Day!
    createDayWithNotes(project: String!, date: DateTime!, notes: String!): Day!
    toggleHasEntry(project: String!, date: DateTime!): Day!
    updateNotes(project: String!, date: DateTime!, notes: String!): Day!
  }
`
