<template>
  <h3>Ta'minotchilar</h3>
  <div class="row">
    <div class="col-md-4">
      <div class="input-group input-group-sm">
        <input
          type="search"
          class="form-control"
          placeholder="Qidiruv"
          v-model="search"
        />
        <div class="input-group-text">
          <i class="fa fa-search" />
        </div>
      </div>
    </div>
    <div class="col-md-4 my-1"></div>
    <div class="col-md-4">
      <button
        class="btn btn-sm btn-block btn-outline-primary"
        data-toggle="modal"
        data-target="#add"
      >
        <i class="fa fa-plus" /> Ta'minotchi qo'shish
      </button>
    </div>
  </div>
  <hr />

  <div class="responsive-y" style="max-height: 80vh">
    <div class="row">
      <div class="col-md-4 mb-1" v-for="item in markets" :key="item">
        <div class="card shadow">
          <div class="card-body">
            <collapse>
              <template #header>
                <i class="fa fa-user" />
                <span>{{ item.name }}</span>
              </template>
              <template #body>
                <ul class="list-group">
                  <a :href="`tel:+998${item.phone}`" class="list-group-item">
                    <i class="fa fa-phone" />
                    <span>{{ "+998 " + format(item.phone) }}</span>
                  </a>
                  <li class="list-group-item">
                    <i class="fa fa-coins" />
                    <span>
                      <span
                        v-for="(balance, index) in item.balances"
                        :key="balance"
                        :class="
                          balance.balance > 0
                            ? 'text-success'
                            : balance.balance < 0
                            ? 'text-danger'
                            : ''
                        "
                      >
                        {{
                          _.format(balance.balance) +
                          " " +
                          balance.currency.currency +
                          (index < item.balances.length - 1 ? ", " : "")
                        }}
                      </span>
                    </span>
                  </li>
                  <li class="list-group-item">
                    <i class="fa fa-location-dot" />
                    <span>{{ item.address }}</span>
                  </li>
                </ul>
              </template>
            </collapse>
            <div class="row my-1">
              <div class="col" v-if="item.balances.length">
                <button
                  class="btn btn-sm btn-block btn-outline-primary"
                  data-toggle="modal"
                  data-target="#pay"
                  @click="pay.source = item.id"
                >
                  <i class="fa fa-coins" />
                </button>
              </div>
              <div class="col">
                <router-link
                  :to="`/taminotchi/${item.id}`"
                  class="btn btn-sm btn-block btn-outline-secondary"
                >
                  <i class="fa fa-history" />
                </router-link>
              </div>
              <div class="col">
                <button
                  class="btn btn-sm btn-block btn-outline-warning"
                  data-toggle="modal"
                  data-target="#edit"
                  @click="
                    edit.id = item.id;
                    edit.name = item.name;
                    edit.phone = item.phone;
                    edit.address = item.address;
                  "
                >
                  <i class="fa fa-edit" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Pagination :page="page" :pages="pages" :limit="limit" @get="getMarkets" />
  </div>

  <div class="modal fade" id="pay">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h4>
            {{
              markets.find((market) => market.id == pay.source)?.name +
              " ga pul berish"
            }}
          </h4>
        </div>
        <form @submit.prevent="payToMarket(pay)">
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
                    v-model="pay.money"
                  />
                  <div class="input-group-append">
                    <select
                      class="form-select form-select-sm"
                      required
                      v-model="pay.currency_id"
                    >
                      <option value="">valyuta</option>
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
                  v-model="pay.comment"
                ></textarea>
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

  <div class="modal fade" id="edit">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h4>{{ edit.name + " ma'lumotlarini tahrirlash" }}</h4>
        </div>
        <form @submit.prevent="put(edit)">
          <div class="modal-body">
            <div class="row gap-2 text-left">
              <label class="col-md-12">
                Ism
                <input
                  type="text"
                  class="form-control form-control-sm"
                  required
                  v-model="edit.name"
                />
              </label>
              <label class="col-md-12">
                Telefon raqam
                <div class="input-group input-group-sm">
                  <div class="input-group-text">+</div>
                  <input
                    type="tel"
                    minlength="9"
                    class="form-control"
                    required
                    v-model="edit.phone"
                  />
                </div>
              </label>
              <label class="col-md-12">
                Manzil
                <input
                  type="text"
                  class="form-control form-control-sm"
                  required
                  v-model="edit.address"
                />
              </label>
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

  <div class="modal fade" id="add">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h4>Yangi ta'minotchi qo'shish</h4>
        </div>
        <form @submit.prevent="post(new_market)">
          <div class="modal-body">
            <div class="row gap-2 text-left">
              <label class="col-md-12">
                Ism
                <input
                  type="text"
                  class="form-control form-control-sm"
                  required
                  v-model="new_market.name"
                />
              </label>
              <label class="col-md-12">
                Telefon raqam
                <div class="input-group input-group-sm">
                  <div class="input-group-text">+</div>
                  <input
                    type="tel"
                    minlength="9"
                    class="form-control"
                    required
                    v-model="new_market.phone"
                  />
                </div>
              </label>
              <label class="col-md-12">
                Manzil
                <input
                  type="text"
                  class="form-control form-control-sm"
                  required
                  v-model="new_market.address"
                />
              </label>
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
</template>

<script>
import {
  catchError,
  createMarket,
  currencies,
  markets,
  payForMarketExpense,
  success,
  updateMarket,
} from "@/components/Api/api";
import Pagination from "../../components/Pagination/Pagination.vue";
export default {
  name: "Markets",
  emits: ["setloading"],
  components: { Pagination },
  data() {
    return {
      search: "",
      _: Intl.NumberFormat(),
      page: 0,
      pages: 1,
      limit: 25,
      markets: [],
      currencies: [],
      pay: {
        money: null,
        currency_id: "",
        source: null,
        comment: null,
      },
      edit: {
        id: null,
        name: null,
        phone: null,
        address: null,
      },
      new_market: {
        name: null,
        phone: null,
        address: null,
      },
    };
  },
  created() {
    this.getCurrencies();
  },
  methods: {
    format(number) {
      return String(
        "(" +
          String(number).substr(0, 2) +
          ") " +
          String(number).substr(2, 3) +
          " " +
          String(number).substr(5, 2) +
          " " +
          String(number).substr(7, 2)
      );
    },
    getCurrencies() {
      currencies()
        .then((Response) => {
          this.currencies = Response.data;
          this.getMarkets(0, 25);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getMarkets(page, limit) {
      this.$emit("setloading", true);
      markets(page, limit)
        .then((Response) => {
          this.page = Response.data.current_page;
          this.pages = Response.data.pages;
          this.limit = Response.data.limit;
          this.markets = Response.data.data;
          this.$emit("setloading", false);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    payToMarket(pay) {
      this.$emit("setloading", true);
      pay.comment = pay.comment ? pay.comment : " ";
      payForMarketExpense(pay)
        .then((Response) => {
          success(0).then(() => {
            this.pay = {
              money: null,
              currency_id: "",
              source: null,
              comment: null,
            };
            this.getMarkets(0, 25);
          });
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    put(market) {
      this.$emit("setloading", true);
      updateMarket(market)
        .then((Response) => {
          success(1).then(() => {
            this.getMarkets(0, 25);
          });
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    post(market) {
      this.$emit("setloading", true);
      createMarket(market)
        .then((Response) => {
          success(2).then(() => {
            this.new_market = {
              name: null,
              phone: null,
              address: null,
            };
            this.getMarkets(0, 25);
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
