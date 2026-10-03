import { useCallback, useState } from 'react';
import { ProductFilters, ProductLookup } from "@client/shared/types/product";
import { productsService } from "@client/services/products.service";

import { getApiErrorMessage } from "@client/lib/apiError";
import {ordersService} from "@client/services/orders.service";


export function useProduct() {
    const [products, setProducts] = useState<ProductLookup[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [errorProducts, setErrorProducts] = useState<string | null>(null);

    const fetchProducts = useCallback(async (filters?: ProductFilters) => {
        setLoadingProducts(true);
        setErrorProducts(null);
        try {
            setProducts(await productsService.searchProducts(filters));
        } catch (err) {
            setErrorProducts(getApiErrorMessage(err, 'Products could not be loaded.'));
        } finally {
            setLoadingProducts(false);
        }
    }, []);


    const updateReceivedQuantity = async (product: ProductLookup, receivedQuantity: number): Promise<string | null> => {
        try {
            await ordersService.updateProductReception(product.orderId, product.id, receivedQuantity);
            return null;
        } catch (err) {
            return getApiErrorMessage(err, 'The received quantity could not be saved.');
        }
    };

    return {
        products,
        loadingProducts,
        errorProducts,
        fetchProducts,
        updateReceivedQuantity,
    };
}
