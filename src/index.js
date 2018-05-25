import React from 'react'
import ReactDOM from 'react-dom'
import registerServiceWorker from './registerServiceWorker'
import './index.css'
import Root from 'Root'
import App from 'containers/App'

ReactDOM.render(<Root component={App} />, document.getElementById('root'))
registerServiceWorker()
