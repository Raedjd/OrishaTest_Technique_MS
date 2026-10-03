'use client';

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, RefreshCw } from "lucide-react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@client/shared/components/ui/accordion";
import { Button } from "@client/shared/components/ui/button";
import { Card, CardContent } from "@client/shared/components/ui/card";
import { Label } from "@client/shared/components/ui/label";
import { Switch } from "@client/shared/components/ui/switch";
import Snackbar from "@client/shared/components/Snackbar";
import { useSnackbar } from "@client/shared/hooks/useSnackbar";
import { useOrderDetail } from "@client/hooks/useOrderDetailHook";
import { Pallet } from "@client/shared/types/order";
import {
    QuantityCount,
    ReceptionCheckbox,
    ReceptionGauge,
    ReceptionStatusBadge,
} from "@client/components/dashboard/shops/orders/receptionStatus";
import { ProductReceptionRow } from "@client/components/dashboard/shops/orders/productReceptionRow";

interface OrderDetailProps {
    orderId: string;
}

export default function OrderDetailView({ orderId }: OrderDetailProps) {
    const {
        order,
        loadingOrder,
        saving,
        errorOrder,
        fetchOrder,
        updateProductReception,
        updateCartonReception,
        updatePalletReception,
    } = useOrderDetail(orderId);

    const { snackbar, snackbarError, hideSnackbar } = useSnackbar();

    // Palettes et cartons ouverts (accordéons contrôlés pour "Expand all / Collapse all")
    const [openPallets, setOpenPallets] = useState<string[]>([]);
    const [openCartons, setOpenCartons] = useState<string[]>([]);
    const [hideReceived, setHideReceived] = useState(false);
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        fetchOrder();
    }, [fetchOrder]);

    // Au premier chargement : seule la première palette pas encore reçue est ouverte
    useEffect(() => {
        if (order && !initialized) {
            const firstToCheck = order.pallets.find((p) => p.status !== "Received");
            setOpenPallets(firstToCheck ? [firstToCheck.id] : []);
            setInitialized(true);
        }
    }, [order, initialized]);

    // Option "Hide received items" : on n'affiche que ce qui reste à contrôler
    const visiblePallets: Pallet[] = useMemo(() => {
        if (!order) return [];
        if (!hideReceived) return order.pallets;

        return order.pallets
            .filter((pallet) => pallet.status !== "Received")
            .map((pallet) => ({
                ...pallet,
                cartons: pallet.cartons
                    .filter((carton) => carton.status !== "Received")
                    .map((carton) => ({
                        ...carton,
                        products: carton.products.filter((product) => product.status !== "Received"),
                    })),
            }));
    }, [order, hideReceived]);

    // ============================================
    // HANDLERS — chaque action est enregistrée immédiatement
    // ============================================
    const showError = (message: string | null) => {
        if (message) snackbarError(message);
    };

    const handlePalletToggle = async (palletId: string, received: boolean) =>
        showError(await updatePalletReception(palletId, received));

    const handleCartonToggle = async (cartonId: string, received: boolean) =>
        showError(await updateCartonReception(cartonId, received));

    const handleProductQuantity = async (productId: string, receivedQuantity: number) =>
        showError(await updateProductReception(productId, receivedQuantity));

    const expandAll = () => {
        if (!order) return;
        setOpenPallets(order.pallets.map((p) => p.id));
        setOpenCartons(order.pallets.flatMap((p) => p.cartons.map((c) => c.id)));
    };

    const collapseAll = () => {
        setOpenPallets([]);
        setOpenCartons([]);
    };

    // ============================================
    // RENDER — états de chargement / erreur
    // ============================================
    if (loadingOrder && !order) {
        return (
            <div className="flex flex-col items-center justify-center py-24">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Loading order...</p>
            </div>
        );
    }

    if (errorOrder || !order) {
        return (
            <div className="p-4 md:p-6 lg:p-8">
                <div className="text-center py-12 border-2 border-dashed border-destructive/40 rounded-lg">
                    <p className="text-destructive mb-4">{errorOrder ?? "This order could not be loaded."}</p>
                    <div className="flex justify-center gap-2">
                        <Button variant="outline" asChild>
                            <Link href="/dashboard/shops/orders">Back to orders</Link>
                        </Button>
                        <Button variant="outline" onClick={fetchOrder}>
                            Try again
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // ============================================
    // RENDER — commande
    // ============================================
    return (
        <div className="p-4 md:p-6 lg:p-8">
            <div className="space-y-6">
                {/* ========== HEADER ========== */}
                <div className="space-y-3">
                    <Link
                        href="/dashboard/shops/orders"
                        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Orders
                    </Link>

                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-2xl font-semibold">{order.number}</h1>
                                <ReceptionStatusBadge status={order.status} />
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                                {order.supplierName || "Unknown supplier"}
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            {saving && (
                                <span className="flex items-center gap-1 text-xs text-muted-foreground" aria-live="polite">
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                    Saving
                                </span>
                            )}
                            <button
                                onClick={fetchOrder}
                                disabled={loadingOrder || saving}
                                className="p-2.5 text-muted-foreground hover:text-primary hover:bg-accent rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover-elevate"
                                title="Refresh"
                                aria-label="Refresh order"
                            >
                                <RefreshCw size={20} className={loadingOrder ? "animate-spin" : ""} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* ========== JAUGE (User Story 3) ========== */}
                <Card>
                    <CardContent className="pt-6">
                        <ReceptionGauge
                            received={order.progress.receivedQuantity}
                            expected={order.progress.expectedQuantity}
                            percentage={order.progress.percentage}
                        />
                    </CardContent>
                </Card>

                {/* ========== TOOLBAR ========== */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <Switch id="hide-received" checked={hideReceived} onCheckedChange={setHideReceived} />
                        <Label htmlFor="hide-received" className="text-sm">
                            Hide received items
                        </Label>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={expandAll}>
                            Expand all
                        </Button>
                        <Button variant="outline" size="sm" onClick={collapseAll}>
                            Collapse all
                        </Button>
                    </div>
                </div>

                {/* ========== ARBRE PALETTES → CARTONS → PRODUITS (User Stories 1 et 2) ========== */}
                {visiblePallets.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed rounded-lg">
                        <p className="text-muted-foreground">Every item of this order has been received.</p>
                    </div>
                ) : (
                    <Accordion type="multiple" value={openPallets} onValueChange={setOpenPallets} className="space-y-3">
                        {visiblePallets.map((pallet) => (
                            <AccordionItem key={pallet.id} value={pallet.id} className="rounded-lg border bg-card px-4">
                                {/* Ligne palette */}
                                <div className="flex items-center gap-3">
                                    <ReceptionCheckbox
                                        status={pallet.status}
                                        disabled={saving}
                                        label={`Mark pallet ${pallet.code} as received`}
                                        onToggle={(received) => handlePalletToggle(pallet.id, received)}
                                    />
                                    <AccordionTrigger className="gap-3 py-3 hover:no-underline">
                                        <span className="flex flex-1 flex-wrap items-center gap-x-3 gap-y-1 text-left">
                                            <span className="font-semibold">{pallet.code}</span>
                                            <span className="text-xs font-normal text-muted-foreground">
                                                {pallet.cartons.length} {pallet.cartons.length > 1 ? "cartons" : "carton"}
                                            </span>
                                        </span>
                                        <QuantityCount received={pallet.receivedQuantity} expected={pallet.expectedQuantity} />
                                        <ReceptionStatusBadge status={pallet.status} className="hidden sm:inline-flex" />
                                    </AccordionTrigger>
                                </div>

                                <AccordionContent className="pl-8">
                                    <Accordion
                                        type="multiple"
                                        value={openCartons}
                                        onValueChange={setOpenCartons}
                                        className="divide-y rounded-md border"
                                    >
                                        {pallet.cartons.map((carton) => (
                                            <AccordionItem key={carton.id} value={carton.id} className="border-b-0 px-3">
                                                {/* Ligne carton */}
                                                <div className="flex items-center gap-3">
                                                    <ReceptionCheckbox
                                                        status={carton.status}
                                                        disabled={saving}
                                                        label={`Mark carton ${carton.code} as received`}
                                                        onToggle={(received) => handleCartonToggle(carton.id, received)}
                                                    />
                                                    <AccordionTrigger className="gap-3 py-2.5 hover:no-underline">
                                                        <span className="flex flex-1 flex-wrap items-center gap-x-3 gap-y-1 text-left">
                                                            <span className="font-medium">{carton.code}</span>
                                                            <span className="text-xs font-normal text-muted-foreground">
                                                                {carton.products.length}{" "}
                                                                {carton.products.length > 1 ? "products" : "product"}
                                                            </span>
                                                        </span>
                                                        <QuantityCount
                                                            received={carton.receivedQuantity}
                                                            expected={carton.expectedQuantity}
                                                        />
                                                        <ReceptionStatusBadge
                                                            status={carton.status}
                                                            className="hidden sm:inline-flex"
                                                        />
                                                    </AccordionTrigger>
                                                </div>

                                                <AccordionContent className="pl-8 pb-2">
                                                    <ul className="divide-y">
                                                        {carton.products.map((product) => (
                                                            <ProductReceptionRow
                                                                key={product.id}
                                                                product={product}
                                                                disabled={saving}
                                                                onQuantityChange={handleProductQuantity}
                                                            />
                                                        ))}
                                                    </ul>
                                                </AccordionContent>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                )}
            </div>

            {/* ========== SNACKBAR (erreurs de l'API) ========== */}
            <Snackbar
                message={snackbar.message}
                type={snackbar.type}
                isVisible={snackbar.isVisible}
                onClose={hideSnackbar}
            />
        </div>
    );
}
