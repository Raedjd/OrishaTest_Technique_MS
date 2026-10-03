import { Product } from "@client/shared/types/product";

export type ReceptionStatus = "NotReceived" | "Partial" | "Received";

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


export interface OrderSummary {
    id: string;
    number: string;
    supplierName?: string | null;
    status: ReceptionStatus;
    palletCount: number;
    progress: Progress;
}


export interface OrderDetail {
    id: string;
    number: string;
    supplierName?: string | null;
    status: ReceptionStatus;
    progress: Progress;
    pallets: Pallet[];
}


export interface UpdateReceptionPayload {
    received: boolean;
}
