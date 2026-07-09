import React from "react"

export const statuses = [
  { label: "Active", value: "active" },
  { label: "Needs Attention", value: "needs-attention" },
  { label: "Out of Service", value: "out-of-service" },
  { label: "In Storage", value: "in-storage" },
]

const EquipmentForm = ({
  form,
  onChange,
  onSubmit,
  canSubmit,
  submitLabel,
  submittingLabel,
  submitting,
  showSlug = false,
}) => {
  const updateField = (field) => (event) => {
    onChange((current) => ({ ...current, [field]: event.target.value }))
  }

  return (
    <form
      className="mx-auto max-w-3xl rounded-[2rem] border border-slate-800 bg-white p-6 text-slate-950 shadow-2xl shadow-cyan-950/30"
      onSubmit={onSubmit}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <TextField label="Title" value={form.title} onChange={updateField("title")} required />

        {showSlug && (
          <TextField
            label="QR URL Name"
            value={form.slug}
            onChange={updateField("slug")}
            placeholder="studio-a-light-board"
            required
          />
        )}

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

      <label className="mt-4 block">
        <span className="text-sm font-semibold text-slate-700">Detailed Notes</span>
        <textarea
          className="mt-1 min-h-48 w-full rounded-xl border border-slate-300 p-3"
          value={form.detailedNotes}
          onChange={updateField("detailedNotes")}
          placeholder="Longer setup steps, known issues, storage instructions, replacement notes, etc."
        />
      </label>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <TextField
          label="Manual / Document URL"
          type="url"
          value={form.manualUrl}
          onChange={updateField("manualUrl")}
          placeholder="https://..."
        />
        <TextField
          label="Manual / Document Label"
          value={form.manualLabel}
          onChange={updateField("manualLabel")}
          placeholder="Open manual"
        />
      </div>

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
        disabled={!canSubmit}
        type="submit"
      >
        {submitting ? submittingLabel : submitLabel}
      </button>
    </form>
  )
}

const TextField = ({ label, type = "text", ...props }) => (
  <label className="block">
    <span className="text-sm font-semibold text-slate-700">{label}</span>
    <input className="mt-1 w-full rounded-xl border border-slate-300 p-3" type={type} {...props} />
  </label>
)

export default EquipmentForm
