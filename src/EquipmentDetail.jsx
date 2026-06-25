// src/components/EquipmentDetail.jsx
import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { PortableText } from "@portabletext/react"
import { client } from "./sanityClient"

const EquipmentDetail = () => {
  const { slug } = useParams()
  const [data, setData] = useState(null)

  useEffect(() => {
    client
      .fetch(`*[_type == "equipmentPage" && slug.current == $slug][0]`, { slug })
      .then(setData)
      .catch(console.error)
  }, [slug])

  if (!data) return <p>Loading...</p>

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{data.title}</h1>

      {data.body && <PortableText value={data.body} />}
    </div>
  )
}

export default EquipmentDetail