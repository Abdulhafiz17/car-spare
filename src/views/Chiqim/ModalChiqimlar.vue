<template>
  <div class="modal fade" id="chiqimlar">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h4>Doimiy chiqimlar</h4>
        </div>
        <div class="modal-body">
          <form @submit.prevent="postExpense(new_expense)">
            <div class="row text-left gap-2">
              <div class="col-md-12">Yangi chiqim turi</div>
              <div class="col-md-12">
                <div class="input-group input-group-sm">
                  <input
                    type="text"
                    placeholder="chiqim nomi"
                    class="form-control"
                    required
                    v-model="new_expense.name"
                  />
                  <div class="input-group-append">
                    <button class="btn btn-outline-success">
                      <i class="fa fa-plus" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-body">
          <div class="responsive-y" style="max-height: 50vh">
            <div class="row text-left gap-2">
              <div class="col-md-12">Mavjud chiqim turlari</div>
              <div class="col-md-12" v-for="item in expenses" :key="item">
                <form @submit.prevent="putExpense(item)">
                  <div class="input-group input-group-sm">
                    <input
                      type="text"
                      placeholder="chiqim nomi"
                      class="form-control"
                      required
                      v-model="item.name"
                    />
                    <div class="input-group-append">
                      <button class="btn btn-outline-warning">
                        <i class="fa fa-edit" />
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline-danger" data-dismiss="modal">
            <i class="far fa-circle-xmark" />
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="modal fade" id="doimiy">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h4>Doimiy chiqim qilish</h4>
        </div>
        <form @submit.prevent="postFixedExpense(pay_fixed_expense)">
          <div class="modal-body">
            <div class="row gap-2">
              <div class="col-md-12">
                <select
                  class="form-select form-select-sm"
                  required
                  v-model="pay_fixed_expense.source"
                >
                  <option disabled value="">chiqim turi</option>
                  <option v-for="item in expenses" :key="item" :value="item.id">
                    {{ item.name }}
                  </option>
                </select>
              </div>
              <div class="col-md-12" v-if="pay_fixed_expense.source">
                <div class="input-group input-group-sm">
                  <input
                    type="number"
                    min="0"
                    step="any"
                    class="form-control"
                    placeholder="summa"
                    required
                    v-model="pay_fixed_expense.money"
                  />
                  <div class="input-group-append">
                    <select
                      class="form-select form-select-sm"
                      required
                      v-model="pay_fixed_expense.currency_id"
                    >
                      <option disabled value="">valyuta</option>
                      <option
                        v-for="item in currencies"
                        :key="item"
                        :value="item.id"
                      >
                        {{ item.currency }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="col-md-12" v-if="pay_fixed_expense.source">
                <textarea
                  cols="30"
                  rows="2"
                  class="form-control form-control-sm"
                  placeholder="izoh"
                  v-model="pay_fixed_expense.comment"
                ></textarea>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline-primary">
              <i class="far fa-circle-check" />
            </button>
            <button
              class="btn btn-outline-danger"
              data-dismiss="modal"
              close-pay-fixed
            >
              <i class="far fa-circle-xmark" />
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <div class="modal fade" id="bir-marttalik">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h4>Doimiy chiqim qilish</h4>
        </div>
        <form @submit.prevent="postVariableExpense(pay_variable_expense)">
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
                    v-model="pay_variable_expense.money"
                  />
                  <div class="input-group-append">
                    <select
                      class="form-select form-select-sm"
                      required
                      v-model="pay_variable_expense.currency_id"
                    >
                      <option disabled value="">valyuta</option>
                      <option
                        v-for="item in currencies"
                        :key="item"
                        :value="item.id"
                      >
                        {{ item.currency }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="col-md-12">
                <textarea
                  cols="30"
                  rows="2"
                  class="form-control form-control-sm"
                  placeholder="izoh"
                  v-model="pay_variable_expense.comment"
                ></textarea>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline-primary">
              <i class="far fa-circle-check" />
            </button>
            <button
              class="btn btn-outline-danger"
              data-dismiss="modal"
              close-pay-variable
            >
              <i class="far fa-circle-xmark" />
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import {
  catchError,
  createFixedExpense,
  currencies,
  payForFixedExpense,
  payForVariableExpense,
  success,
  updateFixedExpense,
} from "@/components/Api/api";
export default {
  name: "ModalChiqimlar",
  props: ["fixed_expenses"],
  emits: ["setloading", "getExpenses", "getHistory"],
  data() {
    return {
      new_expense: {
        name: null,
      },
      currencies: [],
      pay_fixed_expense: {
        money: null,
        currency_id: "",
        source: "",
        comment: null,
      },
      pay_variable_expense: {
        money: null,
        currency_id: "",
        source: 0,
        comment: null,
      },
    };
  },
  computed: {
    expenses() {
      return this.$props.fixed_expenses;
    },
  },
  created() {
    this.getCurrencies();
  },
  methods: {
    getCurrencies() {
      currencies()
        .then((Response) => {
          this.currencies = Response.data;
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    postExpense(expense) {
      this.$emit("setloading", true);
      createFixedExpense(expense)
        .then((Response) => {
          success().then(() => {
            this.new_expense.name = null;
            this.$emit("getExpenses", true);
          });
        })
        .catch((Error) => {
          this.$emit("setloading", false);
          catchError(Error);
        });
    },
    putExpense(expense) {
      this.$emit("setloading", true);
      updateFixedExpense(expense)
        .then((Response) => {
          success().then(() => {
            this.$emit("getExpenses", true);
          });
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    postFixedExpense(expense) {
      this.$emit("setloading", true);
      expense.comment = expense.comment ? expense.comment : " ";
      payForFixedExpense(expense)
        .then((Response) => {
          success("close-pay-fixed").then((Response) => {
            this.pay_fixed_expense = {
              money: null,
              currency_id: "",
              source: "",
              comment: null,
            };
            this.$emit("getHistory", "doimiy");
          });
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    postVariableExpense(expense) {
      this.$emit("setloading", true);
      expense.comment = expense.comment ? expense.comment : " ";
      payForVariableExpense(expense)
        .then((Response) => {
          success("close-pay-variable").then((Response) => {
            this.pay_variable_expense = {
              money: null,
              currency_id: "",
              source: 0,
              comment: null,
            };
            this.$emit("getHistory", "bir_marttalik");
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
