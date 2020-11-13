import Home from "../views/Home";
import Login from "../views/Login";
import CreateRate from "../views/CreateRate";
import VoteRate from "../views/VoteRate";
import RankRate from "../views/RankRate";

export default {
  '/': { component: Home },
  "/login": { component: Login },
  "/vote": { component: VoteRate, query: ["id"], authRequired: true },
  "/rank": { component: RankRate, query: ["id"], authRequired: true },
  "/rate/edit": { component: CreateRate, query: ["id"], authRequired: true },
};