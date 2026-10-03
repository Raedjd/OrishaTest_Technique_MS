import Link from "next/link";
import { Truck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@client/shared/components/ui/card";
import { Button } from "@client/shared/components/ui/button";
import { Progress } from "@client/shared/components/ui/progress";
import { OrderSummary } from "@client/shared/types/order";
import { ReceptionStatusBadge } from "@client/components/dashboard/shops/orders/receptionStatus";

interface OrderCardProps {
    order: OrderSummary;
}

export function OrderCard({ order }: OrderCardProps) {
    const { progress } = order;
    const actionLabel =
        order.status === "Received" ? "View reception" : order.status === "Partial" ? "Continue reception" : "Start reception";

    return (
        <Card data-testid={`order-card-${order.id}`}>
            <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-3">
                <div className="space-y-1 flex-1 min-w-0">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Truck className="h-4 w-4 shrink-0 text-primary" />
                        <span className="truncate">{order.number}</span>
                    </CardTitle>
                    <CardDescription className="text-xs truncate">
                        {order.supplierName || "Unknown supplier"} — {order.palletCount}{" "}
                        {order.palletCount > 1 ? "pallets" : "pallet"}
                    </CardDescription>
                </div>
                <ReceptionStatusBadge status={order.status} />
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                            <span className="font-medium text-foreground tabular-nums">{progress.receivedQuantity}</span>
                            <span className="tabular-nums"> / {progress.expectedQuantity}</span> items received
                        </span>
                        <span className="tabular-nums text-muted-foreground">{progress.percentage}%</span>
                    </div>
                    <Progress value={progress.percentage} className="h-2" />
                </div>

                <div className="flex justify-end">
                    <Button asChild size="sm" variant={order.status === "Received" ? "outline" : "default"}>
                        <Link href={`/dashboard/shops/orders/${order.id}`} data-testid={`button-open-${order.id}`}>
                            {actionLabel}
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
