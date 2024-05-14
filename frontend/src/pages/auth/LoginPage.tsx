import { useNavigate } from "react-router-dom";
import Form from "@Core/Form";
import { createSection } from "@Core/Form/Sections";
import { useSessionStore } from "@/stores/sessionStore";
import AuthWrapper from "@Main/AuthWrapper";

const structure = createSection({
  fields: {
    username: {
      widget: "email",
      label: "Email",
    },
    password: {
      widget: "password",
    },
  },
});

export const LoginPage = () => {
  const signIn = useSessionStore.use.signIn();
  const navigate = useNavigate();

  return (
    <AuthWrapper isLogin>
      <Form
        structure={structure}
        submitTitle="Login"
        config={async ({ username, password }) => {
          await signIn(username, password);
          navigate("/home");
        }}
      />
    </AuthWrapper>
  );
};

export default LoginPage;
