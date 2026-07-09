import { createClient } from "@sanity/client"

const allowedStatuses = new Set([
  "active",
  "needs-attention",
  "out-of-service",
  "in-storage",
])

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || "kb6bkho8",
  dataset: process.env.SANITY_DATASET || "production",
  apiVersion: "2023-01-01",
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
})

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  if (!process.env.EDIT_PASSWORD) {
    return res.status(500).json({ error: "EDIT_PASSWORD is not configured" })
  }

  if (!process.env.SANITY_WRITE_TOKEN) {
    return res.status(500).json({ error: "SANITY_WRITE_TOKEN is not configured" })
  }

  const {
    slug,
    password,
    title,
    status = "active",
    location = "",
    department = "",
    contactName = "",
    contactEmail = "",
    quickInstructions = "",
    detailedNotes = "",
    manualUrl = "",
    manualLabel = "",
    updatedBy = "",
  } = req.body || {}

  if (password !== process.env.EDIT_PASSWORD) {
    return res.status(401).json({ error: "Incorrect edit password" })
  }

  if (!slug || !title?.trim()) {
    return res.status(400).json({ error: "Missing required equipment fields" })
  }

  if (!allowedStatuses.has(status)) {
    return res.status(400).json({ error: "Invalid equipment status" })
  }

  const existing = await client.fetch(
    `*[_type == "equipmentPage" && slug.current == $slug][0]{_id}`,
    { slug },
  )

  if (!existing?._id) {
    return res.status(404).json({ error: "Equipment page not found" })
  }

  const updatedDocument = await client
    .patch(existing._id)
    .set({
      title: title.trim(),
      status,
      location: location.trim(),
      department: department.trim(),
      contactName: contactName.trim(),
      contactEmail: contactEmail.trim(),
      quickInstructions: quickInstructions.trim(),
      detailedNotes: detailedNotes.trim(),
      manualUrl: manualUrl.trim(),
      manualLabel: manualLabel.trim(),
      lastUpdatedBy: updatedBy.trim(),
      lastUpdatedAt: new Date().toISOString(),
    })
    .commit()

  return res.status(200).json({
    ok: true,
    id: updatedDocument._id,
  })
}
