<template>
  <div class="responsive-y" style="max-height: 66vh">
    <div class="row">
      <div class="col-md-12">
        <h5>Valyutalar</h5>
        <p>Yangi valyuta qo'shish yoki mavjud valyuta ma'lumotini tahrirlash</p>
      </div>
      <div class="col-md-12">
        <div class="row gap-2">
          <div class="col-md-12">
            <form @submit.prevent="postCurrency(new_currency)">
              <div class="input-group input-group-sm">
                <div class="input-group-text">1</div>
                <input
                  type="text"
                  class="form-control text-center"
                  placeholder="nomi"
                  required
                  v-model="new_currency.currency"
                />
                <div class="input-group-text">=</div>
                <input
                  type="number"
                  min="0"
                  step="any"
                  class="form-control text-center"
                  placeholder="narxi"
                  required
                  v-model="new_currency.price"
                />
                <div class="input-group-text">so'm</div>
                <div class="input-group-append">
                  <button class="btn btn-sm btn-outline-primary">
                    <i class="fa fa-plus" />
                  </button>
                </div>
              </div>
            </form>
          </div>
          <div
            class="col-md-12"
            v-for="item in currencies.filter(
              (currency) => currency.currency !== `so'm`
            )"
            :key="item"
          >
            <form @submit.prevent="putCurrency(item)">
              <div class="input-group input-group-sm">
                <div class="input-group-text">
                  {{ "1 " + item.currency + " =" }}
                </div>
                <input
                  type="number"
                  min="0"
                  step="any"
                  class="form-control text-center"
                  placeholder="narxi"
                  required
                  v-model="item.price"
                />
                <div class="input-group-text">so'm</div>
                <div class="input-group-append">
                  <button class="btn btn-sm btn-outline-primary">
                    <i class="fa fa-check" />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  catchError,
  createCurrency,
  currencies,
  success,
  updateCurrency,
} from "@/components/Api/api";
export default {
  name: "Currency",
  emits: ["setloading"],
  data() {
    return {
      new_currency: {
        currency: null,
        price: null,
      },
      currencies: [],
    };
  },
  created() {
    this.getCurrencies();
  },
  methods: {
    postCurrency(currency) {
      this.$emit("setloading", true);
      createCurrency(currency)
        .then((Response) => {
          success().then(() => {
            this.new_currency = {
              currency: null,
              price: null,
            };
            this.getCurrencies();
          });
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getCurrencies() {
      this.$emit("setloading", true);
      currencies()
        .then((Response) => {
          this.currencies = Response.data;
          this.$emit("setloading", false);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    putCurrency(currency) {
      updateCurrency(currency)
        .then((Response) => {
          success().then(() => {
            this.getCurrencies();
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
