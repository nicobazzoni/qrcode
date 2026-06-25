import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { PortableText } from "@portabletext/react"
import imageUrlBuilder from "@sanity/image-url"
import { client } from "./sanityClient"

const builder = imageUrlBuilder(client)

function urlFor(source) {
  return builder.image(source)
}

const components = {
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null

      return (
        <img
          src={urlFor(value).width(1000).url()}
          alt={value.alt || ""}
          className="my-6 max-w-full rounded"
        />
      )
    },
  },
}

const EquipmentDetail = () => {
  const { slug } = useParams()
  const [data, setData] = useState(undefined)

  useEffect(() => {
    client
      .fetch(`*[_type == "equipmentPage" && slug.current == $slug][0]`, { slug })
      .then((doc) => {
        console.log("Fetched equipment page:", doc)
        setData(doc || null)
      })
      .catch((err) => {
        console.error("Sanity fetch error:", err)
        setData(null)
      })
  }, [slug])

  if (data === undefined) return <p className="p-6">Loading...</p>
  if (data === null) return <p className="p-6">No equipment page found for: {slug}</p>

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{data.title}</h1>

      {data.body && (
        <PortableText value={data.body} components={components} />
      )}
    </div>
  )
}

export default EquipmentDetail