import { API_ENDPOINTS } from "@client/constants/api-endpoints";
import { apiClient } from "@client/shared/client-api/client";
import { ProductFilters, ProductLookup } from "@client/shared/types/product";

class ProductsService {
    private endpoint = API_ENDPOINTS.PRODUCTS;

    async searchProducts(filters?: ProductFilters): Promise<ProductLookup[]> {
        const queryParams = new URLSearchParams();

        if (filters?.OrderNumber?.trim()) queryParams.append("OrderNumber", filters.OrderNumber.trim());
        if (filters?.Ref?.trim()) queryParams.append("Ref", filters.Ref.trim());

        const query = queryParams.toString();
        return apiClient.get<ProductLookup[]>(query ? `${this.endpoint}?${query}` : this.endpoint);
    }
}

export const productsService = new ProductsService();
