import { redirect } from "next/navigation";

// La réception des commandes est la page principale du tableau de bord
export default function DashboardPage() {
    redirect("/dashboard/shops/orders");
}
