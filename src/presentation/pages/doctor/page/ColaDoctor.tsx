import { useEffect, useState } from "react"
import { ColaService } from "../../../../core/services/colaService"

export default function ColaDoctor() {
  const [queue, setQueue] = useState([])
  const doctorId = "69069ad1441b83b718aef936" 

  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const data = await ColaService.getDoctorQueue(doctorId)
        console.log("cola:", data);
        
      }catch (e) { 
        console.error("Error obteniendo cola:", e)
        }
    }

    fetchQueue()
  }, [])

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Cola actual del doctor</h1>
      <div className="space-y-3">
       
      </div>
    </main>
  )
}
