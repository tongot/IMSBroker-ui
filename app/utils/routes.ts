import MatIconProp from "./interfaces/mat-icon-prop";

export interface Route extends MatIconProp {
  type: string;
  name: string;
  path: string;
  roles: ["admin"];
}
const ROUTES: Route[] = [
  {
    type: "IMS",
    name: "Dashboard",
    path: "/dashboard",
    icon: "Dashboard",
    roles: ["admin"],
  },
  // {
  //   type: "IMS",
  //   name: "Employees",
  //   path: "/employees",
  //   icon: "Engineering",
  //   roles: ["admin"],
  // },
  // {
  //   type: "IMS",
  //   name: "Contacts",
  //   path: "/contacts",
  //   icon: "PermContactCalendar",
  //   roles: ["admin"],
  // },
  // {
  //   type: "IMS",
  //   name: "Polices",
  //   path: "/polices",
  //   icon: "HistoryEdu",
  //   roles: ["admin"],
  // },
  {
    type: "IMS",
    name: "People & Contacts",
    path: "/people",
    icon: "People",
    roles: ["admin"],
  },
  {
    type: "IMS",
    name: "Quotations",
    path: "/quotation",
    icon: "RequestQuote",
    roles: ["admin"],
  },
  // {
  //   type: "Settings",
  //   name: "Settings",
  //   path: "/Polices",
  //   icon: "Settings",
  //   roles: ["admin"],
  // },

  {
    type: "Settings",
    name: "Users",
    path: "/users",
    icon: "AccountBox",
    roles: ["admin"],
  },
  {
    type: "Settings",
    name: "Underwriters",
    path: "/underwriters",
    icon: "CorporateFare",
    roles: ["admin"],
  },
  {
    type: "Settings",
    name: "Settings",
    path: "/settings",
    icon: "Settings",
    roles: ["admin"],
  },
];

export default ROUTES;
