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
    project(id: Int!): Project
  }

  input CreateProjectInput {
    name: String!
  }

  input UpdateProjectInput {
    name: String
  }

  type Mutation {
    createProject(input: CreateProjectInput!): Project!
    updateProject(id: Int!, input: UpdateProjectInput!): Project!
    deleteProject(id: Int!): Project!
  }
`
