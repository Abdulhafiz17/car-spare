import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/Home.vue";
const role = localStorage.getItem("role");

let routes = [
  {
    path: "/home",
    name: "home",
    meta: { auth: true, title: "Loading" },
    component: HomeView,
  },
  {
    path: "/:catchAll(.*)",
    name: "notFound",
    meta: { auth: false, title: "Sahifa Topilmadi" },
    component: () => import("../components/NotFound/NotFound.vue"),
  },
  {
    path: "/",
    name: "login",
    meta: { auth: false, title: "Login" },
    component: () => import("../views/Login/Login.vue"),
  },
  {
    path: "/setting",
    name: "setting",
    meta: { auth: true, title: "Sozlamalar" },
    component: () => import("../views/Setting/Setting.vue"),
  },
  {
    path: "/filiallar",
    name: "filiallar",
    meta: { auth: true, title: "Filiallar", role: ["admin"] },
    component: () => import("../views/Filiallar/Filiallar.vue"),
  },
  {
    path: "/filial_mahsulotlar/:id",
    name: "filial_mahsulotlar",
    meta: {
      auth: true,
      title: "Filial",
      role: ["admin"],
      iscomponent: true,
    },
    component: () => import("../views/Filiallar/FilialMahsulotlar.vue"),
  },
  {
    path: "/omborlar",
    name: "omborlar",
    meta: { auth: true, title: "Omborlar", role: ["admin"] },
    component: () => import("../views/Omborlar/Omborlar.vue"),
  },
  {
    path: "/ombor/:id",
    name: "ombor",
    meta: {
      auth: true,
      title: "Ombor",
      role: ["admin"],
      iscomponent: true,
    },
    component: () => import("../views/Omborlar/Ombor.vue"),
  },
  {
    path: "/taminotlar",
    name: "taminotlar",
    meta: { auth: true, title: "Ta'minotlar", role: ["admin"] },
    component: () => import("../views/Ta'minotlar/Ta'minotlar.vue"),
  },
  {
    path: "/taminot/:id",
    name: "taminot",
    meta: {
      auth: true,
      title: "Ta'minot",
      role: ["admin"],
      iscomponent: true,
    },
    component: () => import("../views/Ta'minotlar/Ta'minot.vue"),
  },
  {
    path: "/taminotchilar",
    name: "taminotchilar",
    meta: { auth: true, title: "Ta'minotchilar", role: ["admin"] },
    component: () => import("../views/Ta'minotchilar/Ta'minotchilar.vue"),
  },
  {
    path: "/taminotchi/:id",
    name: "taminotchi",
    meta: {
      auth: true,
      title: "Ta'minotchi",
      role: ["admin"],
      iscomponent: true,
    },
    component: () => import("../views/Ta'minotchilar/Ta'minotchi.vue"),
  },
  {
    path: "/hodimlar/:id",
    name: "hodimlar",
    meta: {
      auth: true,
      title: "Hodimlar",
      iscomponent: role == "admin" ? true : false,
    },
    component: () => import("../views/Hodimlar/Hodimlar.vue"),
  },
  {
    path: "/hodim/:id",
    name: "hodim",
    meta: { auth: true, title: "Hodim", iscomponent: true },
    component: () => import("../views/Hodimlar/Hodim.vue"),
  },
  {
    path: "/mijozlar",
    name: "mijozlar",
    meta: { auth: true, title: "Mijozlar", role: ["branch_admin"] },
    component: () => import("../views/Mijozlar/Mijozlar.vue"),
  },
  {
    path: "/mijoz/:id",
    name: "mijoz",
    meta: {
      auth: true,
      title: "Mijoz",
      iscomponent: true,
      role: ["branch_admin"],
    },
    component: () => import("../views/Mijozlar/Mijoz.vue"),
  },
  {
    path: "/credits",
    name: "credits",
    meta: {
      auth: true,
      title: "Muddatli to'lov",
      role: ["branch_admin"],
    },
    component: () => import("../views/Credits/Credits.vue"),
  },
  {
    path: "/credit/:id",
    name: "credit",
    meta: {
      auth: true,
      title: "Muddatli to'lov",
      iscomponent: true,
      role: ["branch_admin"],
    },
    component: () => import("../views/Credits/Credit.vue"),
  },
  {
    path: "/nasiyalar",
    name: "nasiyalar",
    meta: { auth: true, title: "Nasiyalar", role: ["branch_admin"] },
    component: () => import("../views/Nasiyalar/Nasiyalar.vue"),
  },
  {
    path: "/nasiya/:id",
    name: "nasiya",
    meta: {
      auth: true,
      title: "Nasiya",
      iscomponent: true,
      role: ["branch_admin"],
    },
    component: () => import("../views/Nasiyalar/Nasiya.vue"),
  },
  {
    path: "/return",
    name: "return",
    meta: { auth: true, title: "Mahsulot qaytarish", role: ["branch_admin"] },
    component: () => import("../views/Return/Return.vue"),
  },
  {
    path: "/taminot",
    name: "taminot",
    meta: {
      auth: true,
      title: "Ta'minot",
      role: ["branch_admin"],
    },
    component: () => import("../views/Ta'minotlar/FilialTa'minot.vue"),
  },
  {
    path: "/mahsulotlar/:id",
    name: "mahsulotlar",
    meta: {
      auth: true,
      title: "Mahsulotlar",
      role: ["branch_admin"],
    },
    component: () => import("../views/Mahsulotlar/Mahsulotlar.vue"),
  },
  {
    path: "/revision/:id",
    name: "revision",
    meta: {
      auth: true,
      title: "Mahsulotlar qoldig'i",
      role: ["branch_admin"],
    },
    component: () => import("../views/Revision/Revision.vue"),
  },
  {
    path: "/chiqim",
    name: "chiqim",
    meta: {
      auth: true,
      title: "Chiqim",
      role: ["branch_admin"],
    },
    component: () => import("../views/Chiqim/Chiqim.vue"),
  },
  {
    path: "/kassa",
    name: "kassa",
    meta: { auth: true, title: "Kassa", role: ["branch_admin"] },
    component: () => import("../views/Kassa/Kassa.vue"),
  },
  {
    path: "/hisobotlar/:id",
    name: "hisobotlar",
    meta: {
      auth: true,
      title: "Hisobotlar",
      iscomponent: role == "admin" ? true : false,
    },
    component: () => import("../views/Hisobotlar/Hisobotlar.vue"),
  },
];

routes = routes.filter((route) => {
  if (route.meta.role) {
    return route.meta.role.includes(role);
  } else {
    return route;
  }
});

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const loggedIn = localStorage.getItem("access_token") !== null;

  if (to.matched.some((record) => record.meta.auth)) {
    if (!loggedIn) {
      next("/");
    }
  }
  next();
});

export default router;
