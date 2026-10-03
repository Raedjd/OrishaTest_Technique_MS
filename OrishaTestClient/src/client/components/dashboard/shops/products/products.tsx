'use client';

import { FormEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { AlertCircle, Loader2, RefreshCw, Search } from "lucide-react";

import { ProductCard } from "@client/components/dashboard/shops/products/productCard";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@client/shared/components/ui/dialog";
import { Button } from "@client/shared/components/ui/button";
import { Label } from "@client/shared/components/ui/label";
import { Input } from "@client/shared/components/ui/input";
import { useSnackbar } from "@client/shared/hooks/useSnackbar";
import Snackbar from "@client/shared/components/Snackbar";
import { ProductFilters, ProductLookup } from "@client/shared/types/product";
import {
    ProductFormValues,
    validationProductSchema,
} from "@client/components/dashboard/shops/products/validationProductSchema";
import { useProduct } from "@client/hooks/useProductHook";

/** Displays a field validation error */
const FieldError = ({ message }: { message?: string }) =>
    message ? (
        <div className="mt-1 flex items-start gap-2 text-destructive animate-in slide-in-from-top-1 duration-200">
            <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
            <p className="text-sm font-medium">{message}</p>
        </div>
    ) : null;

export default function Products() {
    // ============================================
    // STATE — filters (GET /api/products?OrderNumber=&Ref=)
    // ============================================
    const [filters, setFilters] = useState<ProductFilters>({ OrderNumber: "", Ref: "" });
    const [orderNumberInput, setOrderNumberInput] = useState("");
    const [refInput, setRefInput] = useState("");

    // ============================================
    // STATE — quantity dialog
    // ============================================
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<ProductLookup | null>(null);

    // ============================================
    // HOOKS
    // ============================================
    const { products, loadingProducts, errorProducts, fetchProducts} = useProduct();
    const { snackbar, snackbarSuccess, snackbarError, hideSnackbar } = useSnackbar();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<ProductFormValues>({
        resolver: yupResolver(validationProductSchema),
    });

    useEffect(() => {
        fetchProducts(filters);
    }, [filters, fetchProducts]);

    // ============================================
    // HANDLERS — search / refresh
    // ============================================
    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        setFilters({ OrderNumber: orderNumberInput, Ref: refInput });
    };

    const handleClear = () => {
        setOrderNumberInput("");
        setRefInput("");
        setFilters({ OrderNumber: "", Ref: "" });
    };

    const handleRefresh = () => {
        fetchProducts(filters);
    };

    // ============================================
    // HANDLERS — received quantity
    // ============================================
    const handleEditQuantity = (id: string) => {
        const product = products.find((p) => p.id === id);
        if (!product) return;

        setSelectedProduct(product);
        reset({
            ExpectedQuantity: product.expectedQuantity,
            ReceivedQuantity: product.receivedQuantity,
        });
        setDialogOpen(true);
    };



    // ============================================
    // RENDER
    // ============================================
    return (
        <div className="p-4 md:p-6 lg:p-8">
            <div className="space-y-6">
                {/* ========== HEADER ========== */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Products</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Find a product by order number or reference and record what was received
                        </p>
                    </div>

                    <button
                        onClick={handleRefresh}
                        disabled={loadingProducts}
                        className="p-2.5 text-muted-foreground hover:text-primary hover:bg-accent rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover-elevate"
                        title="Refresh"
                        aria-label="Refresh products"
                    >
                        <RefreshCw size={20} className={loadingProducts ? "animate-spin" : ""} />
                    </button>
                </div>

                {/* ========== FILTERS ========== */}
                <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row sm:items-end">
                    <div className="space-y-2 sm:w-56">
                        <Label htmlFor="filter-order">Order number</Label>
                        <Input
                            id="filter-order"
                            value={orderNumberInput}
                            onChange={(e) => setOrderNumberInput(e.target.value)}
                            placeholder="e.g., CMD-2026"
                        />
                    </div>
                    <div className="space-y-2 sm:w-56">
                        <Label htmlFor="filter-ref">Reference</Label>
                        <Input
                            id="filter-ref"
                            value={refInput}
                            onChange={(e) => setRefInput(e.target.value)}
                            placeholder="e.g., TSH-RED-M"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button type="submit">
                            <Search className="h-4 w-4 mr-2" />
                            Search
                        </Button>
                        <Button type="button" variant="outline" onClick={handleClear}>
                            Clear
                        </Button>
                    </div>
                </form>

                {/* ========== CONTENT ========== */}
                {loadingProducts && !dialogOpen ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                        <p className="text-muted-foreground">Loading products...</p>
                    </div>
                ) : errorProducts ? (
                    <div className="text-center py-12 border-2 border-dashed border-destructive/40 rounded-lg">
                        <p className="text-destructive mb-4">{errorProducts}</p>
                        <Button variant="outline" onClick={handleRefresh}>
                            Try again
                        </Button>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed rounded-lg">
                        <p className="text-muted-foreground mb-2">No products match this search</p>
                        <p className="text-sm text-muted-foreground">Check the order number and reference, or clear the filters</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} onEditQuantity={handleEditQuantity} />
                        ))}
                    </div>
                )}
            </div>

            {/* ========== RECEIVED QUANTITY DIALOG ========== */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-[420px]">
                    <DialogHeader>
                        <DialogTitle>Set received quantity</DialogTitle>
                        <DialogDescription>
                            {selectedProduct
                                ? `${selectedProduct.name} (${selectedProduct.ref}) in carton ${selectedProduct.cartonCode}`
                                : ""}
                        </DialogDescription>
                    </DialogHeader>

                </DialogContent>
            </Dialog>

            {/* ========== SNACKBAR ========== */}
            <Snackbar
                message={snackbar.message}
                type={snackbar.type}
                isVisible={snackbar.isVisible}
                onClose={hideSnackbar}
            />
        </div>
    );
}
