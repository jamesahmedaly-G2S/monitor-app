"use client"

import * as React from "react"
import { useDropzone } from "react-dropzone"
import {
  AlertCircleIcon,
  CheckCircle2Icon,
  FileSpreadsheetIcon,
  Loader2Icon,
  SaveIcon,
  UploadIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { buildJsonFileName, downloadRecordsAsJson } from "@/lib/export-json"
import {
  parseErrorCodeCsv,
  type CsvParseIssue,
  type CsvParseResult,
} from "@/lib/parse-csv"
import { cn } from "@/lib/utils"

type ImportState =
  | { status: "idle" }
  | { status: "loading"; fileName: string }
  | { status: "ready"; fileName: string; result: CsvParseResult }
  | { status: "error"; fileName?: string; message: string }

function readFileAsText(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result)
        return
      }

      reject(new Error("Le fichier n'a pas pu être lu en texte."))
    }
    reader.onerror = () => reject(new Error("Lecture du fichier impossible."))
    reader.readAsText(file)
  })
}

function IssueList({ issues }: { issues: CsvParseIssue[] }) {
  if (issues.length === 0) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
        <CheckCircle2Icon className="size-4" />
        Aucun problème détecté dans le fichier.
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-destructive/30 bg-destructive/5">
      <div className="flex items-center gap-2 border-b border-destructive/20 px-3 py-2 text-sm font-medium text-destructive">
        <AlertCircleIcon className="size-4" />
        {issues.length} problème{issues.length > 1 ? "s" : ""} détecté
        {issues.length > 1 ? "s" : ""}
      </div>
      <ul className="max-h-56 divide-y divide-border overflow-auto text-sm">
        {issues.map((issue, index) => (
          <li key={`${issue.message}-${index}`} className="px-3 py-2">
            <span className="text-muted-foreground">
              {issue.row ? `Ligne ${issue.row}` : "Fichier"}
              {issue.field ? ` · ${issue.field}` : ""} :
            </span>{" "}
            {issue.message}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function CsvDropzone() {
  const [importState, setImportState] = React.useState<ImportState>({
    status: "idle",
  })

  const onDrop = React.useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]

    if (!file) {
      return
    }

    setImportState({ status: "loading", fileName: file.name })

    try {
      const csvText = await readFileAsText(file)
      setImportState({
        status: "ready",
        fileName: file.name,
        result: parseErrorCodeCsv(csvText),
      })
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Une erreur inconnue est survenue."
      setImportState({ status: "error", fileName: file.name, message })
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.ms-excel": [".csv"],
    },
    maxFiles: 1,
    noClick: true,
    noKeyboard: true,
  })

  const parsedRecords =
    importState.status === "ready" ? importState.result.records : []
  const issues = importState.status === "ready" ? importState.result.issues : []

  const canSave = importState.status === "ready" && parsedRecords.length > 0

  const totalRows = parsedRecords.length + issues.length
  const qualityRatio =
    totalRows > 0 ? Math.round((parsedRecords.length / totalRows) * 100) : 0

  function handleSave() {
    if (!canSave || importState.status !== "ready") {
      return
    }

    downloadRecordsAsJson(
      parsedRecords,
      buildJsonFileName(importState.fileName)
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.7fr)]">
      <Card>
        <CardHeader>
          <CardTitle>Fichier CSV</CardTitle>
          <CardDescription>
            {"Importez l'extraction CSV avec les en-têtes du référentiel."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={cn(
              "flex min-h-72 flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-border bg-muted/30 px-6 py-10 text-center transition-colors",
              isDragActive &&
                "border-primary bg-primary/5 text-primary ring-3 ring-ring/30"
            )}
          >
            <input {...getInputProps()} />
            <div
              className={cn(
                "flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors",
                isDragActive && "bg-primary/15"
              )}
            >
              {importState.status === "loading" ? (
                <Loader2Icon className="size-6 animate-spin" />
              ) : (
                <UploadIcon className="size-6" />
              )}
            </div>
            <div className="space-y-1">
              <p className="text-base font-medium">
                {isDragActive
                  ? "Déposez le fichier CSV ici"
                  : "Glissez-déposez votre fichier CSV"}
              </p>
              <p className="text-sm text-muted-foreground">
                {"Les colonnes sont contrôlées avant génération de l'aperçu."}
              </p>
            </div>
            <Button type="button" variant="outline" onClick={open}>
              <FileSpreadsheetIcon data-icon="inline-start" />
              Choisir un fichier
            </Button>
            {importState.status !== "idle" ? (
              <Badge
                variant={
                  importState.status === "error"
                    ? "destructive"
                    : importState.status === "ready" && issues.length === 0
                      ? "success"
                      : "secondary"
                }
                className="gap-1.5"
              >
                {importState.status === "loading" ? (
                  <Loader2Icon className="size-3 animate-spin" />
                ) : importState.status === "ready" && issues.length === 0 ? (
                  <CheckCircle2Icon className="size-3" />
                ) : importState.status === "error" ? (
                  <AlertCircleIcon className="size-3" />
                ) : null}
                {importState.status === "loading"
                  ? `Lecture de ${importState.fileName}`
                  : importState.fileName}
              </Badge>
            ) : null}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="button"
            className="w-full"
            disabled={!canSave}
            onClick={handleSave}
          >
            <SaveIcon data-icon="inline-start" />
            Enregistrer en JSON
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{"Contrôle d'import"}</CardTitle>
          <CardDescription>
            Résultat de validation des en-têtes et des lignes obligatoires.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {importState.status === "error" ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              {importState.message}
            </div>
          ) : (
            <IssueList issues={issues} />
          )}

          {totalRows > 0 ? (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  Qualité du fichier
                </span>
                <span className="font-medium">{qualityRatio}%</span>
              </div>
              <Progress value={qualityRatio} />
            </div>
          ) : null}

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-border p-3">
              <p className="text-xs text-muted-foreground">Lignes valides</p>
              <p className="mt-1 text-2xl font-semibold">
                {parsedRecords.length}
              </p>
            </div>
            <div className="rounded-lg border border-border p-3">
              <p className="text-xs text-muted-foreground">Anomalies</p>
              <p className="mt-1 text-2xl font-semibold">{issues.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Aperçu des lignes importées</CardTitle>
          <CardDescription>
            Les cinq premières lignes valides converties en ErrorCodeRegistry.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Priorité</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {importState.status === "loading"
                ? Array.from({ length: 3 }).map((_, index) => (
                    <TableRow key={`skeleton-${index}`}>
                      {Array.from({ length: 6 }).map((__, cellIndex) => (
                        <TableCell key={cellIndex}>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                : parsedRecords.slice(0, 5).map((record) => (
                    <TableRow key={record.code}>
                      <TableCell className="font-mono text-xs">
                        {record.code}
                      </TableCell>
                      <TableCell>{record.nom}</TableCell>
                      <TableCell>{record.type}</TableCell>
                      <TableCell>{record.categorie}</TableCell>
                      <TableCell>{record.priorite}</TableCell>
                      <TableCell>{record.statut}</TableCell>
                    </TableRow>
                  ))}
              {importState.status !== "loading" &&
              parsedRecords.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-muted-foreground"
                  >
                    {"Aucun aperçu disponible avant import d'un CSV valide."}
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
