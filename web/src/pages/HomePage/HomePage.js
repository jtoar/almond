import { Redirect, routes } from '@redwoodjs/router'
import { getCurrentMonth } from 'src/lib/date'

const HomePage = () => {
  return (
    <Redirect
      to={routes.projectMonth({ project: 'hello', month: getCurrentMonth() })}
    />
  )
}

export default HomePage
