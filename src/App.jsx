import React from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import EquipmentList from "./EquipmentList"
import EquipmentDetail from "./EquipmentDetail"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/equipment" replace />} />
        <Route path="/equipment" element={<EquipmentList />} />
        <Route path="/equipment/:slug" element={<EquipmentDetail />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App