import { Link, routes } from '@redwoodjs/router'

export const QUERY = gql`
  query ProjectsQuery {
    projects {
      id
      createdAt
      updatedAt
      name
      noOfDaysHasEntry
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }) => <div>Error: {error.message}</div>

export const Success = ({ projects, month }) => {
  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'j':
        e.stopPropagation()
        e.target.nextElementSibling?.focus()
        break
      case 'k':
        e.stopPropagation()
        e.target.previousElementSibling?.focus()
        break
    }
  }

  const projectMonthPageLinks = projects.map((project) => {
    return (
      <li key={project.id} onKeyDown={handleKeyDown} tabIndex="0">
        <Link to={routes.projectMonth({ project: project.name, month })}>
          {project.name + ' '}
          <span className="bg-red-500 rounded shadow-kp px-2 py-1">
            {project.noOfDaysHasEntry}
          </span>
        </Link>
      </li>
    )
  })

  return (
    <ul className="px-4 py-2 space-y-2 font-mono tracking-tight">
      {projectMonthPageLinks}
    </ul>
  )
}
