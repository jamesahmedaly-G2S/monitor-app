export type ErrorStatus = "Actif" | "Obsolète" | "En Révision"

export type ErrorPriority = "Basse" | "Moyenne" | "Haute" | "Critique"

export interface ErrorCodeRegistry {
  code: string
  type: string
  categorie: string
  sousCategorieDsn: string
  nom: string
  description: string
  causePossible: string
  solution: string
  responsable: string
  exemple: string
  liens: string
  statut: ErrorStatus
  priorite: ErrorPriority
  dateAjout: string
  derniereMiseAJour: string
  commentaireG2sCortex?: string
  familleInes?: string
  prioriteInes?: string
  dimensionInes?: string
  scoreMax?: number
  anomalieInes?: string
  codeInes?: string
}
