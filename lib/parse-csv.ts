import Papa from "papaparse"

import type {
  Categorie,
  ErrorCodeRegistry,
  ErrorDimensionInes,
  ErrorFailleInes,
  ErrorPriority,
  ErrorPrioriteInes,
  ErrorStatus,
  ErrorType,
} from "@/types"

type CsvRow = Record<string, string>

export type CsvParseIssue = {
  row?: number
  field?: string
  message: string
}

export type CsvParseResult = {
  records: ErrorCodeRegistry[]
  issues: CsvParseIssue[]
}

const REQUIRED_HEADERS = [
  "Code",
  "Type",
  "Catégorie",
  "Sous-catégorie (DSN)",
  "Nom",
  "Description",
  "Cause possible",
  "Solution",
  "Responsable",
  "Exemple",
  // "Liens",
  "Statut",
  "Priorité",
  "Date ajout",
  "Dernière mise à jour",
] as const

const ERROR_TYPES: ErrorType[] = ["ERR", "WRN", "ALT"]
const CATEGORIES: Categorie[] = ["Saisie", "Paramétrique"]
const STATUSES: ErrorStatus[] = ["Actif", "Non actif", "En cours"]
const PRIORITIES: ErrorPriority[] = ["Basse", "Moyenne", "Haute"]
const INES_FAMILIES: ErrorFailleInes[] = [
  "Salarié",
  "DSN",
  "Paie",
  "Calcul IJSS",
  "Cas complexes",
  "Recouvrement",
  "Charges sociales",
  "Subrogation",
]
const INES_DIMENSIONS: ErrorDimensionInes[] = [
  "Salarié",
  "Pilotage",
  "Financière",
  "Risque",
  "Charges",
]

function clean(value: string | undefined) {
  return value?.trim() ?? ""
}

function normalize(value: string) {
  return value
    .toLocaleLowerCase("fr-FR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
}

function parseEnum<T extends string>(
  value: string,
  allowed: readonly T[],
  fallback: T
) {
  const normalizedValue = normalize(value)
  return (
    allowed.find((item) => normalize(item) === normalizedValue) ?? fallback
  )
}

function parseDate(value: string | undefined) {
  const cleanedValue = clean(value)
  const serial = Number(cleanedValue)

  if (Number.isFinite(serial) && serial > 0) {
    const excelEpoch = Date.UTC(1899, 11, 30)
    const date = new Date(excelEpoch + serial * 24 * 60 * 60 * 1000)
    return date.toISOString().slice(0, 10)
  }

  return cleanedValue
}

function parseOptionalNumber(value: string | undefined) {
  const normalizedValue = clean(value).replace(",", ".")
  if (!normalizedValue) {
    return undefined
  }

  const parsed = Number(normalizedValue)
  return Number.isFinite(parsed) ? parsed : undefined
}

function isEmptyRow(row: CsvRow) {
  return Object.values(row).every((value) => !clean(value))
}

function missingHeaders(fields: string[] | undefined) {
  const headers = fields ?? []
  return REQUIRED_HEADERS.filter((header) => !headers.includes(header))
}

function parseRow(row: CsvRow, rowIndex: number) {
  const issues: CsvParseIssue[] = []

  for (const header of REQUIRED_HEADERS) {
    if (!clean(row[header])) {
      issues.push({
        row: rowIndex,
        field: header,
        message: `Le champ "${header}" est obligatoire.`,
      })
    }
  }

  if (issues.length > 0) {
    return { issues }
  }

  const record: ErrorCodeRegistry = {
    code: clean(row.Code),
    type: parseEnum(clean(row.Type), ERROR_TYPES, "ERR"),
    categorie: parseEnum(clean(row["Catégorie"]), CATEGORIES, "Saisie"),
    sousCategorieDsn: clean(row["Sous-catégorie (DSN)"]),
    nom: clean(row.Nom),
    description: clean(row.Description),
    causePossible: clean(row["Cause possible"]),
    solution: clean(row.Solution),
    responsable: clean(row.Responsable),
    exemple: clean(row.Exemple),
    liens: clean(row.Liens),
    statut: parseEnum(clean(row.Statut), STATUSES, "Non actif"),
    priorite: parseEnum(clean(row["Priorité"]), PRIORITIES, "Moyenne"),
    dateAjout: parseDate(row["Date ajout"]),
    derniereMiseAJour: parseDate(row["Dernière mise à jour"]),
    commentaireG2sCortex: clean(row["commentaire G2S Cortex"]) || undefined,
    scoreMax: parseOptionalNumber(row["Score max"]),
    anomalieInes: clean(row["Anomalie INES"]) || undefined,
    codeInes: clean(row["Code INES"]) || undefined,
  }

  const familleInes = clean(row["Famille INES"])
  if (familleInes) {
    record.familleInes = parseEnum(familleInes, INES_FAMILIES, "Salarié")
  }

  const prioriteInes = clean(row["Priorité INES"])
  if (prioriteInes) {
    record.prioriteInes = parseEnum<ErrorPrioriteInes>(
      prioriteInes,
      ["P1", "P2", "P3"],
      "P2"
    )
  }

  const dimensionInes = clean(row["Dimension INES"])
  if (dimensionInes) {
    record.dimensionInes = parseEnum(dimensionInes, INES_DIMENSIONS, "Risque")
  }

  return { record, issues }
}

export function parseErrorCodeCsv(csvText: string): CsvParseResult {
  const parsed = Papa.parse<CsvRow>(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
    transform: (value) => value.trim(),
  })

  const issues: CsvParseIssue[] = parsed.errors.map((error) => ({
    row: error.row === undefined ? undefined : error.row + 2,
    message: error.message,
  }))

  const missing = missingHeaders(parsed.meta.fields)
  for (const header of missing) {
    issues.push({
      field: header,
      message: `L'en-tête "${header}" est manquant.`,
    })
  }

  if (missing.length > 0) {
    return { records: [], issues }
  }

  const records: ErrorCodeRegistry[] = []

  parsed.data.forEach((row, index) => {
    if (isEmptyRow(row)) {
      return
    }

    const rowResult = parseRow(row, index + 2)
    issues.push(...rowResult.issues)

    if (rowResult.record) {
      records.push(rowResult.record)
    }
  })

  return { records, issues }
}
