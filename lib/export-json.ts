import type { ErrorCodeRegistry } from "@/types"

export function buildJsonFileName(csvFileName: string) {
  const baseName = csvFileName.replace(/\.csv$/i, "")
  return `${baseName || "codes-erreurs"}.json`
}

export function downloadRecordsAsJson(
  records: ErrorCodeRegistry[],
  fileName: string
) {
  const blob = new Blob([JSON.stringify(records, null, 2)], {
    type: "application/json",
  })
  const url = URL.createObjectURL(blob)

  const link = document.createElement("a")
  link.href = url
  link.download = fileName
  link.click()

  URL.revokeObjectURL(url)
}
