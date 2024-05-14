import { createRoutesFromElements, redirect, Route } from "react-router-dom";
import AppLayout from "@/pages/layouts/MainLayout";
import LoginLayout from "@/pages/layouts/AuthLayout";

import NotFoundPage from "@/pages/ErrorPage";
import HomePage from "@/pages/HomePage";
import PlaylistsPage from "@/pages/PlaylistsPage";

// auth pages
import { RegisterPage, LoginPage, LogoutPage } from "@/pages/auth";
import store from "@/stores/sessionStore";

const guestLoader = async () => {
  const { user } = store.getState();
  if (user) {
    return redirect("/home");
  }
  return null;
};

const sessionLoader = async () => {
  const { user } = store.getState();
  if (!user) {
    return redirect("/auth/login");
  }
  return null;
};

const routes = createRoutesFromElements(
  <>
    <Route path="/" Component={AppLayout}>
      <Route index loader={() => redirect("/home")} />
      <Route path="/home" Component={HomePage} />
      <Route path="/playlists" Component={PlaylistsPage} />
    </Route>
    <Route path="/auth" loader={guestLoader} Component={LoginLayout}>
      <Route index loader={() => redirect("/auth/login")} />
      <Route path="login" Component={LoginPage} />
      <Route path="register" Component={RegisterPage} />
    </Route>
    <Route path="/logout" Component={LogoutPage} loader={sessionLoader} />
    <Route path="*" Component={NotFoundPage} />
  </>,
);
export default routes;
