import React from 'react';
import './App.css';
import { ResponsiveAppBar } from './components/ResponsiveAppBar/ResponsiveAppBar';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { WordsPage } from './pages/WordsPage/WordsPage';
import { FilesPage } from 'pages/FilesPage/FilesPage';
import { LabelsAndExpressionsPage } from 'pages/LabelsAndExpressionsPage/LabelsAndExpressionsPage';
import StatisticsPage from 'pages/StatisticsPage/StatisticsPage';

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
          <Route path="/labels_and_expressions">
            <LabelsAndExpressionsPage/>
          </Route>
          <Route path="/statistics">
            <StatisticsPage/>
          </Route>
        </Switch>
        
      </Router>
    </div>
  );
}

export default App;
