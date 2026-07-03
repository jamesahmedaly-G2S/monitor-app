import { ErrorSearch } from "@/components/shared/error-search"
import { errorCodes } from "@/lib/error-codes"

export default function ErrorsPage() {
  return (
    <main className="min-h-svh bg-background">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 md:px-8 md:py-10">
        <header className="space-y-3">
          <div className="inline-flex rounded-md border border-border bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
            {"Codes d'erreurs DSN"}
          </div>
          <div className="max-w-3xl space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
              {"Recherche des divergences d'audit"}
            </h1>
            <p className="text-sm leading-6 text-muted-foreground md:text-base">
              Consultez le référentiel typé des codes, filtrez par code, nom ou
              catégorie, puis ouvrez la fiche détaillée via son slug.
            </p>
          </div>
        </header>

        <ErrorSearch errors={errorCodes} />
      </div>
    </main>
  )
}
