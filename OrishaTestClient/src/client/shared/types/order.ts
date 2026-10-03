import { Product } from "@client/shared/types/product";

// Statut calculé par l'API à chaque niveau
export type ReceptionStatus = "NotReceived" | "Partial" | "Received";

// Jauge "X / Y articles reçus"
export interface Progress {
    receivedQuantity: number;
    expectedQuantity: number;
    percentage: number;
}

export interface Carton {
    id: string;
    code: string;
    expectedQuantity: number;
    receivedQuantity: number;
    status: ReceptionStatus;
    products: Product[];
}

export interface Pallet {
    id: string;
    code: string;
    expectedQuantity: number;
    receivedQuantity: number;
    status: ReceptionStatus;
    cartons: Carton[];
}

// GET /api/orders (une ligne de la liste)
export interface OrderSummary {
    id: string;
    number: string;
    supplierName?: string | null;
    status: ReceptionStatus;
    palletCount: number;
    progress: Progress;
}

// GET /api/orders/{id} et réponse de tous les PUT de réception
export interface OrderDetail {
    id: string;
    number: string;
    supplierName?: string | null;
    status: ReceptionStatus;
    progress: Progress;
    pallets: Pallet[];
}

// Body de PUT .../cartons/{id}/reception et .../pallets/{id}/reception
export interface UpdateReceptionPayload {
    received: boolean;
}
