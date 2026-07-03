import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeftIcon,
  MailIcon,
  SearchIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { errorCodes } from "@/lib/error-codes"
import { buildErrorMailto } from "@/lib/mailto-builder"
import type { ErrorCodeRegistry, ErrorPriority, ErrorStatus } from "@/types"

export function generateStaticParams() {
  return errorCodes.map((error) => ({
    code: error.code,
  }))
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

function DetailItem({
  label,
  value,
}: {
  label: string
  value?: number | string
}) {
  return (
    <div className="space-y-1">
      <dt className="text-xs font-medium uppercase text-muted-foreground">
        {label}
      </dt>
      <dd className="text-sm leading-6">{value || "Non renseigné"}</dd>
    </div>
  )
}

function TextBlock({ title, value }: { title: string; value: string }) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">{title}</h3>
      <p className="text-sm leading-6 text-muted-foreground">{value}</p>
    </div>
  )
}

function findErrorByCode(code: string): ErrorCodeRegistry | undefined {
  return errorCodes.find((error) => error.code === decodeURIComponent(code))
}

export default async function ErrorDetailPage({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const { code } = await params
  const error = findErrorByCode(code)

  if (!error) {
    notFound()
  }

  const mailto = buildErrorMailto(error)

  return (
    <main className="min-h-svh bg-background">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 md:px-8 md:py-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline">
              <Link href="/">
                <ArrowLeftIcon data-icon="inline-start" />
                Accueil
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/errors">
                <SearchIcon data-icon="inline-start" />
                Référentiel
              </Link>
            </Button>
          </div>
          <Button asChild size="lg">
            <a href={mailto}>
              <MailIcon data-icon="inline-start" />
              Contacter le responsable
            </a>
          </Button>
        </div>

        <header className="space-y-4 rounded-lg border border-border bg-card p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="space-y-2">
              <p className="font-mono text-sm text-muted-foreground">
                {error.code}
              </p>
              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                {error.nom}
              </h1>
              <p className="max-w-3xl text-sm leading-6 text-muted-foreground md:text-base">
                {error.description}
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <Badge variant={priorityVariant(error.priorite)}>
                {error.priorite}
              </Badge>
              <Badge variant={statusVariant(error.statut)}>{error.statut}</Badge>
            </div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(20rem,0.85fr)]">
          <Card>
            <CardHeader>
              <CardTitle>Analyse et correction</CardTitle>
              <CardDescription>
                Informations fonctionnelles issues du référentiel de divergence.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <TextBlock title="Description" value={error.description} />
              <TextBlock title="Cause possible" value={error.causePossible} />
              <TextBlock title="Solution" value={error.solution} />
              <TextBlock title="Exemple" value={error.exemple} />
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Classification</CardTitle>
                <CardDescription>
                  {"Métadonnées de suivi du code d'erreur."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <dl className="grid gap-4">
                  <DetailItem label="Type" value={error.type} />
                  <DetailItem label="Catégorie" value={error.categorie} />
                  <DetailItem
                    label="Sous-catégorie DSN"
                    value={error.sousCategorieDsn}
                  />
                  <DetailItem label="Responsable" value={error.responsable} />
                  <DetailItem label="Date ajout" value={error.dateAjout} />
                  <DetailItem
                    label="Dernière mise à jour"
                    value={error.derniereMiseAJour}
                  />
                </dl>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>INES / Cortex</CardTitle>
                <CardDescription>
                  Bloc technique pour le suivi G2S Cortex et INES.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <dl className="grid gap-4">
                  <DetailItem
                    label="Commentaire G2S Cortex"
                    value={error.commentaireG2sCortex}
                  />
                  <DetailItem label="Famille INES" value={error.familleInes} />
                  <DetailItem label="Priorité INES" value={error.prioriteInes} />
                  <DetailItem
                    label="Dimension INES"
                    value={error.dimensionInes}
                  />
                  <DetailItem label="Score max" value={error.scoreMax} />
                  <DetailItem label="Anomalie INES" value={error.anomalieInes} />
                  <DetailItem label="Code INES" value={error.codeInes} />
                </dl>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
