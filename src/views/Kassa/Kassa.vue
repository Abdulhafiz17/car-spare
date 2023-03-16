<template>
  <Orders
    :current_order="order"
    :order_balance="order_balance"
    :is_confirmed="confirmed"
    @setloading="setloading"
    @setOrder="setOrder"
    @isConfirmed="isConfirmed"
  />
  <hr />
  <Products
    :current_order="order"
    @setloading="setloading"
    @getOrderBalance="getOrderBalance"
  />
  <Bar
    :current_order="order"
    :order_balance="order_balance"
    @setloading="setloading"
    @getOrderBalance="getOrderBalance"
    @isConfirmed="isConfirmed"
  />
</template>

<script>
import { catchError, tradeBalance } from "@/components/Api/api";
import Orders from "./Buyurtmalar.vue";
import Products from "./Mahsulotlar.vue";
import Bar from "./Tasdiqlash.vue";
export default {
  name: "Kassa",
  emits: ["setloading"],
  components: { Orders, Products, Bar },
  data() {
    return {
      order: null,
      order_balance: null,
      confirmed: false,
    };
  },
  watch: {
    order(order) {
      if (order) {
        this.getOrderBalance(order.Orders.id);
      }
    },
  },
  created() {},
  mounted() {
    document.querySelector("[barcode]").focus();
  },
  methods: {
    setloading(loading) {
      this.$emit("setloading", loading);
    },
    setOrder(order) {
      this.order = order;
    },
    getOrderBalance(balance) {
      this.order_balance = balance;
      this.$emit("setloading", false);
      // this.$emit("setloading", true);
      // tradeBalance(order_id)
      //   .then((Response) => {
      //     this.order_balance = Response.data;
      //     this.$emit("setloading", false);
      //   })
      //   .catch((error) => {
      //     this.$emit("setloading", false);
      //     catchError(error);
      //   });
    },
    isConfirmed(confirmed) {
      this.confirmed = confirmed;
    },
  },
};
</script>
