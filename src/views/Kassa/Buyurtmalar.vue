<template>
  <div class="row">
    <div class="col-md-3">
      <span>
        {{
          order
            ? order.Orders.ordinal_number + " - buyurtma"
            : "Buyurtma mavjud emas"
        }}
      </span>
      <br />
      <span>
        {{
          "Buyurtma balansi: " +
          (order && balance ? $util.currency(balance) : 0) +
          " so'm"
        }}
      </span>
    </div>
    <div class="col-md-9">
      <div class="responsive-x orders-row">
        <button class="btn btn-sm btn-outline-success" @click="postOrder()">
          <i class="fa fa-plus" />
        </button>
        <div class="btn-group btn-group-sm" v-for="item in orders" :key="item">
          <button
            class="btn"
            :class="
              order?.Orders.id == item.Orders.id
                ? 'btn-primary'
                : 'btn-outline-primary'
            "
            @click="$emit('setOrder', item)"
          >
            {{ "№ " + item.Orders.ordinal_number }}
          </button>
          <button class="btn btn-danger" @click="deleteOrder(item.Orders.id)">
            <i class="fa fa-trash" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  catchError,
  createOrder,
  orders,
  removeOrder,
  success,
} from "@/components/Api/api";
export default {
  name: "Orders",
  props: ["current_order", "order_balance", "is_confirmed"],
  emits: ["setloading", "setOrder", "isConfirmed"],
  data() {
    return {
      _: Intl.NumberFormat(),
      branch_id: localStorage["branch_id"],
      orders: [],
    };
  },
  computed: {
    order() {
      return this.$props.current_order;
    },
    balance() {
      return this.$props.order_balance;
    },
    confirmed() {
      return this.$props.is_confirmed;
    },
  },
  watch: {
    confirmed(confirmed) {
      if (confirmed) {
        this.getOrders();
      }
    },
  },
  created() {
    this.getOrders();
  },
  methods: {
    postOrder() {
      this.$emit("setloading", true);
      createOrder()
        .then((Response) => {
          success().then(() => {
            this.getOrders();
          });
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getOrders() {
      this.$emit("setloading", true);
      orders(this.branch_id, 0, 0, 0, 0, false, "", "", 0, 50)
        .then((Response) => {
          this.orders = Response.data.data;
          this.$emit("setOrder", this.orders.length ? this.orders[0] : null);
          this.$emit("isConfirmed", false);
          this.$emit("setloading", false);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    deleteOrder(order_id) {
      this.$emit("setloading", true);
      removeOrder(order_id)
        .then((Response) => {
          success().then(() => {
            this.getOrders();
          });
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.orders-row {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 10px;
  text-align: left;
}
</style>
