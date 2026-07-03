import {
  CheckCircle2Icon,
  ClockIcon,
  DatabaseIcon,
  FlameIcon,
  type LucideIcon,
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { ErrorCodeRegistry } from "@/types"

type ErrorStatsProps = {
  errors: ErrorCodeRegistry[]
}

function StatTile({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string
  value: number
  icon: LucideIcon
  tone: string
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-lg",
            tone
          )}
        >
          <Icon className="size-5" />
        </div>
        <div>
          <p className="text-2xl font-semibold tracking-tight">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export function ErrorStats({ errors }: ErrorStatsProps) {
  const total = errors.length
  const actifs = errors.filter((error) => error.statut === "Actif").length
  const enCours = errors.filter((error) => error.statut === "En cours").length
  const priorityHaute = errors.filter(
    (error) => error.priorite === "Haute"
  ).length

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatTile
        label="Codes référencés"
        value={total}
        icon={DatabaseIcon}
        tone="bg-primary/10 text-primary"
      />
      <StatTile
        label="Actifs"
        value={actifs}
        icon={CheckCircle2Icon}
        tone="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
      />
      <StatTile
        label="En cours de traitement"
        value={enCours}
        icon={ClockIcon}
        tone="bg-amber-500/10 text-amber-600 dark:text-amber-400"
      />
      <StatTile
        label="Priorité haute"
        value={priorityHaute}
        icon={FlameIcon}
        tone="bg-destructive/10 text-destructive"
      />
    </div>
  )
}
