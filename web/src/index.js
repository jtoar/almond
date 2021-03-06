import ReactDOM from 'react-dom'
import { RedwoodProvider, FatalErrorBoundary } from '@redwoodjs/web'
import FatalErrorPage from 'src/pages/FatalErrorPage'

import Routes from 'src/Routes'

import './index.css'

import cache from './cache.js'

ReactDOM.render(
  <FatalErrorBoundary page={FatalErrorPage}>
    <RedwoodProvider graphQLClientConfig={{ cache }}>
      <Routes />
    </RedwoodProvider>
  </FatalErrorBoundary>,
  document.getElementById('redwood-app')
)
