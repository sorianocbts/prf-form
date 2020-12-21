import { React } from 'react'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import './styles.css';
import MyNav from './components/MyNav';
import PRF from './components/PRF';


const App = () => {
  return (
    <Router>
      <MyNav />
      <Switch>
        <Route exact path="/">
          <PRF />
        </Route>
      </Switch>
    </Router>
  )
}

export default App;