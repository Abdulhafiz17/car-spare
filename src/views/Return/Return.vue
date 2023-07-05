<template>
  <h3>Mahsulot qaytarish</h3>
  <div class="row">
    <div class="col-md-4"></div>
    <div class="col-md-4 my-1"></div>
    <div class="col-md-4">
      <button
        class="btn btn-sm btn-block btn-outline-secondary"
        data-toggle="modal"
        data-target="#history"
        @click="$refs.modalMahsulotlar.getReturnedProducts(0, 25)"
      >
        <i class="fa fa-history" /> Qaytarilgan mahsulotlar
      </button>
    </div>
  </div>
  <hr />

  <div class="row">
    <div class="col-md-4"></div>
    <div class="col-md-4 my-1">
      <div class="input-group input-group-sm">
        <input
          type="number"
          class="form-control"
          min="0"
          placeholder="buyurtma id"
          order_id
          v-model="order_id"
          @keyup.enter="getOrder(order_id)"
        />
        <div class="input-group-append" v-if="order">
          <button class="btn btn-outline-danger" @click="clear()">
            <i class="fa fa-xmark" />
          </button>
        </div>
      </div>
    </div>
    <div class="col-md-4"></div>
  </div>

  <div class="row gap-4" v-if="order">
    <div class="col-md-12 d-flex justify-content-between px-5">
      <h5>
        {{ order?.Orders.ordinal_number + " - buyurtma" }}
      </h5>
      <strong>
        {{ order?.Orders.time.substring(0, 10) }}
      </strong>
    </div>
    <div class="col-md-12">
      <div class="row my-1">
        <div class="col-md-3">
          Buyurtma summasi
          <br />
          {{ $util.currency(balance) + " so'm" }}
        </div>
        <div class="col-md-3">
          Chegirma summa
          <br />
          {{ $util.currency(order?.Orders.discount) + " so'm" }}
        </div>
        <div class="col-md-3">
          To'lov summa
          <br />
          <span v-for="(i, index) in order_incomes" :key="i">
            {{
              i.Incomes.type +
              ": " +
              $util.currency(i.Incomes.money) +
              " so'm" +
              (index !== order_incomes.length - 1 ? ", " : "")
            }}
            <br />
          </span>
        </div>
        <div class="col-md-3">
          <div class="dropdown">
            <button
              class="btn btn-sm btn-block dropdown-toggle"
              data-toggle="dropdown"
            >
              Mijoz nasiyasi
            </button>
            <div class="dropdown-menu w-100" v-if="customer_loans?.data.length">
              <ul
                class="list-group responsive-y"
                style="max-height: 20vh"
                @scroll="scrollLoans($event)"
              >
                <li
                  class="list-group-item"
                  v-for="item in customer_loans?.data"
                  :key="item"
                  @click="
                    take_loan = {
                      id: item.Loans.id,
                      money: null,
                      type: 'naqd',
                    }
                  "
                  data-toggle="modal"
                  data-target="#pay-loan"
                >
                  <span>
                    Summa:
                    {{ $util.currency(item.Loans.money) + " so'm" }}
                    <hr />
                    Qoldiq:
                    {{ $util.currency(item.Loans.residual) + " so'm" }}
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <br />
        </div>
      </div>
    </div>
    <div class="col-md-12">
      <div class="responsive-y" style="max-height: 50vh">
        <table class="table table-sm table-hover">
          <thead>
            <tr>
              <th>Mahsulot</th>
              <th>Hajm</th>
              <th>Narx</th>
              <th>Chegirma</th>
              <th>Qaytarilgan</th>
              <th>Summa</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in trades" :key="item">
              <td>
                {{
                  item.Trades.product.category.name +
                  " - " +
                  item.Trades.product.product_type.name +
                  " - " +
                  item.Trades.product.product_type.name2
                }}
              </td>
              <td>
                {{
                  $util.currency(item.sum_quantity) +
                  " " +
                  item.Trades.product.olchov_birligi
                }}
              </td>
              <td>{{ $util.currency(item.Trades.price) + " so'm" }}</td>
              <td>{{ $util.currency(item.Trades.discount) + " so'm" }}</td>
              <td>
                {{
                  (returned_products.find(
                    (product) =>
                      product.Returned_products.code == item.Trades.code
                  )
                    ? returned_products.find(
                        (product) =>
                          product.Returned_products.code == item.Trades.code
                      ).Returned_products.quantity
                    : 0) + " dona"
                }}
              </td>
              <td>
                {{
                  $util.currency(item.Trades.price * item.sum_quantity) +
                  " so'm"
                }}
              </td>
              <td>
                <button
                  class="btn btn-sm btn-outline-primary"
                  data-toggle="modal"
                  data-target="#returnProduct"
                  :disabled="
                    returned_products.find(
                      (product) =>
                        product.Returned_products.code == item.Trades.code
                    )
                      ? returned_products.find(
                          (product) =>
                            product.Returned_products.code == item.Trades.code
                        ).Returned_products.quantity == item.sum_quantity
                      : false
                  "
                  @click="return_product = item"
                >
                  <i class="fa fa-undo" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <div class="modal fade" id="pay-loan">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h4>Nasiya uchun pul olish</h4>
        </div>
        <form @submit.prevent="postLoan(take_loan)">
          <div class="modal-body">
            <div class="row gap-2">
              <div class="col-md-12">
                <div class="input-group input-group-sm">
                  <input
                    type="number"
                    min="0"
                    step="any"
                    class="form-control"
                    placeholder="summa"
                    required
                    v-model="take_loan.money"
                  />
                  <div class="input-group-text">so'm</div>
                  <div class="input-group-append">
                    <select
                      class="form-select form-select-sm"
                      required
                      v-model="take_loan.type"
                    >
                      <option value="naqd">naqd</option>
                      <option value="plastik">plastik</option>
                      <option value="click">click</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline-primary">
              <i class="far fa-circle-check" />
            </button>
            <button class="btn btn-outline-danger" data-dismiss="modal">
              <i class="far fa-circle-xmark" />
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <ModalMahsulotlar @setloading="setloading" ref="modalMahsulotlar" />
  <ModalReturnProduct
    :return_product="return_product"
    :return_status="return_status"
    :loan_residual="customer_loans"
    @setloading="setloading"
    @clear="clear"
  />
</template>

<script>
import {
  incomes,
  orders,
  returnedProducts,
  tradeBalance,
  trades,
  catchError,
  loans,
  takeLoan,
} from "@/components/Api/api";
import ModalMahsulotlar from "./ModalMahsulotlar.vue";
import ModalReturnProduct from "./ModalReturnProduct.vue";
import swal from "sweetalert";
export default {
  name: "Return",
  emits: ["setloading"],
  components: { ModalMahsulotlar, ModalReturnProduct },
  data() {
    return {
      order_id: null,
      _: Intl.NumberFormat(),
      branch_id: localStorage.getItem("branch_id"),
      order: null,
      balance: null,
      order_incomes: [],
      customer_loans: null,
      trades: [],
      returned_products: [],
      return_product: null,
      return_status: null,
      take_loan: {
        id: 0,
        money: null,
        type: "naqd",
      },
    };
  },
  created() {
    if (localStorage.getItem("order_id_for_return")) {
      this.getOrder(localStorage.getItem("order_id_for_return"));
    } else {
      this.$emit("setloading", false);
    }
  },
  mounted() {
    document.querySelector("[order_id]").focus();
  },
  beforeUnmount() {
    localStorage.removeItem("order_id_for_return");
  },
  methods: {
    setloading(loading) {
      this.$emit("setloading", loading);
    },
    clear() {
      this.order_id = null;
      this.order = null;
      this.balance = null;
      this.order_incomes = [];
      this.customer_loan = null;
      this.trades = [];
      this.returned_products = [];
      document.querySelector("[order_id]").focus();
      this.$emit("setloading", false);
    },
    getOrder(order_id) {
      this.$emit("setloading", true);
      orders(this.branch_id, order_id, 0, 0, 0, true, "", "", 0, 25)
        .then((Response) => {
          this.order = Response.data;
          if (this.order) {
            this.getOrderIncomes(order_id);
          } else {
            swal({
              icon: "warning",
              title: "Bunday buyurtma mavjud emas !",
              timer: 2000,
            }).then(() => {
              this.$emit("setloading", false);
              this.clear();
            });
          }
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getOrderIncomes(order_id) {
      incomes(order_id, "order", this.branch_id, 0, 25)
        .then((Response) => {
          this.order_incomes = Response.data.data;
          if (this.order.Orders.customer_id) {
            this.getCustomerLoans(this.order.Orders.customer_id);
          } else {
            this.getTrades(order_id);
          }
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getCustomerLoans(customer_id) {
      loans(false, this.branch_id, customer_id, 0, 25)
        .then((Response) => {
          this.customer_loans = Response.data;
          this.getTrades(this.order.Orders.id);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getTrades(order_id) {
      trades(order_id, this.branch_id)
        .then((Response) => {
          this.trades = Response.data.trades;
          this.balance = Response.data.order_balance;
          this.getReturnedProducts(order_id);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getReturnedProducts(order_id) {
      returnedProducts(order_id, this.branch_id, "", "", 0, 25)
        .then((Response) => {
          this.returned_products = Response.data.data;
          this.$emit("setloading", false);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    scrollLoans(event) {
      const div = event.target;
      if (div.scrollTop + div.clientHeight >= div.scrollHeight) {
        if (
          this.customer_loans?.current_page <
          this.customer_loans?.pages - 1
        ) {
          loans(
            true,
            this.branch_id,
            this.order.Customers.id,
            this.customer_loans?.current_page + 1,
            this.customer_loans?.limit
          ).then((res) => {
            this.customer_loans.current_page = res.data.current_page;
            this.customer_loans.data = this.customer_loans.data.concat(
              res.data.data
            );
          });
        }
      }
    },
    postLoan(loan) {
      this.$emit("setloading", true);
      takeLoan(Array(loan))
        .then((Response) => {
          success(1).then(() => {
            this.take_loan = {
              id: 0,
              money: null,
              type: "naqd",
            };
            this.getLoan();
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

<style lang="scss" scoped></style>
