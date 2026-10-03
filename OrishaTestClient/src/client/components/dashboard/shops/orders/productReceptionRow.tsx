import { useEffect, useState } from "react";
import { Input } from "@client/shared/components/ui/input";
import { Product } from "@client/shared/types/product";
import { ReceptionCheckbox, ReceptionStatusBadge } from "@client/components/dashboard/shops/orders/receptionStatus";

interface ProductReceptionRowProps {
    product: Product;
    disabled: boolean;
    onQuantityChange: (productId: string, receivedQuantity: number) => void;
}

/** Une ligne produit : case à cocher + saisie de la quantité reçue */
export function ProductReceptionRow({ product, disabled, onQuantityChange }: ProductReceptionRowProps) {
    const [value, setValue] = useState(String(product.receivedQuantity));
    const [error, setError] = useState<string | null>(null);

    // Resynchronise le champ quand l'API renvoie une nouvelle valeur (ex : carton coché)
    useEffect(() => {
        setValue(String(product.receivedQuantity));
        setError(null);
    }, [product.receivedQuantity]);

    const commit = () => {
        const quantity = Number(value);

        if (value.trim() === "" || !Number.isInteger(quantity) || quantity < 0 || quantity > product.expectedQuantity) {
            setError(`Enter a whole number between 0 and ${product.expectedQuantity}.`);
            return;
        }

        setError(null);
        if (quantity !== product.receivedQuantity) {
            onQuantityChange(product.id, quantity);
        }
    };

    return (
        <li className="flex flex-col gap-1 py-2.5" data-testid={`product-row-${product.id}`}>
            <div className="flex flex-wrap items-center gap-3">
                <ReceptionCheckbox
                    status={product.status}
                    disabled={disabled}
                    label={`Mark ${product.ref} as received`}
                    onToggle={(received) => onQuantityChange(product.id, received ? product.expectedQuantity : 0)}
                />

                <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{product.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                        {product.ref} — {product.color}, size {product.size}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Input
                        type="number"
                        inputMode="numeric"
                        min={0}
                        max={product.expectedQuantity}
                        value={value}
                        disabled={disabled}
                        onChange={(e) => setValue(e.target.value)}
                        onBlur={commit}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") commit();
                        }}
                        aria-label={`Received quantity for ${product.ref}`}
                        aria-invalid={!!error}
                        className={`h-8 w-20 text-right tabular-nums ${error ? "border-destructive focus-visible:ring-destructive" : ""}`}
                    />
                    <span className="text-sm text-muted-foreground tabular-nums whitespace-nowrap">
                        / {product.expectedQuantity}
                    </span>
                </div>

                <ReceptionStatusBadge status={product.status} className="hidden sm:inline-flex" />
            </div>

            {error && <p className="pl-8 text-xs font-medium text-destructive">{error}</p>}
        </li>
    );
}
