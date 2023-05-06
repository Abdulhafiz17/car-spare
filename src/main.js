import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import tabs from "./components/Tabs/tabs.vue";
import collapse from "./components/Collapse/collapse.vue";
import modal from "./components/Modal/Modal.vue";
const util = {
  currency(number = 0) {
    return Intl.NumberFormat().format(number.toFixed(2));
  },
};

const app = createApp(App);

app.config.globalProperties.$util = util;

app
  .use(router)
  .component("tabs", tabs)
  .component("collapse", collapse)
  .component("modal", modal)
  .mount("#app");
