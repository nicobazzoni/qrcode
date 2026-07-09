import React, { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
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

    file: ({ value }) => {
      if (!value?.asset?._ref) return null

      const match = value.asset._ref.match(/^file-(.+)-(\w+)$/)
      if (!match) return null

      const id = match[1]
      const extension = match[2]
      const fileUrl = `https://cdn.sanity.io/files/kb6bkho8/production/${id}.${extension}`

      return (
        <div className="my-6 rounded border p-4">
          <p className="font-semibold">Attached file:</p>
          <a
            href={fileUrl}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 underline"
          >
            Open PDF / File
          </a>
        </div>
      )
    },
  },
}

const EquipmentDetail = () => {
  const { slug } = useParams()
  const [data, setData] = useState(undefined)

  useEffect(() => {
    client
      .fetch(
        `*[_type == "equipmentPage" && slug.current == $slug][0]{
          _id,
          title,
          "slug": slug.current,
          status,
          location,
          department,
          contactName,
          contactEmail,
          quickInstructions,
          detailedNotes,
          manualUrl,
          manualLabel,
          lastUpdatedAt,
          lastUpdatedBy,
          body
        }`,
        { slug },
      )
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

  const statusLabel = {
    active: "Active",
    "needs-attention": "Needs Attention",
    "out-of-service": "Out of Service",
    "in-storage": "In Storage",
  }[data.status || "active"]

  const statusClass = {
    active: "bg-emerald-100 text-emerald-800 ring-emerald-200",
    "needs-attention": "bg-amber-100 text-amber-900 ring-amber-200",
    "out-of-service": "bg-rose-100 text-rose-800 ring-rose-200",
    "in-storage": "bg-slate-100 text-slate-700 ring-slate-200",
  }[data.status || "active"]

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100">
      <div className="mx-auto mb-4 flex max-w-4xl flex-wrap items-center justify-between gap-3">
        <Link className="text-sm font-semibold text-cyan-200 underline" to="/equipment">
          ← All QR Codes
        </Link>
        <Link
          className="rounded-xl bg-cyan-400 px-4 py-2 text-sm font-bold text-slate-950"
          to="/equipment/new"
        >
          + Create
        </Link>
      </div>

      <article className="mx-auto max-w-4xl overflow-hidden rounded-[2rem] border border-slate-800 bg-white text-slate-950 shadow-2xl shadow-cyan-950/30">
        <header className="bg-gradient-to-br from-cyan-500 to-blue-700 p-8 text-white">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-100">
                Equipment Info
              </p>
              <h1 className="mt-3 text-4xl font-bold">{data.title}</h1>
            </div>
            <span className={`rounded-full px-4 py-2 text-sm font-bold ring-1 ${statusClass}`}>
              {statusLabel}
            </span>
          </div>
        </header>

        <section className="grid gap-4 border-b border-slate-200 p-6 md:grid-cols-3">
          <InfoTile label="Location" value={data.location} />
          <InfoTile label="Department" value={data.department} />
          <InfoTile
            label="Contact"
            value={
              data.contactEmail
                ? `${data.contactName || "Contact"} · ${data.contactEmail}`
                : data.contactName
            }
          />
        </section>

        {data.quickInstructions && (
          <section className="border-b border-slate-200 bg-cyan-50 p-6">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-900">
              Quick Instructions
            </h2>
            <p className="mt-3 whitespace-pre-wrap text-lg leading-8 text-slate-800">
              {data.quickInstructions}
            </p>
          </section>
        )}

        {(data.detailedNotes || data.manualUrl) && (
          <section className="grid gap-4 border-b border-slate-200 p-6 md:grid-cols-2">
            {data.detailedNotes && (
              <div className="rounded-2xl bg-slate-100 p-5">
                <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-600">
                  Detailed Notes
                </h2>
                <p className="mt-3 whitespace-pre-wrap leading-7 text-slate-800">
                  {data.detailedNotes}
                </p>
              </div>
            )}

            {data.manualUrl && (
              <div className="rounded-2xl bg-blue-50 p-5">
                <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-blue-800">
                  Manual / Document
                </h2>
                <a
                  className="mt-3 inline-flex rounded-xl bg-blue-700 px-4 py-3 font-bold text-white"
                  href={data.manualUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {data.manualLabel || "Open document"}
                </a>
              </div>
            )}
          </section>
        )}

        <section className="prose prose-slate max-w-none p-6">
          {data.body && <PortableText value={data.body} components={components} />}
        </section>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
          <span>
            Last updated{" "}
            {data.lastUpdatedAt
              ? new Date(data.lastUpdatedAt).toLocaleString()
              : "not recorded"}
            {data.lastUpdatedBy ? ` by ${data.lastUpdatedBy}` : ""}
          </span>
          <Link className="font-semibold text-cyan-700 underline" to={`/equipment/${slug}/edit`}>
            Edit this page
          </Link>
        </footer>
      </article>
    </main>
  )
}

const InfoTile = ({ label, value }) => (
  <div className="rounded-2xl bg-slate-100 p-4">
    <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">{label}</p>
    <p className="mt-2 text-lg font-semibold text-slate-900">{value || "Not set"}</p>
  </div>
)

export default EquipmentDetail
