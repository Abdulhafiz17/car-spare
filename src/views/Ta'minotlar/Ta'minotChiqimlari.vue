<template>
  <div class="row" v-if="supply_status == 'false'">
    <div class="col-md-5">
      <div class="input-group input-group-sm">
        <input
          type="number"
          min="0"
          step="any"
          class="form-control"
          placeholder="chiqim summasi"
          v-model="new_expense.money"
        />
        <div class="input-group-append">
          <div class="dropdown">
            <button
              id="dropdownMenuButtonCategories"
              type="button"
              class="btn btn-sm btn-block btn-outline-primary dropdown-toggle"
              data-toggle="dropdown"
            >
              {{
                new_expense.currency_id
                  ? currencies?.find(
                      (currency) => currency.id == new_expense.currency_id
                    ).currency
                  : "valyuta"
              }}
            </button>
            <div
              class="dropdown-menu w-100 mt-1"
              aria-labelledby="dropdownMenuButtonCategories"
            >
              <button
                type="button"
                class="dropdown-item text-center"
                disabled
                v-show="!currencies.length"
              >
                <i class="fa-solid fa-circle-notch fa-spin" />
              </button>
              <button
                type="button"
                class="dropdown-item"
                v-for="item in currencies"
                :key="item"
                @click="new_expense.currency_id = item.id"
              >
                {{ item.currency }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-5">
      <input
        type="text"
        class="form-control form-control-sm"
        placeholder="izoh"
        v-model="new_expense.comment"
      />
    </div>
    <div class="col-md-2">
      <button
        class="btn btn-sm btn-block btn-outline-primary"
        :disabled="
          !new_expense.money || !new_expense.currency_id || !new_expense.comment
        "
        @click="postExpense(new_expense)"
      >
        <i class="far fa-circle-check" />
      </button>
    </div>
  </div>
  <div
    class="responsive-y mt-2"
    :style="`height: ${supply_status == 'false' ? '66vh' : '73vh'}`"
  >
    <ul class="list-group">
      <li class="list-group-item" v-for="item in expenses" :key="item">
        <span class="text-left">
          <h5>
            {{
              "Chiqim summasi: " +
              $util.currency(item.Expenses.money) +
              " " +
              item.currency
            }}
          </h5>
          <p class="m-0"><strong>Izoh: </strong> {{ item.Expenses.comment }}</p>
        </span>
      </li>
    </ul>
    <Pagination :page="page" :pages="pages" :limit="limit" @get="getExpenses" />
  </div>
</template>

<script>
import {
  catchError,
  currencies,
  partyExpenses,
  payForPartyExpense,
  success,
} from "@/components/Api/api";
import Pagination from "../../components/Pagination/Pagination.vue";
export default {
  name: "Expenses",
  emits: ["setloading", "getBalance"],
  components: { Pagination },
  data() {
    return {
      _: Intl.NumberFormat(),
      supply_status: localStorage.getItem("supply_status"),
      page: 0,
      pages: 1,
      limit: 25,
      currencies: [],
      currency: null,
      new_expense: {
        money: null,
        currency_id: null,
        source: this.$route.params.id,
        comment: null,
      },
      expenses: [],
    };
  },
  created() {
    this.getCurrencies();
  },
  methods: {
    getCurrencies() {
      currencies()
        .then((Response) => {
          this.currencies = Response.data;
          this.getExpenses(0, 25);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getExpenses(page, limit) {
      this.$emit("setloading", true);
      partyExpenses(this.$route.params.id, page, limit)
        .then((Response) => {
          this.page = Response.data.current_page;
          this.pages = Response.data.pages;
          this.limit = Response.data.limit;
          this.expenses = Response.data.data;
          this.$emit("getBalance");
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    postExpense(expense) {
      this.$emit("setloading", true);
      payForPartyExpense(expense)
        .then((Response) => {
          success().then(() => {
            this.new_expense = {
              money: null,
              currency_id: null,
              source: this.$route.params.id,
              comment: null,
            };
            this.getExpenses(0, 25);
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
