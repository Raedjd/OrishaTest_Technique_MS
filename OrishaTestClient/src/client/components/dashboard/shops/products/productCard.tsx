import Link from "next/link";
import { Package, Pencil } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@client/shared/components/ui/card";
import { Button } from "@client/shared/components/ui/button";
import { ProductLookup } from "@client/shared/types/product";
import { ReceptionStatusBadge } from "@client/components/dashboard/shops/orders/receptionStatus";

interface ProductCardProps {
    product: ProductLookup;
    onEditQuantity: (id: string) => void;
}

export function ProductCard({ product, onEditQuantity }: ProductCardProps) {
    return (
        <Card data-testid={`product-card-${product.id}`}>
            <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-3">
                <div className="space-y-1 flex-1 min-w-0">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Package className="h-4 w-4 shrink-0 text-primary" />
                        <span className="truncate">{product.name}</span>
                    </CardTitle>
                    <CardDescription className="text-xs truncate">
                        {product.ref} — {product.color}, size {product.size}
                    </CardDescription>
                </div>
                <ReceptionStatusBadge status={product.status} />
            </CardHeader>

            <CardContent className="space-y-3">
                <p className="text-xs text-muted-foreground">
                    In {product.orderNumber}, pallet {product.palletCode}, carton {product.cartonCode}
                </p>

                <div className="flex items-end justify-between">
                    <div>
                        <p className="text-xs text-muted-foreground">Received</p>
                        <p className="text-lg font-semibold tabular-nums">{product.receivedQuantity}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-muted-foreground">Expected</p>
                        <p className="text-lg font-semibold tabular-nums">{product.expectedQuantity}</p>
                    </div>
                </div>

                <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/shops/orders/${product.orderId}`}>Open order</Link>
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEditQuantity(product.id)}
                        data-testid={`button-edit-${product.id}`}
                        title="Set received quantity"
                    >
                        <Pencil className="h-4 w-4 mr-2" />
                        Set quantity
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
