import type { ErrorCodeRegistry } from "@/types"

function buildMailBody(error: ErrorCodeRegistry) {
  return [
    `Bonjour,`,
    ``,
    `Une action est requise sur le code ${error.code}.`,
    ``,
    `Nom : ${error.nom}`,
    `Type : ${error.type}`,
    `Catégorie : ${error.categorie}`,
    `Priorité : ${error.priorite}`,
    `Statut : ${error.statut}`,
    ``,
    `Description :`,
    error.description,
    ``,
    `Cause possible :`,
    error.causePossible,
    ``,
    `Solution attendue :`,
    error.solution,
    ``,
    `Responsable identifié : ${error.responsable}`,
  ].join("\n")
}

export function buildErrorMailto(error: ErrorCodeRegistry) {
  const subject = `[${error.code}] ${error.nom} - correction requise`
  const body = buildMailBody(error)

  return `mailto:${error.responsable}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`
}
