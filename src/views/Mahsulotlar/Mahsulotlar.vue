<template>
  <h3>Mahsulotlar</h3>
  <div class="row">
    <div class="col-md-4"></div>
    <div class="col-md-4 my-1"></div>
    <div class="col-md-4"></div>
  </div>
  <hr />

  <tabs
    :tab_buttons="[
      `Narx belgilangan`,
      `Narx belgilanmagan`,
      `Tarkib buzilgan`,
      `Qoldiq tugagan`,
    ]"
    :tab_slots="[`price_true`, `price_false`, `opened`, `quantity_false`]"
  >
    <template #price_true>
      <ProductsTable
        type="price_true"
        table-height="70vh"
        edit="true"
        barcode=""
        @setloading="setloading"
      />
    </template>
    <template #price_false>
      <ProductsTable
        type="price_false"
        table-height="70vh"
        edit="true"
        @setloading="setloading"
      />
    </template>
    <template #quantity_false>
      <ProductsTable
        type="quantity_false"
        table-height="70vh"
        @setloading="setloading"
      />
    </template>
    <template #opened>
      <OpenedProducts table-height="70vh" @setloading="setloading" />
    </template>
  </tabs>
</template>

<script>
import ProductsTable from "@/components/Template/ProductsTable.vue";
import OpenedProducts from "@/components/Template/OpenedProducts.vue";
export default {
  name: "Mahsulotlar",
  emits: ["setloading"],
  components: { ProductsTable, OpenedProducts },
  data() {
    return {
      _: Intl.NumberFormat(),
      branch_id: localStorage.getItem("branch_id"),
    };
  },
  created() {},
  methods: {
    setloading(loading) {
      this.$emit("setloading", loading);
    },
  },
};
</script>

<style lang="scss" scoped></style>
