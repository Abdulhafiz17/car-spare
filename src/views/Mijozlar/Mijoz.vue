<template>
  <h3>{{ "Mijoz " + customer?.name }}</h3>
  <div class="row">
    <div class="col-md-4"></div>
    <div class="col-md-4 my-1"></div>
    <div class="col-md-4"></div>
  </div>
  <hr />
  <div class="row my-1">
    <div class="col-md-5 mb-1">
      <input
        type="date"
        class="form-control form-control-sm"
        v-model="from_date"
      />
    </div>
    <div class="col-md-5 mb-1">
      <input
        type="date"
        class="form-control form-control-sm"
        v-model="to_date"
      />
    </div>
    <div class="col-md-2">
      <button
        class="btn btn-sm btn-block btn-outline-primary"
        @click="getOrders(0, 25)"
      >
        <i class="fa fa-search" />
      </button>
    </div>
  </div>

  <div class="responsive-y" style="max-height: 80vh">
    <ul class="list-group">
      <li
        class="list-group-item"
        v-for="item in orders"
        :key="item"
        data-toggle="modal"
        data-target="#order"
        @click="order_id = item.Orders.id"
      >
        <h5>Buyurtma - {{ item.Orders.ordinal_number }}</h5>
        <strong>
          {{ item.Orders.time.substring(0, item.Orders.time.length - 9) }}
        </strong>
      </li>
    </ul>
    <Pagination :page="page" :pages="pages" :limit="limit" @get="getOrders" />
  </div>

  <div class="modal fade" id="order">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <Order
            :order_id="order_id"
            :branch-id="customer?.branch_id"
            :order_template="'header'"
            @setloading="setloading"
          />
        </div>
        <div class="modal-body">
          <Order
            :order_id="order_id"
            :branch-id="customer?.branch_id"
            :order_template="'body'"
            @setloading="setloading"
          />
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline-danger" data-dismiss="modal">
            <i class="far fa-circle-xmark" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { catchError, customer, orders } from "@/components/Api/api";
import Pagination from "../../components/Pagination/Pagination.vue";
import Order from "../../components/Template/Order.vue";
export default {
  name: "Mijoz",
  emits: ["setloading"],
  components: { Pagination, Order },
  data() {
    return {
      _: Intl.NumberFormat(),
      page: 0,
      pages: 1,
      limit: 25,
      from_date: "",
      to_date: "",
      customer: null,
      orders: [],
      order_id: null,
    };
  },
  created() {
    this.getCustomer();
  },
  methods: {
    setloading(loading) {
      this.$emit("setloading", loading);
    },
    getCustomer() {
      customer(this.$route.params.id)
        .then((Response) => {
          this.customer = Response.data;
          this.getOrders(0, 25);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getOrders(page, limit) {
      this.$emit("setloading", true);
      orders(
        this.customer?.branch_id,
        0,
        0,
        0,
        this.$route.params.id,
        true,
        this.from_date,
        this.to_date,
        page,
        limit
      )
        .then((Response) => {
          this.page = Response.data.current_page;
          this.pages = Response.data.pages;
          this.limit = Response.data.limit;
          this.orders = Response.data.data;
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

<style></style>
