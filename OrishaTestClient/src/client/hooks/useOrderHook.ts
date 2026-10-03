import { useCallback, useState } from 'react';

import { OrderSummary } from "@client/shared/types/order";
import { ordersService } from "@client/services/orders.service";
import { getApiErrorMessage } from "@client/lib/apiError";
import {ApiResponse, ConfigFilters} from "@client/shared/types/shared";


export function useOrders() {
    const [orders, setOrders] = useState<OrderSummary[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [errorOrders, setErrorOrders] = useState<string | null>(null);
    const [paginationOrders, setPaginationOrders] = useState({
        TotalCount: 0,
        PageNumber: 1,
        PageSize: 10,
    });

    const fetchOrders = useCallback(async (filters?: ConfigFilters) => {
        setLoadingOrders(true);
        setErrorOrders(null);
        try {
            const response: ApiResponse<OrderSummary> = await ordersService.getAllOrders(filters);

            setOrders(response.Items);
            setPaginationOrders({
                TotalCount: response.TotalCount,
                PageNumber: response.PageNumber,
                PageSize: response.PageSize,
            });
        } catch (err) {
            setErrorOrders(getApiErrorMessage(err, 'Orders could not be loaded.'));
        } finally {
            setLoadingOrders(false);
        }
    }, []);

    return {
        orders,
        loadingOrders,
        errorOrders,
        paginationOrders,
        fetchOrders,
    };
}
