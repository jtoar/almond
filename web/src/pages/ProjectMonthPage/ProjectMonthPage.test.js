import { render } from '@redwoodjs/testing'

import ProjectMonthPage from './ProjectMonthPage'

describe('ProjectMonthPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ProjectMonthPage project="42" />)
    }).not.toThrow()
  })
})
