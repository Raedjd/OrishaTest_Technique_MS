import { ReceptionStatus } from "@client/shared/types/order";

// Produit tel que renvoyé dans le détail d'une commande (ProductDto côté API)
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

// Produit renvoyé par GET /api/products (ProductLookupDto côté API)
export interface ProductLookup extends Product {
    cartonCode: string;
    palletCode: string;
    orderId: string;
    orderNumber: string;
}

// Filtres de GET /api/products
export interface ProductFilters {
    OrderNumber?: string;
    Ref?: string;
}

// Body de PUT /api/orders/{orderId}/products/{productId}/reception
export interface UpdateProductReceptionPayload {
    receivedQuantity: number;
}
