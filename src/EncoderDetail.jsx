import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { client } from "./sanityClient"

const EncoderDetail = () => {
  const { slug } = useParams()
  const [data, setData] = useState(null)

  useEffect(() => {
    client
      .fetch(`*[_type == "encoder" && slug.current == $slug][0]`, { slug })
      .then((doc) => setData(doc))
      .catch((err) => {
        console.error("Error fetching encoder:", err)
        setData(null)
      })
  }, [slug]) // ✅ fix here

  if (!data) return <p>Loading...</p>

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">Encoder Info</h1>
      <p><strong>IP Address:</strong> {data.ipAddress}</p>
      <p><strong>Port:</strong> {data.port}</p>
      <p><strong>Circuit:</strong> {data.circuit}</p>
      <p><strong>Location:</strong> {data.location}</p>
      <p><strong>Purpose:</strong> {data.purpose}</p>
    </div>
  )
}

export default EncoderDetail