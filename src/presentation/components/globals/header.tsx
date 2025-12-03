import React from "react"
import { Button } from "../ui/button"
import { ArrowRightFromLine, Search, User } from "lucide-react"
import { Avatar } from "../ui/avatar"
import { getCurrentUser } from "../../../core/services/authService"
import { useAuth } from "../../../core/context/authContext"
import { ThemeToggle } from "./theme-switcher"

type UserHeaderProps = {
    showSearch?: boolean;
    showThemeToggle?: boolean;
}

export default function UserHeader({ showSearch = true, showThemeToggle = false }: UserHeaderProps) {
    const user = getCurrentUser();
    const { logoutUser } = useAuth();
    return (
        <header
            className="fixed top-0 left-0 right-0 w-full bg-background shadow-md dark:shadow-gray-800/50 px-6 py-3 flex items-center justify-between print:hidden transition-colors duration-300 border-b border-border"
            style={{ "--header-height": "64px" } as React.CSSProperties}
        >

            <div className="flex items-center flex-shrink-0">
                <img
                    src="/logoCuidarte.png"
                    alt="logo-cuidarte"
                    className="w-20 h-20 object-contain"
                />
            </div>

            {showSearch && (
                <div className="flex-1 max-w-md mx-4 relative hidden md:flex justify-center">
                    <input
                        type="text"
                        placeholder="Buscar..."
                        className="w-full border border-slate-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 rounded-md py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-cuidarte-primary transition-colors duration-300"
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-gray-400">
                        <Search />
                    </div>
                </div>
            )}

            <div className="flex items-center gap-3 flex-shrink-0">
                {showThemeToggle && (
                    <ThemeToggle size="sm" />
                )}
                <Avatar className="w-10 h-10 dark:bg-gray-700 flex items-center justify-center">
                    <User className="dark:text-gray-300" />
                </Avatar>
                <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900 dark:text-gray-100 truncate">{user?.fullname || "Usuario"}</div>
                    <div className="text-xs text-slate-500 dark:text-gray-400">{user?.role}</div>
                </div>
                <div>
                    <Button onClick={logoutUser} className="btn" variant="outline">
                        <ArrowRightFromLine />
                        Cerrar Sesión</Button>
                </div>
            </div>
        </header>
    )
}
