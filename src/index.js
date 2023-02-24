import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

import "./App.css"

import { ExperienceProvider } from "./Contexts/ExperienceContext";

ReactDOM.render(
  <React.StrictMode>
    <ExperienceProvider>
      <App />
    </ExperienceProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
