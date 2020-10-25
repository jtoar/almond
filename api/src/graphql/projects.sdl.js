export const schema = gql`
  type Project {
    id: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    name: String!
    days: [Day]!
  }

  type Query {
    projects: [Project!]!
  }

  type Mutation {
    createProject(name: String!): Project!
    updateProjectNameByName(name: String!, newName: String!): Project!
    deleteProjectByName(name: String!): Project!
  }
`
