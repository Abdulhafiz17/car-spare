<template>
  <h3>{{ "Ombor " + warehouse?.name }}</h3>
  <div class="row">
    <div class="col-md-4"></div>
    <div class="col-md-4 my-1"></div>
    <div class="col-md-4"></div>
  </div>
  <hr />

  <tabs
    :tab_buttons="[
      `Ombor mahsulotlari`,
      `Filialga mahsulot yuborish`,
      `Filialga yuborilgan mahsulotlar`,
    ]"
    :tab_slots="[`products`, `send_product`, `transfers`]"
  >
    <template #products>
      <Products @setloading="setloading" />
    </template>
    <template #send_product>
      <Transfer @setloading="setloading" />
    </template>
    <template #transfers>
      <Transfers @setloading="setloading" />
    </template>
  </tabs>
</template>

<script>
import { catchError, warehouse } from "@/components/Api/api";
import Products from "./Mahsulotlar.vue";
import Transfer from "./MahsulotYuborish.vue";
import Transfers from "./YuborilganMahsulotlar.vue";
export default {
  name: "Ombor",
  emits: ["setloading"],
  components: { Products, Transfer, Transfers },
  data() {
    return {
      id: this.$route.params.id,
      warehouse: null,
    };
  },
  created() {
    this.getWarehouse();
  },
  methods: {
    setloading(loading) {
      this.$emit("setloading", loading);
    },
    getWarehouse() {
      warehouse(this.id)
        .then((Response) => {
          this.warehouse = Response.data;
          this.template = "products";
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
  },
};
</script>
