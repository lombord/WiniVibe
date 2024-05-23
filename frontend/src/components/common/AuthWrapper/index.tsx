import { Link } from "@nextui-org/react";
import { FC, ReactNode } from "react";

interface WrapperProps {
  isLogin?: boolean;
  children?: ReactNode;
}

const AuthWrapper: FC<WrapperProps> = ({ isLogin = false, children }) => {
  return (
    <div className="overflow-y-auto">
      <div>
        <div className="mb-6 max-lg:mb-4 max-lg:mt-2 max-lg:text-center">
          <h1 className="lg:h2 text-fo mb-2">
            {isLogin ? (
              <>
                Welcome <span className="text-secondary">Back.</span>
              </>
            ) : (
              <>
                Join the <span className="text-secondary">Vibe.</span>
              </>
            )}
          </h1>
          <p className="text-foreground-500">
            {isLogin ? "Please enter your credentials" : "Create new account"}
          </p>
        </div>
        {children}
        <p className="mt-4 text-center lg:mt-6">
          <span className="tip">
            {isLogin ? "Don't" : "Already"} have an account?
          </span>
          <Link
            isBlock
            color="secondary"
            href={isLogin ? "/auth/register" : "/auth/login"}
          >
            {isLogin ? "Sign up" : "Login"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthWrapper;
