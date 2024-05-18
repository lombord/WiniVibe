import Confirm from "@/components/Utils/Confirm";
import { useSessionStore } from "@/stores/sessionStore";
import { useToastStore } from "@/stores/toastStore";
import { useNavigate } from "react-router-dom";

export const LogoutPage = () => {
  const logout = useSessionStore.use.logout();
  const showInfo = useToastStore.use.showInfo();
  const navigate = useNavigate();

  return (
    <div className="centered-flex h-screen">
      <Confirm
        title="Are you sure want to log out?"
        acceptTitle="Logout"
        rejectTitle="Go Back"
        acceptCB={async () => {
          await logout();
          navigate("/home");
          showInfo({ title: "Logout", message: "You have been logged out" });
        }}
        rejectCB={() => navigate(-1)}
      />
    </div>
  );
};

export default LogoutPage;
