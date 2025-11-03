import { Repositories } from "../Content/Repositories/Repositories";
import { Home } from "../Content/Home/Home";
import { Packages } from "../Content/Packages/Packages";
import { Orphans } from "../Content/Orphans/Orphans";

export const NAV_ITEMS = [
  { key: "Home", path: "/Home", component: Home },
  { key: "Repositories", path: "/Repositories", component: Repositories },
  { key: "Packages", path: "/Packages", component: Packages },
  { key: "Orphans", path: "/Orphans", component: Orphans },
];
export const TITLE = "RPM PACKAGES";