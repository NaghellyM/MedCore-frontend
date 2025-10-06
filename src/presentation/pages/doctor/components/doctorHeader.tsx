import { Button } from "../../../components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar"

export default function DoctorHeader() {
  return (
    <header
      className="w-full bg-white shadow-sm px-6 py-3 flex items-center"
      style={{ "--header-height": "64px" } as React.CSSProperties}
    >
      
      <Avatar className="w-10 h-10 mr-3">
        <AvatarImage src="https://i.pravatar.cc/48?img=12" alt="Avatar" />
        <AvatarFallback>CG</AvatarFallback>
      </Avatar>

      
      <div className="min-w-0">
        <div className="text-sm font-semibold text-slate-900 truncate">
          Camilo Garcia
        </div>
        <div className="text-xs text-slate-500">Medico</div>
      </div>

      <div className="flex-1" />

      {/* Controles lado derecho */}
      <div className="flex items-center gap-3">
        <div className="w-px h-6 bg-slate-200" />
        <Button variant="ghost" size="icon">🔔</Button>
        <Button variant="ghost" size="icon">💬</Button>
        <Button variant="ghost" size="icon">⚙️</Button>
        <Button variant="ghost" size="icon">↪️</Button>
      </div>
    </header>
  )
}
