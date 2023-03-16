import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import tabs from "./components/Tabs/tabs.vue";
import collapse from "./components/Collapse/collapse.vue";
import modal from "./components/Modal/Modal.vue";

createApp(App)
  .use(router)
  .component("tabs", tabs)
  .component("collapse", collapse)
  .component("modal", modal)
  .mount("#app");
