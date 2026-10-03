import { useCallback, useState } from 'react';
import { OrderDetail } from "@client/shared/types/order";
import { ordersService } from "@client/services/orders.service";
import { getApiErrorMessage } from "@client/lib/apiError";


export function useOrderDetail(orderId: string) {
    const [order, setOrder] = useState<OrderDetail | null>(null);
    const [loadingOrder, setLoadingOrder] = useState(false);
    const [saving, setSaving] = useState(false);
    const [errorOrder, setErrorOrder] = useState<string | null>(null);

    const fetchOrder = useCallback(async () => {
        if (!orderId) return;
        setLoadingOrder(true);
        setErrorOrder(null);
        try {
            setOrder(await ordersService.getOrderDetail(orderId));
        } catch (err) {
            setErrorOrder(getApiErrorMessage(err, 'This order could not be loaded.'));
        } finally {
            setLoadingOrder(false);
        }
    }, [orderId]);


    const runUpdate = useCallback(async (request: () => Promise<OrderDetail>, fallback: string): Promise<string | null> => {
        setSaving(true);
        try {
            setOrder(await request());
            return null;
        } catch (err) {
            return getApiErrorMessage(err, fallback);
        } finally {
            setSaving(false);
        }
    }, []);

    const updateProductReception = useCallback(
        (productId: string, receivedQuantity: number) =>
            runUpdate(
                () => ordersService.updateProductReception(orderId, productId, receivedQuantity),
                'The product could not be updated.'
            ),
        [orderId, runUpdate]
    );

    const updateCartonReception = useCallback(
        (cartonId: string, received: boolean) =>
            runUpdate(
                () => ordersService.updateCartonReception(orderId, cartonId, received),
                'The carton could not be updated.'
            ),
        [orderId, runUpdate]
    );

    const updatePalletReception = useCallback(
        (palletId: string, received: boolean) =>
            runUpdate(
                () => ordersService.updatePalletReception(orderId, palletId, received),
                'The pallet could not be updated.'
            ),
        [orderId, runUpdate]
    );

    return {
        order,
        loadingOrder,
        saving,
        errorOrder,
        fetchOrder,
        updateProductReception,
        updateCartonReception,
        updatePalletReception,
    };
}
