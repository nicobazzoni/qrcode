import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import React from 'react'
import EncoderForm from './Encoder'
import EncoderDetail from './EncoderDetail'
function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<EncoderForm />} />
        <Route path="/encoder" element={<EncoderForm />} />
        <Route path="/:slug" element={<EncoderDetail />} />
      </Routes>
    </Router>
  )
}

export default App