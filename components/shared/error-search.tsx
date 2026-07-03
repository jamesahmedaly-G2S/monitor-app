"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowUpRightIcon, FilterXIcon, InboxIcon, SearchIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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

type StatusFilter = ErrorStatus | "Tous"
type PriorityFilter = ErrorPriority | "Toutes"

const STATUS_FILTERS: StatusFilter[] = [
  "Tous",
  "Actif",
  "En cours",
  "Non actif",
]

const PRIORITY_FILTERS: PriorityFilter[] = [
  "Toutes",
  "Haute",
  "Moyenne",
  "Basse",
]

function normalizeSearchValue(value: string) {
  return value
    .toLocaleLowerCase("fr-FR")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
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
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>("Tous")
  const [priorityFilter, setPriorityFilter] =
    React.useState<PriorityFilter>("Toutes")
  const normalizedQuery = normalizeSearchValue(query)

  const filteredErrors = React.useMemo(() => {
    return errors.filter((error) => {
      if (statusFilter !== "Tous" && error.statut !== statusFilter) {
        return false
      }

      if (priorityFilter !== "Toutes" && error.priorite !== priorityFilter) {
        return false
      }

      if (!normalizedQuery) {
        return true
      }

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
  }, [errors, normalizedQuery, statusFilter, priorityFilter])

  const hasActiveFilters =
    query.length > 0 || statusFilter !== "Tous" || priorityFilter !== "Toutes"

  const resetFilters = React.useCallback(() => {
    setQuery("")
    setStatusFilter("Tous")
    setPriorityFilter("Toutes")
  }, [])

  return (
    <section className="space-y-4">
      <Card>
        <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Rechercher par code, nom, catégorie, responsable..."
              className="pl-9"
              aria-label="Rechercher un code d'erreur"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as StatusFilter)}
            >
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_FILTERS.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status === "Tous" ? "Tous les statuts" : status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={priorityFilter}
              onValueChange={(value) =>
                setPriorityFilter(value as PriorityFilter)
              }
            >
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Priorité" />
              </SelectTrigger>
              <SelectContent>
                {PRIORITY_FILTERS.map((priority) => (
                  <SelectItem key={priority} value={priority}>
                    {priority === "Toutes" ? "Toutes priorités" : priority}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {hasActiveFilters ? (
              <Button variant="ghost" size="sm" onClick={resetFilters}>
                <FilterXIcon data-icon="inline-start" />
                Réinitialiser
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <p className="px-1 text-sm text-muted-foreground">
        {filteredErrors.length} résultat
        {filteredErrors.length > 1 ? "s" : ""} sur {errors.length}
      </p>

      <Card className="overflow-hidden p-0">
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
                <TableCell>
                  <Badge variant="outline">{error.type}</Badge>
                </TableCell>
                <TableCell className="max-w-[14rem] truncate text-muted-foreground">
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
                <TableCell colSpan={7} className="h-32 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <InboxIcon className="size-6" />
                    Aucun code ne correspond à cette recherche.
                  </div>
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </Card>
    </section>
  )
}
