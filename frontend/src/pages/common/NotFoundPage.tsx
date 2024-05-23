import { Button } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div className="centered-flex h-screen text-center">
      <div>
        <h2 className="mb-4 text-secondary">Page Not Found</h2>
        <Button onPress={() => navigate("/home")} color="primary">
          Go Home
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
