import { ReceptionStatus } from "@client/shared/types/order";

export interface Product {
    id: string;
    ref: string;
    name: string;
    color: string;
    size: string;
    expectedQuantity: number;
    receivedQuantity: number;
    status: ReceptionStatus;
}


export interface ProductLookup extends Product {
    cartonCode: string;
    palletCode: string;
    orderId: string;
    orderNumber: string;
}

export interface ProductFilters {
    OrderNumber?: string;
    Ref?: string;
}

export interface UpdateProductReceptionPayload {
    receivedQuantity: number;
}
