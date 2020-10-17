import { Link, routes } from '@redwoodjs/router'

export const QUERY = gql`
  query ProjectsQuery {
    projects {
      id
      createdAt
      updatedAt
      name
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }) => <div>Error: {error.message}</div>

export const Success = ({ projects }) => {
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
      <Link
        key={project.id}
        to={routes.projectMonth({
          project: project.name,
          month: Intl.DateTimeFormat('en-US', { month: 'long' })
            .format(new Date())
            .toLowerCase(),
        })}
        onKeyDown={handleKeyDown}
      >
        {project.name}
      </Link>
    )
  })

  return (
    <div className="flex flex-col px-4 py-2 space-y-2 font-mono tracking-tight">
      {projectMonthPageLinks}
    </div>
  )
}
