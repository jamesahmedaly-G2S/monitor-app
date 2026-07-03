
export type ErrorPriority = "Basse" | "Moyenne" | "Haute" 

export type ErrorType = "ERR" | "WRN" | "ALT"

export type Categorie = "Saisie" | "Paramétrique" 

export type ErrorStatus = "Actif" | "Non actif" | "En cours"

export type ErrorFailleInes = "Salarié" | "DSN" | "Paie" | "Calcul IJSS" | "Cas complexes" | "Recouvrement" | "Charges sociales" | "Subrogation" 

export type ErrorPrioriteInes = "P1" | "P2" | "P3"

export type ErrorDimensionInes = "Salarié" | "Pilotage" | "Financière" | "Risque" | "Charges" 

export interface ErrorCodeRegistry {
  code: string
  type: ErrorType
  categorie: Categorie
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
  familleInes?: ErrorFailleInes
  prioriteInes?: ErrorPrioriteInes
  dimensionInes?: ErrorDimensionInes
  scoreMax?: number
  anomalieInes?: string
  codeInes?: string
}
