import { render } from '@redwoodjs/testing'

import ScratchPage from './ScratchPage'

describe('ScratchPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ScratchPage />)
    }).not.toThrow()
  })
})
