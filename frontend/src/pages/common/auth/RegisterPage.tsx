import AuthWrapper from "@/components/common/AuthWrapper";
import { useSessionStore } from "@/stores/sessionStore";
import { useNavigate } from "react-router-dom";
import { createSection } from "@/components/base/Form/Sections";
import { SectionError } from "@/components/base/Form/Sections/errors";
import Form from "@/components/base/Form";
import type { SessionUser } from "@/types/user";
import { useToastStore } from "@/stores/toastStore";

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
  const showMessage = useToastStore.use.showMessage();
  const navigate = useNavigate();

  return (
    <AuthWrapper>
      <Form
        structure={structure}
        config={{ url: "/auth/register/", method: "post" }}
        succeed={async (user: SessionUser) => {
          setUser(user);
          navigate("/home");
          showMessage([
            {
              type: "success",
              title: "Successful registration",
              message: "You have successfully registered in application",
            },
            {
              type: "info",
              title: "Login",
              message: `You have logged in as ${user.username}`,
            },
          ]);
        }}
      />
    </AuthWrapper>
  );
};

export default RegisterPage;
