import Link from "next/link"
import {
  ArrowLeftIcon,
  ClipboardCheckIcon,
  SaveIcon,
  UploadCloudIcon,
} from "lucide-react"

import { CsvDropzone } from "@/components/shared/csv-dropzone"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"

const STEPS = [
  {
    icon: UploadCloudIcon,
    title: "Glisser-déposer",
    description: "Déposez l'extraction CSV du fichier d'audit.",
  },
  {
    icon: ClipboardCheckIcon,
    title: "Vérification automatique",
    description: "Les en-têtes et les lignes obligatoires sont contrôlés.",
  },
  {
    icon: SaveIcon,
    title: "Enregistrement",
    description: "Téléchargez le résultat validé au format JSON.",
  },
]

export default function ImportPage() {
  return (
    <main className="min-h-svh bg-background">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 md:px-8 md:py-10">
        <PageHeader
          eyebrow="Import CSV"
          title="Charger une extraction de codes d'erreurs"
          description="Déposez un CSV issu du fichier d'audit. Les en-têtes obligatoires sont validés et chaque ligne est convertie vers le type ErrorCodeRegistry."
          action={
            <Button asChild variant="outline">
              <Link href="/errors">
                <ArrowLeftIcon data-icon="inline-start" />
                Référentiel
              </Link>
            </Button>
          }
        />

        <ol className="grid gap-4 sm:grid-cols-3">
          {STEPS.map((step, index) => (
            <li
              key={step.title}
              className="flex items-start gap-3 rounded-xl border border-border bg-card p-4"
            >
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <step.icon className="size-4.5" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-muted-foreground">
                  Étape {index + 1}
                </p>
                <p className="text-sm font-medium">{step.title}</p>
                <p className="text-xs leading-5 text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <CsvDropzone />
      </div>
    </main>
  )
}
