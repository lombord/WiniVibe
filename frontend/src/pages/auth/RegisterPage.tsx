import AuthWrapper from "@Main/AuthWrapper";
import { useSessionStore } from "@/stores/sessionStore";
import { useNavigate } from "react-router-dom";
import { createSection } from "@/components/Core/Form/Sections";
import { SectionError } from "@/components/Core/Form/Sections/errors";
import Form from "@/components/Core/Form";
import type { SessionUser } from "@/types/user";

const structure = createSection({
  fields: {
    username: {
      widget: {
        type: "input",
        props: { maxLength: 150 },
      },
    },
    email: {
      widget: "email",
    },
    password: {
      widget: {
        type: "password",
        props: { newPassword: true },
      },
    },
    password_confirm: {
      widget: {
        type: "password",
        props: { autoComplete: "new-password" },
      },
    },
  },

  validator: (data) => {
    type S = typeof structure;

    if (data.password != data.password_confirm) {
      throw new SectionError<S>({
        password_confirm:
          "Passwords don't match! Please ensure confirm password is the same as password",
      });
    } else if (data.password == data.email) {
      throw new SectionError<S>({
        password:
          "Password and Email are the same! Please ensure your password differs from your email",
      });
    } else if (data.password == data.username) {
      throw new SectionError<S>({
        password:
          "Password and username are the same! Please ensure your password differs from your username",
      });
    }

    return data;
  },
});

export const RegisterPage = () => {
  const setUser = useSessionStore.use.setUser();
  const navigate = useNavigate();

  return (
    <AuthWrapper>
      <Form
        structure={structure}
        config={{ url: "/auth/register/", method: "post" }}
        succeed={(user: SessionUser) => {
          setUser(user);
          navigate("/home");
        }}
      />
    </AuthWrapper>
  );
};

export default RegisterPage;
