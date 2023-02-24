import React from 'react'

import ThreeScene from './ThreeScene'

import Inputs from './Components/Inputs'

function App() {

  return (
    <div className="App" style={{display: "flex", flexDirection: "column-reverse", width: window.innerWidth, height: window.innerHeight}}>
      <Inputs/>
      <ThreeScene/>
    </div>
  )
}

export default App
