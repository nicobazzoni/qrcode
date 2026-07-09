import React, { useEffect, useMemo, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { client } from "./sanityClient"

const statuses = [
  { label: "Active", value: "active" },
  { label: "Needs Attention", value: "needs-attention" },
  { label: "Out of Service", value: "out-of-service" },
  { label: "In Storage", value: "in-storage" },
]

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

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }))
  }

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
      <form
        className="mx-auto max-w-3xl rounded-[2rem] border border-slate-800 bg-white p-6 text-slate-950 shadow-2xl shadow-cyan-950/30"
        onSubmit={handleSubmit}
      >
        <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-700">
              Edit QR Metadata
            </p>
            <h1 className="mt-2 text-3xl font-bold">{form.title || slug}</h1>
          </div>
          <Link className="font-semibold text-cyan-700 underline" to={`/equipment/${slug}`}>
            View page
          </Link>
        </div>

        {error && <p className="mb-4 rounded-xl bg-rose-100 p-3 text-rose-800">{error}</p>}
        {message && <p className="mb-4 rounded-xl bg-emerald-100 p-3 text-emerald-800">{message}</p>}

        <div className="grid gap-4 md:grid-cols-2">
          <TextField label="Title" value={form.title} onChange={updateField("title")} required />

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Status</span>
            <select
              className="mt-1 w-full rounded-xl border border-slate-300 p-3"
              value={form.status}
              onChange={updateField("status")}
            >
              {statuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </label>

          <TextField label="Location" value={form.location} onChange={updateField("location")} />
          <TextField label="Department" value={form.department} onChange={updateField("department")} />
          <TextField label="Contact Name" value={form.contactName} onChange={updateField("contactName")} />
          <TextField label="Contact Email" type="email" value={form.contactEmail} onChange={updateField("contactEmail")} />
        </div>

        <label className="mt-4 block">
          <span className="text-sm font-semibold text-slate-700">Quick Instructions</span>
          <textarea
            className="mt-1 min-h-32 w-full rounded-xl border border-slate-300 p-3"
            value={form.quickInstructions}
            onChange={updateField("quickInstructions")}
            placeholder="Short operational notes, troubleshooting, or who to call."
          />
        </label>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <TextField label="Updated By" value={form.updatedBy} onChange={updateField("updatedBy")} />
          <TextField
            label="Edit Password"
            type="password"
            value={form.password}
            onChange={updateField("password")}
            required
          />
        </div>

        <button
          className="mt-6 rounded-2xl bg-cyan-600 px-6 py-3 font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-400"
          disabled={!canSave}
          type="submit"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
      </form>
    </main>
  )
}

const TextField = ({ label, type = "text", ...props }) => (
  <label className="block">
    <span className="text-sm font-semibold text-slate-700">{label}</span>
    <input className="mt-1 w-full rounded-xl border border-slate-300 p-3" type={type} {...props} />
  </label>
)

export default EquipmentEdit
