<template>
  <h3>{{ role == "admin" ? branch?.name + " hisobotlari" : "Hisobotlar" }}</h3>
  <div class="row">
    <div class="col-md-4"></div>
    <div class="col-md-4 my-1"></div>
    <div class="col-md-4"></div>
  </div>

  <hr />

  <div class="row mb-1">
    <div class="col-12">
      <div class="row">
        <div class="col-md-5">
          <input
            type="date"
            class="form-control form-control-sm"
            required
            v-model="from_time"
          />
        </div>
        <div class="col-md-5">
          <input
            type="date"
            class="form-control form-control-sm"
            required
            v-model="to_time"
          />
        </div>
        <div class="col-md-2">
          <button
            class="btn btn-sm btn-block btn-outline-primary"
            @click="getStatistics()"
          >
            <i class="fa fa-search"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="responsive-y" style="max-height: 80vh">
    <div class="row">
      <div class="col-md-4 mb-1" v-for="item in history" :key="item">
        <div
          class="card shadow"
          @click="
            date = item.day;
            getOrders(0, 25);
          "
        >
          <div class="card-body">
            <strong>{{ item.day }}</strong>
            <ul class="list-group">
              <li class="list-group-item">
                <span>Savdo</span>
                <span>{{
                  _.format(
                    item.trade_total_price + item.trade_from_comp_total_price
                  ) + " so'm"
                }}</span>
              </li>
              <li class="list-group-item">
                <span>Tan narx</span>
                <span>{{
                  _.format(
                    item.trade_total_tan_narx +
                      item.trade_from_comp_total_tan_narx
                  ) + " so'm"
                }}</span>
              </li>
              <li class="list-group-item">
                <span>Buyurtmadan chegirma</span>
                <span>{{ _.format(item.order_discount) + " so'm" }}</span>
              </li>
              <li class="list-group-item">
                <span>Mahsulotdan chegirma</span>
                <span>{{
                  _.format(
                    item.trade_total_discount +
                      item.trade_from_comp_total_discount
                  ) + " so'm"
                }}</span>
              </li>
              <hr />
              <li class="list-group-item">
                <span>Savdodan kirim</span>
                <span>{{ _.format(item.income_trade_sum) + " so'm" }}</span>
              </li>
              <ul class="list-group" v-if="item.incomes_trade.length">
                <li
                  class="list-group-item"
                  v-for="item1 in item.incomes_trade"
                  :key="item1"
                  v-show="item1.sum_price"
                >
                  {{ _.format(item1.sum_price) + " so'm " + item1.type }}
                </li>
              </ul>
              <hr />
              <li class="list-group-item">
                <span>Nasiyadan kirim</span>
                <span>{{ _.format(item.income_loan_sum) + " so'm" }}</span>
              </li>
              <ul class="list-group" v-if="item.incomes_loan.length">
                <li
                  class="list-group-item"
                  v-for="item1 in item.incomes_loan"
                  :key="item1"
                  v-show="item1.sum_price"
                >
                  {{ _.format(item1.sum_price) + " so'm " + item1.type }}
                </li>
              </ul>
              <hr />
              <li class="list-group-item">
                <span>Chiqim</span>
                <span>{{ _.format(item.expense_sum) + " so'm" }}</span>
              </li>
              <li class="list-group-item">
                <span>Qaytarish chiqimi</span>
                <span>{{ _.format(item.returned_price) + " so'm" }}</span>
              </li>
              <hr />
              <li
                class="list-group-item"
                :class="
                  benefit(item) > 0
                    ? 'text-success'
                    : benefit(item) < 0
                    ? 'text-danger'
                    : ''
                "
              >
                <span>{{ benefit(item) >= 0 ? "Foyda" : "Zarar" }}</span>
                <span>{{ _.format(benefit(item)) + " so'm" }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>

  <button
    data-toggle="modal"
    data-target="#orders"
    toggle-orders-modal
    v-show="false"
  ></button>
  <modal id="orders">
    <template #header>
      <h4>{{ date }}</h4>
    </template>
    <template #body>
      <ul class="list-group gap-1">
        <li
          class="list-group-item"
          v-for="item in orders?.data"
          :key="item"
          data-toggle="modal"
          data-target="#order"
          @click="order_id = item.Orders.id"
        >
          <span>Buyurtma raqami: {{ item.Orders.ordinal_number }}</span>
          <span>
            Mijoz: {{ item.Customers ? item.Customers.name : "Umumiy" }}
          </span>
        </li>
      </ul>
    </template>
    <template #footer>
      <button class="btn btn-outline-danger" data-dismiss="modal">
        <i class="far fa-circle-xmark"></i>
      </button>
    </template>
  </modal>

  <modal id="order" size="lg">
    <template #header>
      <Order
        :order_id="order_id"
        :branch-id="$route.params.id"
        :order_template="'header'"
        @setloading="setloading"
      />
      <button class="btn btn-outline-info" @click="routerToReturn(order_id)">
        <i class="fa fa-undo"></i>
      </button>
    </template>
    <template #body>
      <Order
        :order_id="order_id"
        :branch-id="$route.params.id"
        :order_template="'body'"
        @setloading="setloading"
      />
    </template>
    <template #footer>
      <button
        class="btn btn-outline-danger"
        data-dismiss="modal"
        close-order-modal
      >
        <i class="far fa-circle-xmark"></i>
      </button>
    </template>
  </modal>
</template>

<script>
import * as api from "../../components/Api/api";
import Pagination from "@/components/Pagination/Pagination.vue";
import Order from "@/components/Template/Order.vue";
export default {
  name: "Hiobotlar",
  emits: ["setloading"],
  components: { Pagination, Order },
  data() {
    return {
      _: Intl.NumberFormat(),
      role: localStorage["role"],
      branch: null,
      from_time: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        .toISOString()
        .substring(0, 10),
      to_time: new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate() + 1
      )
        .toISOString()
        .substring(0, 10),
      history: [],
      date: "",
      orders: null,
      order_id: null,
    };
  },
  created() {
    this.getBranch();
  },
  methods: {
    setloading(loading) {
      this.$emit("setloading", loading);
    },
    getBranch() {
      this.$emit("setloading", true);
      api
        .branch(this.$route.params.id)
        .then((res) => {
          this.branch = res.data.Branches;
          this.getStatistics();
        })
        .catch((err) => {
          this.$emit("setloading", false);
          api.catchError(err);
        });
    },
    getStatistics() {
      api
        .tradeStatistics(this.from_time, this.to_time, this.$route.params.id)
        .then((res) => {
          this.history = res.data;
          this.$emit("setloading", false);
        })
        .catch((err) => {
          this.$emit("setloading", false);
          api.catchError(err);
        });
    },
    benefit(data) {
      return (
        data.trade_total_price +
        data.trade_from_comp_total_price -
        (data.trade_total_tan_narx + data.trade_from_comp_total_tan_narx) -
        data.order_discount -
        (data.trade_total_discount + data.trade_from_comp_total_discount) -
        data.expense_sum -
        data.returned_price
      );
    },
    getOrders(page, limit) {
      this.$emit("setloading", true);
      api
        .orders(
          this.$route.params.id,
          0,
          0,
          0,
          0,
          true,
          this.date,
          this.date,
          page,
          limit
        )
        .then((res) => {
          this.orders = res.data;
          document.querySelector("[toggle-orders-modal]").click();
          this.$emit("setloading", false);
        })
        .catch((err) => {
          this.$emit("setloading", false);
          api.catchError(err);
        });
    },
    routerToReturn(order_id) {
      localStorage.setItem("order_id_for_return", order_id);
      document.querySelector("[toggle-orders-modal]").click();
      document.querySelector("[close-order-modal]").click();
      this.$router.push("/return");
    },
  },
};
</script>
