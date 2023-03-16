<template>
  <Login @setloading="setloading" v-if="$route.name == 'login'" />
  <div v-else="$route.name !== 'login'">
    <Navbar />
    <div id="main-container" class="container-fluid p-2 responsive-y">
      <div id="main-card" class="card shadow p-1 responsive-y">
        <button
          @click="back()"
          class="btn btn-sm btn-outline-secondary btn-back"
          v-if="$route.meta.iscomponent"
        >
          <i class="fa fa-arrow-left"></i>
        </button>
        <Router-view @setloading="setloading" />
      </div>
    </div>
  </div>
  <Loading v-if="loading" />
</template>

<script>
import Login from "./views/Login/Login.vue";
import Navbar from "./components/Navbar/Navbar.vue";
import Loading from "./components/Animation/Loading.vue";
export default {
  name: "App",
  components: { Login, Navbar, Loading },
  data() {
    return {
      role: localStorage.getItem("role"),
      mode: localStorage.getItem("mode"),
      loading: true,
    };
  },
  watch: {
    $route(to) {
      document.title = `Car - spare - ${to.meta.title}`;
      this.setloading(true);
    },
  },
  created() {
    this.setMode();
  },
  mounted() {},
  methods: {
    setloading(loading) {
      this.loading = loading;
    },
    setMode() {
      if (this.mode == "dark") {
        document.querySelector("#app").classList.add("dark");
      } else {
        document.querySelector("#app").classList.remove("dark");
      }
    },
    back() {
      this.$router.go(-1);
    },
  },
};
</script>

<style>
@import url("./components/Style/main.css");
@import url("./components/Style/dark.css");
</style>
