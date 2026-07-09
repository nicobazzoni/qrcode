import React from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import EquipmentList from "./EquipmentList"
import EquipmentDetail from "./EquipmentDetail"
import EquipmentEdit from "./EquipmentEdit"
import EquipmentCreate from "./EquipmentCreate"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/equipment" replace />} />
        <Route path="/equipment" element={<EquipmentList />} />
        <Route path="/equipment/new" element={<EquipmentCreate />} />
        <Route path="/equipment/:slug" element={<EquipmentDetail />} />
        <Route path="/equipment/:slug/edit" element={<EquipmentEdit />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
