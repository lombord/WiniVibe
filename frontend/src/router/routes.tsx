import { createRoutesFromElements, redirect, Route } from "react-router-dom";

// layouts
import Root from "@/pages/common/layouts/Root";

import NotFoundPage from "@/pages/common/NotFoundPage";
import HomePage from "@/pages/common/HomePage";
import PlaylistsPage from "@/pages/common/PlaylistsPage";

// auth components
import {
  AuthLayout,
  RegisterPage,
  LoginPage,
  LogoutPage,
} from "@/pages/common/auth";

import { guestLoader, profileLoader, sessionLoader } from "./loaders";
import { AppLayout, ProfilePage } from "./lazyLoaded";

const routes = createRoutesFromElements(
  <Route Component={Root}>
    <Route path="/" element={<AppLayout />}>
      <Route index loader={() => redirect("/home")} />
      <Route path="/home" Component={HomePage} />
      <Route path="/playlists" Component={PlaylistsPage} />
      <Route path="/user/:username">
        <Route index element={<ProfilePage />} />
      </Route>
    </Route>
    <Route path="/auth" loader={guestLoader} Component={AuthLayout}>
      <Route index loader={() => redirect("/auth/login")} />
      <Route path="login" Component={LoginPage} />
      <Route path="register" Component={RegisterPage} />
    </Route>
    <Route path="/profile" loader={sessionLoader}>
      <Route index loader={profileLoader} />
    </Route>
    <Route path="/logout" Component={LogoutPage} loader={sessionLoader} />
    <Route path="*" Component={NotFoundPage} />
  </Route>,
);

export default routes;
