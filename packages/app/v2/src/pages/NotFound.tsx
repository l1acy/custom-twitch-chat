import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <>
            <h1>Page not found</h1>
            <Button onClick={() => navigate('/')}>Go home</Button>
        </>
    )
}

export default NotFoundPage
