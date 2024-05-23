import sessionStore from "@/stores/sessionStore";
import { type LoaderFunction, redirect } from "react-router-dom";

export const guestLoader: LoaderFunction = () => {
  const { user } = sessionStore.getState();
  if (user) {
    return redirect("/home");
  }
  return null;
};

export const sessionLoader: LoaderFunction = () => {
  const { user } = sessionStore.getState();
  if (!user) {
    return redirect("/auth/login");
  }
  return user;
};

export const profileLoader: LoaderFunction = () => {
  const { user } = sessionStore.getState();
  if (user) {
    return redirect(`/user/${user.username}`);
  }
  return null;
};
