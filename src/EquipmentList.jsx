// src/components/EquipmentList.jsx
import React, { useEffect, useState } from "react"
import { client } from "./sanityClient"
import { QRCodeCanvas } from "qrcode.react"

const EquipmentList = () => {
  const [pages, setPages] = useState([])

  useEffect(() => {
    client
      .fetch(`*[_type == "equipmentPage"]{title, "slug": slug.current}`)
      .then(setPages)
      .catch(console.error)
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Equipment QR Codes</h1>

      {pages.map((page) => {
        const url = `https://qrcode-phi-silk.vercel.app/equipment/${page.slug}`

        return (
          <div key={page.slug} className="my-8">
            <h2 className="text-xl font-semibold">{page.title}</h2>
            <QRCodeCanvas value={url} />
            <p>{url}</p>
          </div>
        )
      })}
    </div>
  )
}

export default EquipmentList