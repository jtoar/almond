import { render } from '@redwoodjs/testing'

import ProjectMonthCalendar from './ProjectMonthCalendar'

describe('ProjectMonthCalendar', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ProjectMonthCalendar />)
    }).not.toThrow()
  })
})
