import { render } from '@redwoodjs/testing'

import ProjectMonthNav from './ProjectMonthNav'

describe('ProjectMonthNav', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ProjectMonthNav />)
    }).not.toThrow()
  })
})
