import React, { useMemo, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import EquipmentForm from "./EquipmentForm"

const emptyForm = {
  title: "",
  slug: "",
  status: "active",
  location: "",
  department: "",
  contactName: "",
  contactEmail: "",
  quickInstructions: "",
  updatedBy: "",
  password: "",
}

const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

const EquipmentCreate = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const canCreate = useMemo(
    () => form.title.trim() && form.slug.trim() && form.password.trim() && !saving,
    [form.password, form.slug, form.title, saving],
  )

  const setFormWithSlugFallback = (updater) => {
    setForm((current) => {
      const next = typeof updater === "function" ? updater(current) : updater
      if (next.title !== current.title && !current.slug.trim()) {
        return { ...next, slug: slugify(next.title) }
      }
      return { ...next, slug: slugify(next.slug) }
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError("")
    setMessage("")

    try {
      const response = await fetch("/api/create-equipment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, slug: slugify(form.slug) }),
      })

      const result = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(result.error || "Could not create equipment page.")
      }

      setMessage("Created. Redirecting to the new QR page.")
      setTimeout(() => navigate(`/equipment/${result.slug}`), 600)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100">
      <div className="mx-auto mb-4 max-w-3xl">
        <Link className="text-sm font-semibold text-cyan-200 underline" to="/equipment">
          ← All QR Codes
        </Link>
      </div>

      <section className="mx-auto mb-5 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
          Create QR Page
        </p>
        <h1 className="mt-2 text-3xl font-bold">New equipment page</h1>
        <p className="mt-2 text-slate-300">
          Choose a stable QR URL name. Once printed, keep that slug unchanged.
        </p>
      </section>

      {error && <p className="mx-auto mb-4 max-w-3xl rounded-xl bg-rose-100 p-3 text-rose-800">{error}</p>}
      {message && <p className="mx-auto mb-4 max-w-3xl rounded-xl bg-emerald-100 p-3 text-emerald-800">{message}</p>}

      <EquipmentForm
        canSubmit={canCreate}
        form={form}
        onChange={setFormWithSlugFallback}
        onSubmit={handleSubmit}
        showSlug
        submitLabel="Create QR page"
        submitting={saving}
        submittingLabel="Creating..."
      />
    </main>
  )
}

export default EquipmentCreate
