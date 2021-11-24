import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'
import Home from './Home'
import Login from './Login'

const Pages = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/"><Home /></Route>
        <Route exact path="/login"><Login /></Route>

        {/* Not Found */}
        <Route path="*">404 Not Found</Route>
      </Switch>
    </Router>
  )
}
export default Pages
