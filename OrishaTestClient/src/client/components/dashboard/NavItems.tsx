import {
    Database,
    Truck,
    type LucideIcon,
} from "lucide-react";

export interface NavItem {
    title: string;
    url: string;
    icon: LucideIcon;
}

export const ShopsItems: NavItem[] = [
    { title: "Orders", url: "/dashboard/shops/orders", icon: Truck },
    { title: "Products", url: "/dashboard/shops/products", icon: Database },
];
