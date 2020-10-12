import { Link, routes } from '@redwoodjs/router'

const ScratchPage = () => {
  return (
    <>
      <h1>ScratchPage</h1>
      <p>
        Find me in <tt>./web/src/pages/ScratchPage/ScratchPage.js</tt>
      </p>
      <p>
        My default route is named <tt>scratch</tt>, link to me with `
        <Link to={routes.scratch()}>Scratch</Link>`
      </p>
    </>
  )
}

export default ScratchPage
