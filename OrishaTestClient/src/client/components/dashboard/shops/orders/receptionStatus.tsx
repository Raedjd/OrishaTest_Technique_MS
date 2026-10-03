import { CheckCircle2, CircleDashed, CircleDot } from "lucide-react";
import { Badge } from "@client/shared/components/ui/badge";
import { Checkbox } from "@client/shared/components/ui/checkbox";
import { Progress } from "@client/shared/components/ui/progress";
import { ReceptionStatus } from "@client/shared/types/order";
import { cn } from "@client/lib/utils";

const STATUS_CONFIG: Record<ReceptionStatus, { label: string; className: string; icon: typeof CheckCircle2 }> = {
    NotReceived: {
        label: "Not received",
        className: "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300",
        icon: CircleDashed,
    },
    Partial: {
        label: "Partially received",
        className: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200",
        icon: CircleDot,
    },
    Received: {
        label: "Received",
        className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
        icon: CheckCircle2,
    },
};


export function ReceptionStatusBadge({ status, className }: { status: ReceptionStatus; className?: string }) {
    const { label, className: colors, icon: Icon } = STATUS_CONFIG[status];

    return (
        <Badge className={cn(colors, "gap-1 shrink-0", className)}>
            <Icon className="h-3 w-3" />
            {label}
        </Badge>
    );
}


export function ReceptionCheckbox({
    status,
    disabled,
    label,
    onToggle,
}: {
    status: ReceptionStatus;
    disabled?: boolean;
    label: string;
    onToggle: (received: boolean) => void;
}) {
    const checked = status === "Received" ? true : status === "Partial" ? "indeterminate" : false;

    return (
        <Checkbox
            checked={checked}
            disabled={disabled}
            aria-label={label}
            // Cocher une ligne partielle ou vide la valide entièrement ; décocher une ligne reçue la remet à zéro
            onCheckedChange={() => onToggle(status !== "Received")}
            className="h-5 w-5"
        />
    );
}


export function QuantityCount({ received, expected }: { received: number; expected: number }) {
    return (
        <span className="tabular-nums text-sm text-muted-foreground whitespace-nowrap">
            <span className="font-medium text-foreground">{received}</span> / {expected}
        </span>
    );
}


export function ReceptionGauge({ received, expected, percentage }: { received: number; expected: number; percentage: number }) {
    const remaining = expected - received;

    return (
        <div className="space-y-3">
            <div className="flex flex-wrap items-end justify-between gap-2">
                <p className="text-sm text-muted-foreground">
                    <span className="text-3xl font-semibold tabular-nums text-foreground">{received}</span>
                    <span className="text-lg tabular-nums"> / {expected}</span> items received
                </p>
                <p className="text-sm tabular-nums text-muted-foreground">
                    {remaining === 0 ? "Reception complete" : `${remaining} left to check`} ({percentage}%)
                </p>
            </div>
            <Progress
                value={percentage}
                className="h-3"
                aria-label={`${received} of ${expected} items received`}
            />
        </div>
    );
}
