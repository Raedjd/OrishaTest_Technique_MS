"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/client/shared/components/ui/sidebar";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/client/shared/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { mainNavItems, ShopsItems } from "./NavItems";
import { cn } from "@client/lib/utils";

interface AppSidebarProps {
    selectedTenant: string;
    onTenantChange: (tenantId: string) => void;
}

export function AppSidebar({ selectedTenant, onTenantChange }: AppSidebarProps) {
    const pathname = usePathname();
    const [modulesOpen, setModulesOpen] = useState(true);
    const { state, isMobile } = useSidebar();
    const isCollapsed = state === "collapsed";

    return (
        <Sidebar>
            {/* Logo section */}
            <SidebarHeader className="p-4 border-b border-border">
                <div
                    className={cn(
                        "flex items-center gap-3",
                        isCollapsed && !isMobile && "justify-center"
                    )}
                >
                    <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#4b2c82] to-[#e5007d] text-white font-bold text-lg shadow-lg shrink-0 overflow-hidden">
                        {/* Orisha halftone triangle */}
                        <span
                            aria-hidden="true"
                            className="absolute left-1/2 top-1/2 -translate-y-1/2 w-4 h-7 opacity-80"
                            style={{
                                background: "linear-gradient(180deg, #ffc93c 0%, #ffffff 50%, #ffc93c 100%)",
                                clipPath: "polygon(0 0, 100% 50%, 0 100%)",
                            }}
                        />
                        <span className="relative">O</span>
                    </div>
                    {(!isCollapsed || isMobile) && (
                        <div className="min-w-0">
                            <h2 className="font-semibold text-foreground truncate">Orisha Commerce</h2>
                        </div>
                    )}
                </div>
            </SidebarHeader>

            <SidebarContent>
                {/* Main Navigation */}
                <SidebarGroup>
                    <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {mainNavItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={pathname === item.url}
                                        tooltip={item.title}
                                    >
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Administration - Collapsible */}
                <Collapsible open={modulesOpen} onOpenChange={setModulesOpen}>
                    <SidebarGroup>
                        <CollapsibleTrigger asChild>
                            <SidebarGroupLabel className="cursor-pointer hover:bg-sidebar-accent flex items-center justify-between">
                                <span>Administration</span>
                                <ChevronDown
                                    className={cn(
                                        "h-4 w-4 transition-transform",
                                        modulesOpen && "rotate-180"
                                    )}
                                />
                            </SidebarGroupLabel>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {ShopsItems.map((item) => (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton
                                                asChild
                                                isActive={pathname === item.url || pathname.startsWith(`${item.url}/`)}
                                                tooltip={item.title}
                                            >
                                                <Link href={item.url}>
                                                    <item.icon />
                                                    <span>{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </CollapsibleContent>
                    </SidebarGroup>
                </Collapsible>
            </SidebarContent>
        </Sidebar>
    );
}