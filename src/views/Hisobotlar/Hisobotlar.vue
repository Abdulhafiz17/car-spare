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
          <div class="btn-group btn-group-sm w-100">
            <button
              class="btn btn-sm btn-outline-primary"
              @click="getStatistics()"
            >
              <i class="fa fa-search"></i>
            </button>
            <button
              v-if="from_time && to_time"
              class="btn btn-sm btn-outline-success"
              data-toggle="modal"
              data-target="#sum"
            >
              <i class="fa fa-money-bill"></i>
            </button>
          </div>
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
                  $util.currency(
                    item.trade_total_price + item.trade_from_comp_total_price
                  ) + " so'm"
                }}</span>
              </li>
              <li class="list-group-item">
                <span>Tan narx</span>
                <span>{{
                  $util.currency(
                    item.trade_total_tan_narx +
                      item.trade_from_comp_total_tan_narx
                  ) + " so'm"
                }}</span>
              </li>
              <li class="list-group-item">
                <span>Buyurtmadan chegirma</span>
                <span>{{ $util.currency(item.order_discount) + " so'm" }}</span>
              </li>
              <li class="list-group-item">
                <span>Mahsulotdan chegirma</span>
                <span>{{
                  $util.currency(
                    item.trade_total_discount +
                      item.trade_from_comp_total_discount
                  ) + " so'm"
                }}</span>
              </li>
              <hr />
              <li class="list-group-item">
                <span>Savdodan kirim</span>
                <span>{{
                  $util.currency(item.income_trade_sum) + " so'm"
                }}</span>
              </li>
              <ul class="list-group" v-if="item.incomes_trade.length">
                <li
                  class="list-group-item"
                  v-for="item1 in item.incomes_trade"
                  :key="item1"
                  v-show="item1.sum_price"
                >
                  {{ $util.currency(item1.sum_price) + " so'm " + item1.type }}
                </li>
              </ul>
              <hr />
              <li class="list-group-item">
                <span>Nasiyadan kirim</span>
                <span>{{
                  $util.currency(item.income_loan_sum) + " so'm"
                }}</span>
              </li>
              <ul class="list-group" v-if="item.incomes_loan.length">
                <li
                  class="list-group-item"
                  v-for="item1 in item.incomes_loan"
                  :key="item1"
                  v-show="item1.sum_price"
                >
                  {{ $util.currency(item1.sum_price) + " so'm " + item1.type }}
                </li>
              </ul>
              <hr />
              <li class="list-group-item">
                <span>Chiqim</span>
                <span>{{ $util.currency(item.expense_sum) + " so'm" }}</span>
              </li>
              <li class="list-group-item">
                <span>Qaytarish chiqimi</span>
                <span>{{ $util.currency(item.returned_price) + " so'm" }}</span>
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
                <span>{{ $util.currency(benefit(item)) + " so'm" }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>

  <button
    data-toggle="modal"
    data-target="#day"
    toggle-day-modal
    v-show="false"
  ></button>
  <modal id="day" size="xl">
    <template #header>
      <h4>{{ date }}</h4>
    </template>
    <template #body>
      <tabs
        :tab_buttons="[`Buyurtmalar`, `Chiqimlar`, `Qaytarilgan mahsulotlar`]"
        :tab_slots="['orders', 'expenses', 'returned_products']"
      >
        <template #orders>
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
        <template #expenses>
          <div class="row">
            <div
              v-if="fixed_expenses.data.length"
              :class="variable_expenses.data.length ? 'col-6' : 'col-12'"
            >
              Doimiy chiqimlar
              <div class="responsive-y" style="max-height: 50vh">
                <table class="table table-sm table-hover">
                  <thead>
                    <tr>
                      <th>Chiqim</th>
                      <th>Summa</th>
                      <th>Izoh</th>
                      <th>Sana</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in fixed_expenses.data" :key="item">
                      <td>{{ item.name }}</td>
                      <td>
                        {{
                          $util.currency(item.Expenses.money) +
                          " " +
                          item.Currencies.currency
                        }}
                      </td>
                      <td>{{ item.Expenses.comment }}</td>
                      <td>{{ item.Expenses.time.replace("T", " ") }}</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colspan="4">
                        <Pagination
                          :page="fixed_expenses.current_page"
                          :pages="fixed_expenses.pages"
                          :limit="fixed_expenses.limit"
                          @get="getFixedExpenses"
                        />
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
            <div
              v-if="variable_expenses.data.length"
              :class="fixed_expenses.data.length ? 'col-6' : 'col-12'"
            >
              Bir marttalik chiqimlar
              <div class="responsive-y" style="max-height: 50vh">
                <table class="table table-sm table-hover">
                  <thead>
                    <tr>
                      <th>Summa</th>
                      <th>Izoh</th>
                      <th>Sana</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in variable_expenses.data" :key="item">
                      <td>
                        {{
                          $util.currency(item.Expenses.money) +
                          " " +
                          item.Currencies.currency
                        }}
                      </td>
                      <td>{{ item.Expenses.comment }}</td>
                      <td>{{ item.Expenses.time.replace("T", " ") }}</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colspan="3">
                        <Pagination
                          :page="variable_expenses.current_page"
                          :pages="variable_expenses.pages"
                          :limit="variable_expenses.limit"
                          @get="getVariableExpenses"
                        />
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </template>
        <template #returned_products>
          <div
            class="responsive-y"
            style="max-height: 50vh"
            v-if="returned_products.data.length"
          >
            <table class="table table-sm table-hover">
              <thead>
                <tr>
                  <th>Mahsulot</th>
                  <th>Hajm</th>
                  <th>Hodim</th>
                  <th>Sana</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in returned_products.data" :key="item">
                  <td>
                    {{
                      item.Returned_products?.trade?.product?.category?.name +
                      " - " +
                      item.Returned_products?.trade?.product?.product_type
                        ?.name +
                      " - " +
                      item.Returned_products?.trade?.product?.product_type
                        ?.name2
                    }}
                  </td>
                  <td>
                    {{
                      $util.currency(item.Returned_products?.quantity) +
                      " " +
                      item.Returned_products?.trade?.product?.olchov_birligi
                    }}
                  </td>
                  <td>{{ item.user }}</td>
                  <td>
                    {{
                      item.Returned_products.time
                        .replace("T", " ")
                        .substring(0, 16)
                    }}
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="4">
                    <Pagination
                      :page="returned_products.current_page"
                      :pages="returned_products.pages"
                      :limit="returned_products.limit"
                      @get="getReturnedProducts"
                    />
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </template>
      </tabs>
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

  <modal id="sum">
    <template #header>
      <h4>Umumiy hisobot</h4>
    </template>
    <template #body>
      <div class="card-body" v-for="item in history_sum" :key="item">
        <strong>{{ item.day }}</strong>
        <ul class="list-group">
          <li class="list-group-item">
            <span>Savdo</span>
            <span>{{
              $util.currency(
                item.trade_total_price + item.trade_from_comp_total_price
              ) + " so'm"
            }}</span>
          </li>
          <li class="list-group-item">
            <span>Tan narx</span>
            <span>{{
              $util.currency(
                item.trade_total_tan_narx + item.trade_from_comp_total_tan_narx
              ) + " so'm"
            }}</span>
          </li>
          <li class="list-group-item">
            <span>Buyurtmadan chegirma</span>
            <span>{{ $util.currency(item.order_discount) + " so'm" }}</span>
          </li>
          <li class="list-group-item">
            <span>Mahsulotdan chegirma</span>
            <span>{{
              $util.currency(
                item.trade_total_discount + item.trade_from_comp_total_discount
              ) + " so'm"
            }}</span>
          </li>
          <hr />
          <li class="list-group-item">
            <span>Savdodan kirim</span>
            <span>{{ $util.currency(item.income_trade_sum) + " so'm" }}</span>
          </li>
          <ul class="list-group" v-if="item.incomes_trade.length">
            <li
              class="list-group-item"
              v-for="item1 in item.incomes_trade"
              :key="item1"
              v-show="item1.sum_price"
            >
              {{ $util.currency(item1.sum_price) + " so'm " + item1.type }}
            </li>
          </ul>
          <hr />
          <li class="list-group-item">
            <span>Nasiyadan kirim</span>
            <span>{{ $util.currency(item.income_loan_sum) + " so'm" }}</span>
          </li>
          <ul class="list-group" v-if="item.incomes_loan.length">
            <li
              class="list-group-item"
              v-for="item1 in item.incomes_loan"
              :key="item1"
              v-show="item1.sum_price"
            >
              {{ $util.currency(item1.sum_price) + " so'm " + item1.type }}
            </li>
          </ul>
          <hr />
          <li class="list-group-item">
            <span>Chiqim</span>
            <span>{{ $util.currency(item.expense_sum) + " so'm" }}</span>
          </li>
          <li class="list-group-item">
            <span>Qaytarish chiqimi</span>
            <span>{{ $util.currency(item.returned_price) + " so'm" }}</span>
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
            <span>{{ $util.currency(benefit(item)) + " so'm" }}</span>
          </li>
        </ul>
      </div>
    </template>
    <template #footer>
      <button class="btn btn-outline-danger" data-dismiss="modal">
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
      history_sum: [],
      date: "",
      orders: null,
      order_id: null,
      fixed_expenses: {
        current_page: 0,
        pages: 1,
        limit: 25,
        data: [],
      },
      variable_expenses: {
        current_page: 0,
        pages: 1,
        limit: 25,
        data: [],
      },
      returned_products: {
        current_page: 0,
        pages: 1,
        limit: 25,
        data: [],
      },
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
          this.history = res.data.data;
          this.history_sum = res.data.data_sum;
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
          document.querySelector("[toggle-day-modal]").click();
          this.getFixedExpenses(0, 25);
          this.getVariableExpenses(0, 25);
          this.getReturnedProducts(0, 25);
          this.$emit("setloading", false);
        })
        .catch((err) => {
          this.$emit("setloading", false);
          api.catchError(err);
        });
    },
    getFixedExpenses(page, limit) {
      this.$emit("setloading", true);
      api
        .fixedExpenses(
          this.$route.params.id,
          this.date,
          this.date,
          0,
          page,
          limit
        )
        .then((res) => {
          this.fixed_expenses = res.data;
          this.$emit("setloading", false);
        })
        .catch((err) => {
          this.$emit("setloading", false);
          api.catchError(err);
        });
    },
    getVariableExpenses(page, limit) {
      this.$emit("setloading", true);
      api
        .variableExpenses(
          this.$route.params.id,
          this.date,
          this.date,
          page,
          limit
        )
        .then((res) => {
          this.variable_expenses = res.data;
          this.$emit("setloading", false);
        })
        .catch((err) => {
          this.$emit("setloading", false);
          api.catchError(err);
        });
    },
    getReturnedProducts(page, limit) {
      this.$emit("setloading", true);
      api
        .returnedProducts(
          0,
          this.$route.params.id,
          this.date,
          this.date,
          page,
          limit
        )
        .then((res) => {
          this.returned_products = res.data;
          this.$emit("setloading", false);
        })
        .catch((err) => {
          this.$emit("setloading", false);
          api.catchError(err);
        });
    },
    routerToReturn(order_id) {
      localStorage.setItem("order_id_for_return", order_id);
      // document.querySelector("[toggle-orders-modal]").click();
      // document.querySelector("[close-order-modal]").click();
      const buttons = document.querySelectorAll(`[data-dismiss=modal]`);
      buttons.forEach((item) => {
        item.click();
      });
      this.$router.push("/return");
    },
  },
};
</script>
