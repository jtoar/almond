import { Redirect, routes } from '@redwoodjs/router'

const HomePage = () => {
  return (
    <Redirect
      to={routes.projectMonth({ project: 'redwood', month: 'october' })}
    />
  )
}

export default HomePage
