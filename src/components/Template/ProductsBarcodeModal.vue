<template>
  <button
    v-show="false"
    data-toggle="modal"
    data-target="#product-barcode"
  ></button>

  <modal id="product-barcode">
    <template #body>
      <img :src="api.url + logo" :alt="logo" @error="getBranch()" v-if="logo" />
      <pre>{{ product }}</pre>
    </template>
    <template #footer>
      <button class="btn btn-outline-primary">
        <i class="fa fa-print"></i>
      </button>
      <button class="btn btn-outline-danger" data-dismiss="modal">
        <i class="far fa-circle-xmark"></i>
      </button>
    </template>
  </modal>
</template>

<script>
import * as api from "../Api/api";
export default {
  name: "ProductsBarcodeModal",
  emits: ["setloading"],
  data() {
    return {
      logo: null,
      product: null,
    };
  },
  setup() {
    return { api };
  },
  created() {
    this.getBranch();
  },
  methods: {
    getBranch() {
      api
        .branch(this.$route.params.id)
        .then((res) => {
          this.logo = res.data.file;
        })
        .catch((err) => {
          this.$emit("setloading", false);
          api.catchError(err);
        });
    },
    start(product) {
      this.product = product;
      document.querySelector(`[data-target="#product-barcode"]`).click();
    },
  },
};
</script>
