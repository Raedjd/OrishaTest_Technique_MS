'use client';
import { useParams } from "next/navigation";
import OrderDetailView from "@client/components/dashboard/shops/orders/orderDetail";

export default function OrderDetailPage() {
    const { id } = useParams<{ id: string }>();

    return (
        <OrderDetailView orderId={id}></OrderDetailView>
    );
}
