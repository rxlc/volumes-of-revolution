import React from 'react'

import ThreeScene from './ThreeScene'

import Inputs from './Components/Inputs'
import Materials from './Components/Materials'

function App() {

  return (
    <div className="App" style={{display: "flex", flexDirection: "column-reverse", width: window.innerWidth, height: window.innerHeight}}>
      <Inputs/>
      <Materials/>
      <ThreeScene/>
    </div>
  )
}

export default App
