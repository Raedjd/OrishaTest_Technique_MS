import { BaseService } from "@client/services/base.service";
import { API_ENDPOINTS } from "@client/constants/api-endpoints";
import { apiClient } from "@client/shared/client-api/client";
import { OrderDetail, OrderSummary, UpdateReceptionPayload } from "@client/shared/types/order";
import { UpdateProductReceptionPayload } from "@client/shared/types/product";
import {ApiPaginationParams, ApiResponse, ConfigFilters} from "@client/shared/types/shared";

class OrdersService extends BaseService<OrderSummary> {
    constructor() {
        super(API_ENDPOINTS.ORDERS);
    }

    async getAllOrders(filters?: ConfigFilters): Promise<ApiResponse<OrderSummary>> {
        const params: ApiPaginationParams = {};

        if (filters?.PageNumber !== undefined) params.PageNumber = filters.PageNumber;
        if (filters?.PageSize !== undefined) params.PageSize = filters.PageSize;
        if (filters?.Search) params.Search = filters.Search;

        return this.getAll(params);
    }

    async getOrderDetail(orderId: string): Promise<OrderDetail> {
        return apiClient.get<OrderDetail>(`${this.endpoint}/${orderId}`);
    }

    async updateProductReception(orderId: string, productId: string, receivedQuantity: number): Promise<OrderDetail> {
        const payload: UpdateProductReceptionPayload = { receivedQuantity };
        return apiClient.put<OrderDetail>(`${this.endpoint}/${orderId}/products/${productId}/reception`, payload);
    }

    async updateCartonReception(orderId: string, cartonId: string, received: boolean): Promise<OrderDetail> {
        const payload: UpdateReceptionPayload = { received };
        return apiClient.put<OrderDetail>(`${this.endpoint}/${orderId}/cartons/${cartonId}/reception`, payload);
    }

    async updatePalletReception(orderId: string, palletId: string, received: boolean): Promise<OrderDetail> {
        const payload: UpdateReceptionPayload = { received };
        return apiClient.put<OrderDetail>(`${this.endpoint}/${orderId}/pallets/${palletId}/reception`, payload);
    }
}

export const ordersService = new OrdersService();
