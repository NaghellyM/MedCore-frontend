import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/button";

export default function BackButton() {
    const navigate = useNavigate();
    return (
        <Button className="bg-pink-100 border-pink-200 text-pink-600" type="button" variant="outline" onClick={() => navigate(-1)}>Volver</Button>
    );
}
