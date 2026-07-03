"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowUpRightIcon, SearchIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { ErrorCodeRegistry, ErrorPriority, ErrorStatus } from "@/types"

type ErrorSearchProps = {
  errors: ErrorCodeRegistry[]
}

function normalizeSearchValue(value: string) {
  return value
    .toLocaleLowerCase("fr-FR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
}

function priorityVariant(priority: ErrorPriority) {
  if (priority === "Haute") {
    return "warning"
  }

  return "secondary"
}

function statusVariant(status: ErrorStatus) {
  if (status === "Actif") {
    return "success"
  }

  if (status === "En cours") {
    return "warning"
  }

  return "outline"
}

export function ErrorSearch({ errors }: ErrorSearchProps) {
  const [query, setQuery] = React.useState("")
  const normalizedQuery = normalizeSearchValue(query)

  const filteredErrors = React.useMemo(() => {
    if (!normalizedQuery) {
      return errors
    }

    return errors.filter((error) => {
      const searchableFields = [
        error.code,
        error.nom,
        error.categorie,
        error.type,
        error.responsable,
      ]

      return searchableFields.some((field) =>
        normalizeSearchValue(field).includes(normalizedQuery)
      )
    })
  }, [errors, normalizedQuery])

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 border-b border-border pb-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold tracking-tight">
            Référentiel des codes
          </h2>
          <p className="text-sm text-muted-foreground">
            {filteredErrors.length} résultat
            {filteredErrors.length > 1 ? "s" : ""} sur {errors.length}
          </p>
        </div>
        <div className="relative w-full md:max-w-sm">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Rechercher par code, nom, catégorie..."
            className="pl-9"
            aria-label="Rechercher un code d'erreur"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead>Code</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Responsable</TableHead>
              <TableHead>Priorité</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredErrors.map((error) => (
              <TableRow key={error.code}>
                <TableCell className="font-mono text-xs font-medium">
                  {error.code}
                </TableCell>
                <TableCell>
                  <div className="max-w-[18rem]">
                    <p className="font-medium">{error.nom}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {error.description}
                    </p>
                  </div>
                </TableCell>
                <TableCell>{error.type}</TableCell>
                <TableCell className="max-w-[14rem] truncate">
                  {error.responsable}
                </TableCell>
                <TableCell>
                  <Badge variant={priorityVariant(error.priorite)}>
                    {error.priorite}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant(error.statut)}>
                    {error.statut}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/errors/${encodeURIComponent(error.code)}`}>
                      Ouvrir
                      <ArrowUpRightIcon data-icon="inline-end" />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filteredErrors.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-24 text-center text-muted-foreground"
                >
                  Aucun code ne correspond à cette recherche.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>
    </section>
  )
}
