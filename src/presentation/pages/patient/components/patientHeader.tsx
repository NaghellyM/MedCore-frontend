
import { ArrowRightFromLine } from "lucide-react"
import { Button } from "../../../components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar"

export default function PatientHeader() {
    return (
        <header
            className="fixed w-full top-0 left-0 right-0 bg-white shadow-md px-6 py-3 flex items-center justify-between"
            style={{ "--header-height": "64px" } as React.CSSProperties}
        >
            <div className="flex items-center flex-shrink-0">
                <img
                    src="/logoCuidarte.png"
                    alt="logo-cuidarte"
                    className="w-20 h-20 object-contain"
                />
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
                <div>
                    <Avatar className="w-10 h-10 mr-3">
                        <AvatarImage src="https://i.pravatar.cc/48?img=48" alt="Avatar" />
                        <AvatarFallback>CG</AvatarFallback>
                    </Avatar>
                </div>

                <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900 truncate">Luisa Carvajal</div>
                    <div className="text-xs text-slate-500">Paciente</div>
                </div>

                <div>
                    <Button className="flex items-center gap-2 bg-cuidarte-accent text-white font-sans font-bold" variant="outline">
                        <ArrowRightFromLine />
                        Cerrar Sesión</Button>
                </div>
            </div>
        </header>
    );
}