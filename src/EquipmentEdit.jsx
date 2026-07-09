import React, { useEffect, useMemo, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { client } from "./sanityClient"
import EquipmentForm from "./EquipmentForm"

const emptyForm = {
  title: "",
  status: "active",
  location: "",
  department: "",
  contactName: "",
  contactEmail: "",
  quickInstructions: "",
  updatedBy: "",
  password: "",
}

const EquipmentEdit = () => {
  const { slug } = useParams()
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const canSave = useMemo(
    () => form.title.trim() && form.password.trim() && !saving,
    [form.password, form.title, saving],
  )

  useEffect(() => {
    client
      .fetch(
        `*[_type == "equipmentPage" && slug.current == $slug][0]{
          title,
          status,
          location,
          department,
          contactName,
          contactEmail,
          quickInstructions
        }`,
        { slug },
      )
      .then((doc) => {
        if (!doc) {
          setError(`No equipment page found for ${slug}`)
          return
        }

        setForm((current) => ({
          ...current,
          title: doc.title || "",
          status: doc.status || "active",
          location: doc.location || "",
          department: doc.department || "",
          contactName: doc.contactName || "",
          contactEmail: doc.contactEmail || "",
          quickInstructions: doc.quickInstructions || "",
        }))
      })
      .catch((err) => {
        console.error("Sanity fetch error:", err)
        setError("Could not load this equipment page.")
      })
      .finally(() => setLoading(false))
  }, [slug])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError("")
    setMessage("")

    try {
      const response = await fetch("/api/update-equipment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, ...form }),
      })

      const result = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(result.error || "Could not save equipment page.")
      }

      setMessage("Saved. The printed QR code now points to this updated information.")
      setForm((current) => ({ ...current, password: "" }))
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="p-6">Loading editor...</p>

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100">
      <div className="mx-auto mb-4 flex max-w-3xl flex-wrap items-center justify-between gap-3">
        <Link className="text-sm font-semibold text-cyan-200 underline" to="/equipment">
          ← All QR Codes
        </Link>
        <Link className="text-sm font-semibold text-cyan-200 underline" to={`/equipment/${slug}`}>
          View page
        </Link>
      </div>

      <section className="mx-auto mb-5 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
          Edit QR Metadata
        </p>
        <h1 className="mt-2 text-3xl font-bold">{form.title || slug}</h1>
      </section>

      {error && <p className="mx-auto mb-4 max-w-3xl rounded-xl bg-rose-100 p-3 text-rose-800">{error}</p>}
      {message && <p className="mx-auto mb-4 max-w-3xl rounded-xl bg-emerald-100 p-3 text-emerald-800">{message}</p>}

      <EquipmentForm
        canSubmit={canSave}
        form={form}
        onChange={setForm}
        onSubmit={handleSubmit}
        submitLabel="Save changes"
        submitting={saving}
        submittingLabel="Saving..."
      />
    </main>
  )
}

export default EquipmentEdit
