import { render } from '@redwoodjs/testing'

import Day from './Day'

describe('Day', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Day />)
    }).not.toThrow()
  })
})
