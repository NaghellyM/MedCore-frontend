import { ArrowRightFromLine, Search } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import React from "react"
import { Button } from "./button"


interface UserHeaderProps {
    name: string
    role: string
    avatarUrl?: string
}

export default function UserHeader({ name, role, avatarUrl }: UserHeaderProps) {
    return (
        <header
            className="fixed top-0 left-0 right-0 w-full bg-white shadow-md px-6 py-3 flex items-center justify-between"
            style={{ "--header-height": "64px" } as React.CSSProperties}
        >

            <div className="flex items-center flex-shrink-0">
                <img
                    src="/src/assets/images/Cuidarte_vive_al_100.png"
                    alt="logo-cuidarte"
                    className="w-20 h-20 object-contain"
                />
            </div>

            <div className="flex-1 max-w-md mx-4 relative hidden md:flex justify-center">
                <input
                    type="text"
                    placeholder="Buscar..."
                    className="w-full border border-slate-300 rounded-md py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-cuidarte-primary"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                    <Search />
                </div>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
                <Avatar className="w-10 h-10">
                    {avatarUrl ? <AvatarImage src={avatarUrl} alt={name} /> : <AvatarFallback>{name[0]}</AvatarFallback>}
                </Avatar>
                <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900 truncate">{name}</div>
                    <div className="text-xs text-slate-500">{role}</div>
                </div>
                <div>
                    <Button className="flex items-center gap-2 bg-cuidarte-accent text-white font-sans font-bold" variant="outline">
                        <ArrowRightFromLine />
                        Cerrar Sesión</Button>
                </div>
            </div>
        </header>
    )
}
