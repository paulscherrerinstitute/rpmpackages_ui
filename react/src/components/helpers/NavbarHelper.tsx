import { Repositories } from "../Content/Repositories/Repositories";
import { Home } from "../Content/Home/Home";
import { Packages } from "../Content/Packages/Packages";

export const NavItems = [
  { key: "Home", path: "/Home", component: Home },
  { key: "Repositories", path: "/Repositories", component: Repositories },
  { key: "Packages", path: "/Packages", component: Packages },
];
export const Title = "NRM PACKAGES";
