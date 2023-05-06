<template>
  <hr />
  <div
    class="d-flex align-items-center justify-content-center text-center gap-2"
  >
    <button
      class="btn btn-lg btn-outline-success"
      data-toggle="modal"
      data-target="#confirm"
      :disabled="!order"
      @click="customer_type = ''"
    >
      <i class="far fa-circle-check" /> Tasdiqlash
    </button>
    <!-- <button class="btn btn-sm btn-outline-secondary">
      <i class="fa fa-history" /> Kunlik hisobot
    </button> -->
  </div>

  <div class="modal fade" id="confirm">
    <div class="modal-dialog">
      <div class="modal-content">
        <form @submit.prevent="confirmOrder(confirm_order)">
          <div class="modal-body">
            <h3>{{ $util.currency(balance) + " so'm" }}</h3>
            <h5>Mijoz turini tanlang</h5>
            <div class="row">
              <div class="col-4" v-if="order_type == 'payment'">
                <button
                  type="button"
                  class="btn btn-sm btn-block"
                  :class="
                    customer_type == 'none'
                      ? 'btn-primary'
                      : 'btn-outline-primary'
                  "
                  @click="customer_type = 'none'"
                >
                  Umumiy
                </button>
              </div>
              <div :class="order_type == 'payment' ? 'col-4' : 'col-6'">
                <button
                  type="button"
                  class="btn btn-sm btn-block"
                  :class="
                    customer_type == 'customer'
                      ? 'btn-primary'
                      : 'btn-outline-primary'
                  "
                  @click="customer_type = 'customer'"
                >
                  Doimiy
                </button>
              </div>
              <div :class="order_type == 'payment' ? 'col-4' : 'col-6'">
                <button
                  type="button"
                  class="btn btn-sm btn-block"
                  :class="
                    customer_type == 'new'
                      ? 'btn-primary'
                      : 'btn-outline-primary'
                  "
                  @click="customer_type = 'new'"
                >
                  Yangi
                </button>
              </div>
            </div>
            <div class="row my-1 gap-2" v-if="customer_type == 'new'">
              <div class="col-md-12">
                Yangi mijoz ma'lumotlari
                <div class="row">
                  <div class="col-md-6 mb-1">
                    <input
                      type="text"
                      class="form-control form-control-sm"
                      placeholder="ism"
                      required
                      v-model="confirm_order.customer_name"
                    />
                  </div>
                  <div class="col-md-6">
                    <div class="input-group input-group-sm">
                      <div class="input-group-text">+998</div>
                      <input
                        type="tel"
                        minlength="9"
                        maxlength="9"
                        class="form-control"
                        placeholder="tel"
                        required
                        v-model="confirm_order.customer_phone"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-12">
                <div class="row">
                  <div class="col-md-12">
                    <select
                      class="form-select form-select-sm"
                      required
                      v-model="confirm_order.customer_type"
                    >
                      <option disabled value="">mijoz turi</option>
                      <option value="umumiy">umumiy</option>
                      <option value="premium">premium</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div class="row my-1 gap-2" v-if="customer_type">
              <div class="col-md-12" v-if="customer_type == 'customer'">
                <div class="dropdown">
                  <button
                    type="button"
                    class="btn btn-sm btn-block btn-outline-primary dropdown-toggle"
                    data-toggle="dropdown"
                  >
                    {{ customer ? customer.name : "Mijoz tanlang" }}
                  </button>
                  <div class="dropdown-menu w-100 mt-1 p-1">
                    <input
                      type="search"
                      class="form-control form-control-sm my-1"
                      placeholder="Qidiruv"
                      v-model="customers_search"
                      @keyup="getCustomers()"
                    />
                    <div
                      class="responsive-y scroll-cutomers"
                      @scroll="scrollCustomers()"
                      style="max-height: 20vh"
                    >
                      <button
                        type="button"
                        class="dropdown-item"
                        v-for="item in customers"
                        :key="item"
                        @click="
                          customer = item;
                          confirm_order.customer_name = item.name;
                          confirm_order.customer_phone = item.phone;
                          confirm_order.customer_type = item.type;
                        "
                      >
                        {{ item.name }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-12">
                To'lov summa
                <div class="row">
                  <div
                    class="col-md-12 mb-1"
                    v-for="(item, i) in confirm_order.money"
                    :key="item"
                  >
                    <div class="input-group input-group-sm">
                      <input
                        type="number"
                        min="0"
                        :max="max(item.paid_money)"
                        step="any"
                        class="form-control"
                        required
                        v-model="item.paid_money"
                        @focus="disabled = true"
                        @focusout="disabled = false"
                      />
                      <div class="input-group-append">
                        <select
                          class="form-select form-select-sm"
                          required
                          v-model="item.type"
                        >
                          <option hidden value="">to'lov turi</option>
                          <option
                            v-for="item1 in payment_types"
                            :key="item1"
                            :value="item1"
                            :disabled="
                              confirm_order.money.find(
                                (money) => money.type == item1
                              )
                            "
                          >
                            {{ item1 }}
                          </option>
                        </select>
                      </div>
                      <div class="input-group-append">
                        <button
                          type="button"
                          class="btn btn-success"
                          @click="
                            confirm_order.money.push({
                              paid_money: null,
                              type: '',
                            })
                          "
                          v-if="i == 0 && confirm_order.money.length < 3"
                        >
                          <i class="fa fa-plus"></i>
                        </button>
                        <button
                          class="btn btn-danger"
                          @click="confirm_order.money.splice(i, 1)"
                          v-else
                        >
                          <i class="fa fa-xmark"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-12">
                <div class="row">
                  <div
                    :class="customer_type == 'none' ? 'col-md-12' : 'col-md-6'"
                  >
                    Chegirma summa
                    <input
                      type="number"
                      min="0"
                      :max="max(confirm_order.discount)"
                      step="any"
                      class="form-control form-control-sm"
                      :disabled="customer_type == 'none'"
                      v-model="confirm_order.discount"
                      @focus="disabled = true"
                      @focusout="disabled = false"
                    />
                  </div>
                  <div
                    class="col-md-6"
                    v-if="customer_type == 'customer' || customer_type == 'new'"
                  >
                    Nasiya summa
                    <input
                      type="number"
                      min="0"
                      :max="max(loan_price)"
                      step="any"
                      class="form-control form-control-sm"
                      v-model="loan_price"
                    />
                  </div>
                </div>
              </div>
              <div class="col-md-12" v-if="loan_price">
                Nasiya qaytarish sanasi
                <input
                  type="date"
                  class="form-control form-control-sm"
                  required
                  v-model="confirm_order.loan_repayment_date"
                />
              </div>
              <div class="col-md-12">
                <div class="row">
                  <div class="col-md-12">
                    Hodim
                    <select
                      class="form-select form-select-sm"
                      required
                      v-model="confirm_order.seller_id"
                    >
                      <option value="0">kassir</option>
                      <option
                        v-for="item in users.filter(
                          ({ status, role }) => role == 'seller' && status
                        )"
                        :key="item"
                        :value="item.id"
                      >
                        {{ item.name }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              class="btn btn-outline-primary"
              :disabled="
                disabled ||
                (customer_type == 'customer' && !customer ? true : false) ||
                customer_type == ''
              "
            >
              <i class="far fa-circle-check" />
            </button>
            <button
              class="btn btn-outline-danger"
              data-dismiss="modal"
              close-confirm-order
            >
              <i class="far fa-circle-xmark" />
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <div v-show="false" v-if="order_print.Trades">
    <div id="order" class="text-center">
      <span>{{ order?.Orders.time.replace("T", " ").substring(0, 16) }}</span>
      <hr />
      <ul class="list-group">
        <li class="list-group-item">
          <span>Mahsulotlar</span>
          <span></span>
        </li>
        <li
          class="list-group-item"
          v-for="item in order_print.Trades"
          :key="item"
        >
          <span>
            {{
              item.Products.articul +
              " - " +
              item.Products.eni +
              (item.Products.boyi ? " x " + item.Products.boyi : " metr") +
              " - " +
              $util.currency(item.sum_quantity) +
              (item.Products.boyi ? " dona" : " metr")
            }}
          </span>
          <span>
            {{
              $util.currency(item.Trades.price - item.Trades.discount) + " so'm"
            }}
          </span>
        </li>
      </ul>
      <hr />
      <ul class="list-group">
        <li class="list-group-item">
          <span>Buyurtma summasi</span>
          <span>{{
            $util.currency(order_print.Balance.total_price) + " so'm"
          }}</span>
        </li>
      </ul>
      <hr />
      <ul class="list-group">
        <li class="list-group-item">
          <span>Buyurtma chegirmasi</span>
          <span>{{ $util.currency(order?.Orders.discount) + " so'm" }}</span>
        </li>
      </ul>
      <hr />
      <ul class="list-group" v-if="order_print.Loan">
        <li class="list-group-item">
          <span>Nasiya summasi</span>
          <span>
            {{ $util.currency(order_print.Loan.Loans.money) + " so'm" }}
          </span>
        </li>
        <li class="list-group-item">
          <span>Nasiya qaytarish sanasi</span>
          <span>{{ order_print.Loan.Loans.return_date }}</span>
        </li>
      </ul>
      <hr />
      <ul class="list-group">
        <li class="list-group-item">
          <span>To'lov summasi</span>
          <span>
            <span v-for="item in order_print.Incomes" :key="item"> {{}} </span>
            <span
              v-for="(item, index) in order_print.Incomes.filter(
                (income) => income.Incomes.money > 0
              )"
              :key="item"
            >
              {{ item.Incomes.comment + ": " }}
              {{ $util.currency(item.Incomes.money) + " so'm" }}
              {{ index < order_print.Incomes.length - 1 ? ", " : "" }}
            </span>
          </span>
        </li>
      </ul>
      <div class="d-flex justify-content-center">
        <img id="barcode" />
      </div>
    </div>
  </div>
</template>

<script>
import {
  catchError,
  confirmationOrder,
  customers,
  incomes,
  loan,
  success,
  tradeBalance,
  trades,
  users,
} from "@/components/Api/api";
import JsBarcode from "jsbarcode";
import swal from "sweetalert";
export default {
  name: "Bar",
  props: ["current_order", "order_balance"],
  emits: ["setloading", "getOrderBalance", "isConfirmed"],
  data() {
    return {
      _: Intl.NumberFormat(),
      branch_id: localStorage.getItem("branch_id"),
      customer_type: "",
      customers_page: 0,
      customers_pages: 1,
      customers_search: "",
      customers: [],
      users: [],
      loan_price: null,
      customer: null,
      disabled: false,
      payment_types: ["naqd", "plastik", "click"],
      confirm_order: {
        order_id: 0,
        customer_name: null,
        customer_phone: null,
        customer_type: null,
        discount: null,
        money: [
          {
            paid_money: null,
            type: "naqd",
          },
        ],
        loan_repayment_date: null,
        seller_id: 0,
      },
      order_print: {},
      order_type: "payment",
    };
  },
  computed: {
    order() {
      return this.$props.current_order;
    },
    balance() {
      return this.$props.order_balance;
    },
  },
  watch: {
    customer_type(type) {
      this.customer = null;
      this.confirm_order.customer_name = null;
      this.confirm_order.customer_phone = null;
      this.confirm_order.customer_birthday = null;
      this.confirm_order.customer_type = null;
      this.confirm_order.money[0].paid_money = this.balance;
      this.confirm_order.discount = null;
      this.confirm_order.seller_id = 0;
      this.loan_price = null;
    },
  },
  created() {
    this.getUsers();
    this.getCustomers();
  },
  methods: {
    max(value) {
      let number = this.balance;
      number -= this.confirm_order.discount;
      number -= this.loan_price;
      this.confirm_order.money.forEach((item) => {
        number -= item.paid_money;
      });
      return Number(number) + Number(value);
    },
    getUsers() {
      this.$emit("setloading", true);
      users(this.branch_id, 0, 100)
        .then((Response) => {
          this.users = Response.data.data;
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getCustomers() {
      customers(this.customers_search, 0, 25)
        .then((Response) => {
          this.customers_page = 0;
          this.customers_pages = Response.data.pages;
          this.customers = Response.data.data;
          this.$emit("setloading", false);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    scrollCustomers() {
      let div = document.querySelector(".scroll-cutomers");
      if (div.scrollTop + div.clientHeight >= div.scrollHeight) {
        if (this.customers_page < this.customers_pages - 1) {
          customers(this.customers_search, this.customers_page + 1, 25)
            .then((Response) => {
              this.customers_page = Response.data.current_page;
              this.customers = this.customers.concat(Response.data.data);
            })
            .catch((error) => {
              this.$emit("setloading", false);
              catchError(error);
            });
        }
      }
    },
    count(action, naxt, plastik, chegirma, nasiya) {
      if (action == "price") {
        if (naxt + plastik == this.balance) {
          this.confirm_order.discount = 0;
          this.loan_price = 0;
        } else if (naxt + plastik < this.balance) {
          this.confirm_order.discount = this.balance - (naxt + plastik);
          this.loan_price = 0;
        } else {
          this.confirm_order.money[0].paid_money = 0;
          this.confirm_order.money[1].paid_money = 0;
          this.confirm_order.discount = 0;
          this.loan_price = 0;
        }
      } else if (action == "chegirma") {
        if (naxt + plastik + chegirma == this.balance) {
          this.loan_price = 0;
        } else if (naxt + plastik + chegirma < this.balance) {
          this.loan_price = this.balance - (naxt + plastik + chegirma);
        } else {
          this.confirm_order.money[0].paid_money = 0;
          this.confirm_order.money[1].paid_money = 0;
          this.confirm_order.discount = 0;
          this.loan_price = 0;
        }
      }
    },
    confirmOrder(order) {
      this.$emit("setloading", true);
      order.order_id = this.order.Orders.id;
      order.money.forEach((item) => {
        item.paid_money = item.paid_money ? item.paid_money : 0;
      });
      order.discount = order.discount ? order.discount : 0;
      if (this.customer_type == "none") order.customer_phone = 0;
      confirmationOrder(order)
        .then((Response) => {
          success("close-confirm-order").then(() => {
            this.confirm_order = {
              customer_name: null,
              customer_phone: null,
              customer_birthday: null,
              customer_type: null,
              discount: null,
              money: [
                {
                  paid_money: null,
                  type: "naqd",
                },
                {
                  paid_money: null,
                  type: "plastik",
                },
              ],
              loan_repayment_date: null,
              seller_id: 0,
            };
            this.confirmPrint();
          });
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    confirmPrint() {
      swal({
        icon: "info",
        title: "Buyurtma cheki chiqarilsinmi",
        closeOnEsc: false,
        closeOnClickOutside: false,
        buttons: {
          confirm: {
            visible: true,
            text: "Ok",
            value: true,
          },
          cancel: {
            visible: true,
            text: "Bekor qilish",
            value: false,
          },
        },
      }).then((value) => {
        if (value) {
          this.getBalance(this.order.Orders.id);
        } else {
          this.$emit("isConfirmed", true);
        }
      });
    },
    getBalance(order_id) {
      tradeBalance(order_id)
        .then((Response) => {
          this.order_print.Balance = Response.data;
          this.getIncome(order_id);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getIncome(order_id) {
      incomes(order_id, "order", this.branch_id, 0, 25)
        .then((Response) => {
          this.order_print.Incomes = Response.data.data;
          this.getLoan(order_id);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getLoan(order_id) {
      loan(order_id, 0)
        .then((Response) => {
          this.order_print.Loan = Response.data;
          this.getTrades(order_id);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getTrades(order_id) {
      trades(order_id)
        .then((Response) => {
          this.order_print.Trades = Response.data;
          this.createBarcode(order_id);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    createBarcode(order_id) {
      setTimeout(() => {
        JsBarcode("#barcode", order_id, {
          // format: "CODE128",
          width: 2,
          height: 30,
        });
      }, 10);
      setTimeout(() => {
        this.printOrder();
      }, 100);
    },
    printOrder() {
      let order = document.querySelector("#order").outerHTML;
      const winPrint = window.open("", "", "");
      winPrint.document.querySelector("head").innerHTML = `
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
      integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
      <style>
        * {
          font-size: 12px !important;
        }
        .list-group-item {
          display: flex !important;
          justify-content: space-between !important;
          border: none !important;
        }
      </style>
      `;
      winPrint.document.querySelector("body").innerHTML = order;
      winPrint.print();
      setTimeout(() => {
        winPrint.close();
      }, 500);
      this.$emit("isConfirmed", true);
    },
  },
};
</script>
