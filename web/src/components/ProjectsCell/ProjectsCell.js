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

export const Success = ({ projects, selected }) => {
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
    const isSelected = project.name === selected
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
        className={
          isSelected
            ? 'bg-gray-200 shadow-br-inset rounded px-2 py-1'
            : 'hover:bg-gray-200 hover:shadow-br rounded px-2 py-1'
        }
      >
        {project.name}
      </Link>
    )
  })

  return <div className="flex flex-col">{projectMonthPageLinks}</div>
}
