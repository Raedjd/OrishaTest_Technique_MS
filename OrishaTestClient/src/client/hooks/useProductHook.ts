import { useCallback, useState } from 'react';
import { ProductFilters, ProductLookup } from "@client/shared/types/product";
import { productsService } from "@client/services/products.service";

import { getApiErrorMessage } from "@client/lib/apiError";


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



    return {
        products,
        loadingProducts,
        errorProducts,
        fetchProducts,
    };
}
