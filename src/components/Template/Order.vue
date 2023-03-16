<template>
  <h5 v-if="template == 'header'">
    {{ order?.Orders.ordinal_number + " - buyurtma" }}
  </h5>
  <strong v-if="template == 'header'">
    {{ order?.Orders.time.substring(0, 10) }}
  </strong>

  <div class="row gap-3" v-if="template == 'body'">
    <div class="col-md-12">
      <div class="row my-1">
        <div class="col-md-3">
          Buyurtma summasi
          <br />
          {{ Intl.NumberFormat().format(balance) + " so'm" }}
        </div>
        <div class="col-md-3">
          Chegirma summa
          <br />
          {{ Intl.NumberFormat().format(order?.Orders.discount) + " so'm" }}
        </div>
        <div class="col-md-3">
          To'lov summa
          <br />
          <span v-for="(i, index) in order_incomes" :key="i">
            {{
              i.Incomes.type +
              ": " +
              Intl.NumberFormat().format(i.Incomes.money) +
              " so'm" +
              (index !== order_incomes.length - 1 ? ", " : "")
            }}
            <br />
          </span>
        </div>
        <div class="col-md-3">
          Nasiya summa
          <br />
          {{ _.format(order_loan ? order_loan?.Loans.money : 0) + " so'm" }}
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
                  item.sum_quantity + " " + item.Trades.product.olchov_birligi
                }}
              </td>
              <td>{{ _.format(item.Trades.price) + " so'm" }}</td>
              <td>{{ _.format(item.Trades.discount) + " so'm" }}</td>
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
                  _.format(
                    (item.Trades.price - item.Trades.discount) *
                      item.sum_quantity
                  ) + " so'm"
                }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import {
  incomes,
  loan,
  orders,
  returnedProducts,
  tradeBalance,
  trades,
  catchError,
} from "../Api/api";
export default {
  name: "Order",
  props: ["order_id", "order_template", "branchId"],
  emits: ["setloading"],
  data() {
    return {
      _: Intl.NumberFormat(),
      order: null,
      balance: null,
      order_incomes: [],
      order_loan: null,
      trades: [],
      returned_products: [],
    };
  },
  computed: {
    id() {
      return this.$props.order_id;
    },
    template() {
      return this.$props.order_template;
    },
    branch_id() {
      return this.$props.branchId;
    },
  },
  watch: {
    id(id) {
      if (id) {
        this.getOrder(id);
      }
    },
  },
  created() {
    if (this.id) {
      this.getOrder(this.id);
    }
  },
  methods: {
    getOrder(order_id) {
      this.$emit("setloading", true);
      orders(this.branch_id, this.id, 0, 0, 0, true, "", "", 0, 25)
        .then((Response) => {
          this.order = Response.data;
          this.getOrderIncomes(order_id);
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
          this.getOrderLoan(order_id);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getOrderLoan(order_id) {
      loan(order_id, 0)
        .then((Response) => {
          this.order_loan = Response.data;
          this.getTrades(order_id);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getTrades(order_id) {
      let branch_id = this.branch_id ? this.branch_id : 0;
      trades(order_id, branch_id)
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
      let branch_id = this.branch_id ? this.branch_id : 0;
      returnedProducts(order_id, branch_id, 0, 25)
        .then((Response) => {
          this.returned_products = Response.data.data;
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
