<template>
  <h3>
    {{ branch?.Branches.name + " mahsulotlari" }}
  </h3>
  <div class="row">
    <div class="col-md-4"></div>
    <div class="col-md-4 my-1"></div>
    <div class="col-md-4"></div>
  </div>

  <hr />

  <tabs
    :tab_buttons="[`Narx belgilangan`, `Narx belgilanmagan`, `Qoldiq tugagan`]"
    :tab_slots="[`price_true`, `price_false`, `quantity_false`]"
  >
    <template #price_true>
      <ProductsTable
        type="price_true"
        table-height="74vh"
        @setloading="setloading"
      />
    </template>
    <template #price_false>
      <ProductsTable
        type="price_false"
        table-height="74vh"
        @setloading="setloading"
      />
    </template>
    <template #quantity_false>
      <ProductsTable
        type="quantity_false"
        table-height="74vh"
        @setloading="setloading"
      />
    </template>
  </tabs>
</template>

<script>
import {
  branch,
  catchError,
  transfers,
  warehouses,
} from "@/components/Api/api";
import ProductsTable from "../../components/Template/ProductsTable.vue";
import Pagination from "../../components/Pagination/Pagination.vue";
export default {
  name: "Tarix",
  emits: ["setloading"],
  components: { ProductsTable, Pagination },
  data() {
    return {
      _: Intl.NumberFormat(),
      id: this.$route.params.id,
      branch: null,
      page: 0,
      pages: 1,
      limit: 25,
      from_time: "",
      to_time: "",
      warehouse_id: 0,
      warehouses: [],
      transfers_waiting: [],
      transfers_accepted: [],
    };
  },
  created() {
    this.getBranch();
  },
  mounted() {},
  methods: {
    setloading(loading) {
      this.$emit("setloading", loading);
    },
    getBranch() {
      branch(this.id)
        .then((Response) => {
          this.branch = Response.data;
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getWarehouses() {
      warehouses()
        .then((Response) => {
          this.warehouses = Response.data;
          this.getTransfersWaiting(0, 25);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getTransfersWaiting(page, limit) {
      this.$emit("setloading", true);
      transfers(
        this.warehouse_id,
        "filialga_berish_kutish",
        this.$route.params.id,
        this.from_time,
        this.to_time,
        page,
        limit
      )
        .then((Response) => {
          this.page = Response.data.current_page;
          this.pages = Response.data.pages;
          this.limit = Response.data.limit;
          this.transfers_waiting = Response.data.data;
          this.$emit("setloading", false);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getTransfersAccepted(page, limit) {
      this.$emit("setloading", true);
      transfers(
        this.warehouse_id,
        "filialga_berish_tasdiqlandi",
        this.$route.params.id,
        this.from_time,
        this.to_time,
        page,
        limit
      )
        .then((Response) => {
          this.page = Response.data.current_page;
          this.pages = Response.data.pages;
          this.limit = Response.data.limit;
          this.transfers_accepted = Response.data.data;
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
