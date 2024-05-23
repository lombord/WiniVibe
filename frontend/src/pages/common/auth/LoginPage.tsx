import { useNavigate } from "react-router-dom";
import Form from "@/components/base/Form";
import { createSection } from "@/components/base/Form/Sections";
import { useSessionStore } from "@/stores/sessionStore";
import AuthWrapper from "@/components/common/AuthWrapper";
import { useToastStore } from "@/stores/toastStore";

const structure = createSection({
  fields: {
    email: {
      widget: "email",
    },
    password: {
      widget: "password",
    },
  },
});

export const LoginPage = () => {
  const signIn = useSessionStore.use.signIn();
  const showInfo = useToastStore.use.showInfo();
  const navigate = useNavigate();

  return (
    <AuthWrapper isLogin>
      <Form
        structure={structure}
        submitTitle="Login"
        config={async ({ email, password }) => {
          const user = await signIn(email, password);
          navigate("/home");
          showInfo({
            title: "Login",
            message: `You have logged in as ${user.username}`,
          });
        }}
      />
    </AuthWrapper>
  );
};

export default LoginPage;
