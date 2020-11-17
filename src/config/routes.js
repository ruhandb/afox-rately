export default {
  "/": {
    component: () => import("@/views/Home")
  },
  "/login": {
    component: () => import("@/views/Login")
  },
  "/vote": {
    component: () => import("@/views/VoteRate"),
    query: ["id"],
    authRequired: true,
  },
  "/rank": {
    component: () => import("@/views/RankRate"),
    query: ["id"],
    authRequired: true,
  },
  "/rate/edit": {
    component: () => import("@/views/CreateRate"),
    query: ["id"],
    authRequired: true,
  },
};