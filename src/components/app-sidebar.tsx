import { Home, LogIn, Moon, Sun, User } from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarFooter,
    SidebarSeparator,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

const items = [
    { title: "Dashboard", url: "/dashboard", icon: Home },
    { title: "Pasien", url: "/patient", icon: User },
    { title: "Login", url: "/login", icon: LogIn }
]

export function AppSidebar() {
    const [isDark, setIsDark] = useState(false)
    const location = useLocation()

    useEffect(() => {
        const stored = localStorage.getItem("theme") as "light" | "dark" | null
        // Default ke dark mode jika belum ada preferensi tersimpan
        const initial = stored ?? "dark"
        const isDarkMode = initial === "dark"
        document.documentElement.classList.toggle("dark", isDarkMode)
        setIsDark(isDarkMode)
    }, [])

    function toggleTheme() {
        const next = !isDark
        setIsDark(next)
        document.documentElement.classList.toggle("dark", next)
        localStorage.setItem("theme", next ? "dark" : "light")
    }

    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>HospitaLink</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                                        <NavLink to={item.url} className={({ isActive }) => isActive ? "data-[active=true]:bg-sidebar-accent" : undefined}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </NavLink>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarSeparator />

            <SidebarFooter>
                <Button variant="outline" className="w-full justify-start" onClick={toggleTheme}>
                    {isDark ? <Sun className="mr-2" /> : <Moon className="mr-2" />}
                    <span>{isDark ? "Light mode" : "Dark mode"}</span>
                </Button>
            </SidebarFooter>
        </Sidebar>
    )
}