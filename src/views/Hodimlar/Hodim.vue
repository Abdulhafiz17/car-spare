<template>
  <h3>{{ "Hodim " + user?.name }}</h3>
  <div class="row">
    <div class="col-md-4"></div>
    <div class="col-md-4 my-1"></div>
    <div class="col-md-4"></div>
  </div>
  <hr />

  <tabs
    :tab_buttons="[`To'lovlar`, `Savdolar`]"
    :tab_slots="[`tolovlar`, `savdolar`]"
  >
    <template #tolovlar>
      <div class="row">
        <div class="col-md-5 mb-1">
          <input
            type="date"
            class="form-control form-control-sm"
            v-model="from_time"
          />
        </div>
        <div class="col-md-5 mb-1">
          <input
            type="date"
            class="form-control form-control-sm"
            v-model="to_time"
          />
        </div>
        <div class="col-md-2">
          <button
            class="btn btn-sm btn-block btn-outline-secondary"
            @click="getExpenses(0, 25)"
          >
            <i class="fa fa-search"></i>
          </button>
        </div>
      </div>
      <div class="responsive-y" style="max-height: 70vh">
        <table class="table table-sm table-hover">
          <thead>
            <tr>
              <th>Summa</th>
              <th>Izoh</th>
              <th>Hodim</th>
              <th>Sana</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in expenses" :key="item">
              <td>{{ $util.currency(item.Expenses.money) + " so'm" }}</td>
              <td>{{ item.Expenses.comment }}</td>
              <td>{{ item.user }}</td>
              <td>{{ item.Expenses.time.replace("T", " ") }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="4">
                <Pagination
                  :page="page"
                  :pages="pages"
                  :limit="limit"
                  @get="getExpenses"
                />
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </template>
    <template #savdolar>
      <div class="row">
        <div class="col-md-5 mb-1">
          <input
            type="date"
            class="form-control form-control-sm"
            v-model="from_time"
          />
        </div>
        <div class="col-md-5 mb-1">
          <input
            type="date"
            class="form-control form-control-sm"
            v-model="to_time"
          />
        </div>
        <div class="col-md-2">
          <button
            class="btn btn-sm btn-block btn-outline-secondary"
            @click="getOrders(0, 25)"
          >
            <i class="fa fa-search"></i>
          </button>
        </div>
      </div>
      <div class="responsive-y" style="max-height: 70vh">
        <div class="row">
          <div class="col-md-12 my-1" v-for="item in orders" :key="item">
            <li
              class="list-group-item list-group-item-action"
              data-toggle="modal"
              data-target="#order"
              @click="order_id = item.Orders.id"
            >
              <h5>{{ "Buyurtma raqami: " + item.Orders.ordinal_number }}</h5>
              <strong>
                {{ item.Orders.time.substring(0, item.Orders.time.length - 9) }}
              </strong>
            </li>
          </div>
        </div>
        <Pagination
          :page="page"
          :pages="pages"
          :limit="limit"
          @get="getOrders"
        />
      </div>
    </template>
  </tabs>

  <div class="modal fade" id="order">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <Order
            :order_id="order_id"
            :branch-id="user?.branch_id"
            :order_template="'header'"
            @setloading="setloading"
          />
        </div>
        <div class="modal-body">
          <Order
            :order_id="order_id"
            :branch-id="user?.branch_id"
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
import { catchError, orders, user, userExpenses } from "@/components/Api/api";
import Pagination from "../../components/Pagination/Pagination.vue";
import Order from "../../components/Template/Order.vue";
export default {
  name: "Hodim",
  emits: ["setloading"],
  components: { Pagination, Order },
  data() {
    return {
      _: Intl.NumberFormat(),
      role: localStorage.getItem("role"),
      branch_id: localStorage.getItem("branch_id"),
      user: null,
      page: 0,
      pages: 1,
      limit: 25,
      from_time: "",
      to_time: "",
      expenses: [],
      orders: [],
      order_id: null,
    };
  },
  created() {
    this.getUser();
  },
  mounted() {
    document.querySelector("[name='tolovlar']").onclick = () => {
      this.from_time = "";
      this.to_time = "";
      this.getExpenses(0, 25);
    };
    document.querySelector("[name='savdolar']").onclick = () => {
      this.from_time = "";
      this.to_time = "";
      this.getOrders(0, 25);
    };
  },
  methods: {
    setloading(loading) {
      this.$emit("setloading", loading);
    },
    getUser() {
      user(this.$route.params.id)
        .then((Response) => {
          this.user = Response.data;
          this.getExpenses(0, 25);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getExpenses(page, limit) {
      this.$emit("setloading", true);
      userExpenses(
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
          this.expenses = Response.data.data;
          this.$emit("setloading", false);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getOrders(page, limit) {
      this.$emit("setloading", true);
      orders(
        this.branch_id,
        0,
        this.$route.params.id,
        0,
        0,
        true,
        this.from_time,
        this.to_time,
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

<style lang="scss" scoped>
li {
  cursor: pointer;
}
</style>
