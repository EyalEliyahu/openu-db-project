import React from 'react';
import './App.css';
import { ResponsiveAppBar } from './components/ResponsiveAppBar/ResponsiveAppBar';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { WordsPage } from './pages/WordsPage/WordsPage';
import { FilesPage } from 'pages/FilesPage/FilesPage';

function App() {
  return (
    <div className="App">
      <Router>
        <ResponsiveAppBar/>
        <Switch>
          <Route exact path="/">
            <WordsPage/>
          </Route>
          <Route path="/files">
            <FilesPage/>
          </Route>
          <Route path="/dashboard">
          </Route>
        </Switch>
        
      </Router>
    </div>
  );
}

export default App;
