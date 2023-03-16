<template>
  <h3>{{ "Ta'minotchi " + market?.name + " tarixi" }}</h3>
  <div class="row">
    <div class="col-md-4"></div>
    <div class="col-md-4 my-1"></div>
    <div class="col-md-4"></div>
  </div>

  <hr />

  <tabs
    :tab_buttons="[`Olingan ta'minotlar tarixi`, `To'lovlar tarixi`]"
    :tab_slots="[`supply`, `payment`]"
  >
    <template #supply>
      <Supply @setloading="setloading" />
    </template>
    <template #payment>
      <Payments @setloading="setloading" />
    </template>
  </tabs>
</template>

<script>
import { catchError, market } from "@/components/Api/api";
import Supply from "./Ta'minotlar.vue";
import Payments from "./To'lovlar.vue";
export default {
  name: "Market",
  emits: ["setloading"],
  components: { Supply, Payments },
  data() {
    return {
      market: null,
    };
  },
  created() {
    this.getMarket();
  },
  methods: {
    setloading(loading) {
      this.$emit("setloading", loading);
    },
    getMarket() {
      market(this.$route.params.id)
        .then((Response) => {
          this.market = Response.data;
          this.template = "supply";
          this.$emit("setloading", false);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
  },
};
</script>
