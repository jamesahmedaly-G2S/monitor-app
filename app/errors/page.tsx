import Link from "next/link"
import { UploadIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ErrorSearch } from "@/components/shared/error-search"
import { ErrorStats } from "@/components/shared/error-stats"
import { PageHeader } from "@/components/shared/page-header"
import { errorCodes } from "@/lib/error-codes"

export default function ErrorsPage() {
  return (
    <main className="min-h-svh bg-background">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 md:px-8 md:py-10">
        <PageHeader
          eyebrow="Codes d'erreurs DSN"
          title="Recherche des divergences d'audit"
          description="Consultez le référentiel typé des codes, filtrez par statut, priorité ou mot-clé, puis ouvrez la fiche détaillée via son slug."
          action={
            <Button asChild variant="outline">
              <Link href="/import">
                <UploadIcon data-icon="inline-start" />
                Importer un CSV
              </Link>
            </Button>
          }
        />

        <ErrorStats errors={errorCodes} />

        <ErrorSearch errors={errorCodes} />
      </div>
    </main>
  )
}
