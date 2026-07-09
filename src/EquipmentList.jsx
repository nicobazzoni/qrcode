// src/components/EquipmentList.jsx
import React, { useEffect, useState } from "react"
import { client } from "./sanityClient"
import { QRCodeCanvas } from "qrcode.react"

const EquipmentList = () => {
  const [pages, setPages] = useState([])

  useEffect(() => {
    client
      .fetch(`*[_type == "equipmentPage"] | order(title asc){title, "slug": slug.current}`)
      .then(setPages)
      .catch(console.error)
  }, [])

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
      <section className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
            QR Directory
          </p>
          <h1 className="mt-3 text-4xl font-bold">Equipment QR Codes</h1>
          <p className="mt-3 max-w-2xl text-slate-300">
            Print these codes once. The equipment page behind each code can be
            updated later without reprinting the QR label.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {pages.map((page) => {
            const url = `https://qrcode-phi-silk.vercel.app/equipment/${page.slug}`

            return (
              <article
                key={page.slug}
                className="rounded-3xl border border-slate-800 bg-white p-5 text-slate-950 shadow-2xl shadow-cyan-950/30"
              >
                <div className="flex justify-center rounded-2xl bg-slate-50 p-4">
                  <QRCodeCanvas value={url} size={180} />
                </div>
                <h2 className="mt-5 text-xl font-semibold">{page.title}</h2>
                <a
                  className="mt-2 block break-all text-sm text-cyan-700 underline"
                  href={`/equipment/${page.slug}`}
                >
                  {url}
                </a>
              </article>
            )
          })}
        </div>
      </section>
    </main>
  )
}

export default EquipmentList
