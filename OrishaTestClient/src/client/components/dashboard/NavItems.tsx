import {
    Home,
    Database,
    Truck,
    type LucideIcon,
} from "lucide-react";

export interface NavItem {
    title: string;
    url: string;
    icon: LucideIcon;
}

export interface Tenant {
    id: string;
    name: string;
    status: "connected" | "disconnected";
}

export const mainNavItems: NavItem[] = [
    { title: "Dashboard", url: "/dashboard", icon: Home },
];

export const ShopsItems: NavItem[] = [
    { title: "Orders", url: "/dashboard/shops/orders", icon: Truck },
    { title: "Products", url: "/dashboard/shops/products", icon: Database },
];
