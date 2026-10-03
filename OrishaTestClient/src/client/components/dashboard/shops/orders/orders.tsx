'use client';

import { useEffect, useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";

import Pagination from "@client/shared/components/Pagination";
import SearchBar from "@client/shared/components/SearchBar";
import { Button } from "@client/shared/components/ui/button";
import { ConfigFilters } from "@/shared/types/shared";
import { useOrders } from "@client/hooks/useOrderHook";
import { OrderCard } from "@client/components/dashboard/shops/orders/orderCard";

const PAGE_SIZE = 9;

export default function Orders() {
    // ============================================
    // STATE — filters / pagination (PageNumber commence à 1 côté API)
    // ============================================
    const [filters, setFilters] = useState<ConfigFilters>({
        PageNumber: 1,
        PageSize: PAGE_SIZE,
        Search: "",
    });

    const { orders, loadingOrders, errorOrders, paginationOrders, fetchOrders } = useOrders();

    useEffect(() => {
        fetchOrders(filters);
    }, [filters, fetchOrders]);

    const totalPages = Math.ceil(paginationOrders.TotalCount / PAGE_SIZE);

    // ============================================
    // HANDLERS
    // ============================================
    const handleSearch = (value: string) => {
        setFilters((prev) => ({ ...prev, Search: value, PageNumber: 1 }));
    };

    const handleRefresh = () => {
        fetchOrders(filters);
    };

    // Le composant Pagination compte à partir de 0, l'API à partir de 1
    const handlePageChange = (zeroBasedPage: number) => {
        setFilters((prev) => ({ ...prev, PageNumber: zeroBasedPage + 1 }));
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
                        <h1 className="text-2xl font-semibold">Supplier orders</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Open an order to check its pallets, cartons and products
                        </p>
                    </div>

                    <button
                        onClick={handleRefresh}
                        disabled={loadingOrders}
                        className="p-2.5 text-muted-foreground hover:text-primary hover:bg-accent rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover-elevate"
                        title="Refresh"
                        aria-label="Refresh orders"
                    >
                        <RefreshCw size={20} className={loadingOrders ? "animate-spin" : ""} />
                    </button>
                </div>

                {/* ========== SEARCH BAR ========== */}
                <SearchBar
                    value={filters.Search ?? ""}
                    onSearch={handleSearch}
                    placeholder="Search by order number or supplier, then press Enter"
                />

                {/* ========== CONTENT ========== */}
                {loadingOrders ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                        <p className="text-muted-foreground">Loading orders...</p>
                    </div>
                ) : errorOrders ? (
                    <div className="text-center py-12 border-2 border-dashed border-destructive/40 rounded-lg">
                        <p className="text-destructive mb-4">{errorOrders}</p>
                        <Button variant="outline" onClick={handleRefresh}>
                            Try again
                        </Button>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed rounded-lg">
                        <p className="text-muted-foreground mb-2">No orders match this search</p>
                        <p className="text-sm text-muted-foreground">Clear the search to see all pending orders</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {orders.map((order) => (
                                <OrderCard key={order.id} order={order} />
                            ))}
                        </div>

                        <Pagination
                            currentPage={(filters.PageNumber ?? 1) - 1}
                            totalItems={paginationOrders.TotalCount}
                            pageSize={PAGE_SIZE}
                            totalPages={totalPages}
                            loading={loadingOrders}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
