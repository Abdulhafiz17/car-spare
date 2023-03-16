<template>
  <h3>Ta'minot</h3>
  <div class="row">
    <div class="col-md-4"></div>
    <div class="col-md-4 my-1"></div>
    <div class="col-md-4"></div>
  </div>
  <hr />

  <ul class="nav nav-pills nav-justified">
    <li class="nav-item">
      <button
        class="nav-link"
        :class="template == 'active' ? 'active' : ''"
        @click="template = ''"
        @click.passive="template = 'active'"
      >
        Faol ta'minotlar
      </button>
    </li>
    <li class="nav-item">
      <button
        class="nav-link"
        :class="template == 'closed' ? 'active' : ''"
        @click="template = ''"
        @click.passive="template = 'closed'"
      >
        Yakunlangan ta'minotlar
      </button>
    </li>
  </ul>

  <div class="tab-content pt-2">
    <div v-if="template == 'active'">
      <Active @setloading="setloading" />
    </div>
    <div v-if="template == 'closed'">
      <Closed @setloading="setloading" />
    </div>
  </div>
</template>

<script>
import Active from "./FaolTa'minotlar.vue";
import Closed from "./YakunlanganTa'minotlar.vue";
export default {
  name: "Ta'minot",
  emits: ["setloading"],
  components: { Active, Closed },
  data() {
    return {
      template: "",
    };
  },
  created() {
    this.template = "active";
  },
  methods: {
    setloading(loading) {
      this.$emit("setloading", loading);
    },
  },
};
</script>
