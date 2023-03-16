<template>
  <div class="row" v-if="supply_status == 'false'">
    <div class="col-md-12">
      <button
        class="btn btn-sm btn-outline-primary float-right"
        data-toggle="modal"
        data-target="#addProduct"
        @click="
          // market = null;
          // category = '';
          currency = null;
          new_supply.code = 0;
          new_supply.category_name = '';
          new_supply.product_type_name = '';
          new_supply.product_type_name2 = '';
          new_supply.quantity = null;
          new_supply.olchov_birligi = '';
          new_supply.price = null;
          new_supply.currency_id = null;
          new_supply.market_id = null;
          new_supply.party_id = $route.params.id;
          product_units = [];
          unit_quantity = null;
          unit_id = null;
        "
      >
        <i class="fa fa-cart-plus" /> Mahsulot qo'shish
      </button>
    </div>
  </div>

  <div
    class="responsive-y mt-2"
    :style="`height: ${supply_status == 'false' ? '66vh' : '73vh'}`"
  >
    <table class="table table-sm table-hover">
      <thead>
        <tr>
          <th>Ta'minotchi</th>
          <th>Kategoriya</th>
          <th>Nomi</th>
          <th>Marka</th>
          <th>Miqdor</th>
          <th>Narx</th>
          <th>Summa</th>
          <th>
            <button
              class="btn btn-sm btn-outline-info"
              data-toggle="modal"
              data-target="#filter"
            >
              <i class="fa fa-filter" />
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in supplies" :key="item">
          <td>{{ item.market }}</td>
          <td>{{ item.category }}</td>
          <td>{{ item.product_name }}</td>
          <td>
            {{ item.product_name2 }}
          </td>
          <td>
            {{ item.Supplies.quantity + " " + item.Supplies.olchov_birligi }}
          </td>
          <td>{{ _.format(item.Supplies.price) + " " + item.currency }}</td>
          <td>
            {{
              _.format(item.Supplies.price * item.Supplies.quantity) +
              " " +
              item.currency
            }}
          </td>
          <td>
            <button
              class="btn btn-sm btn-outline-danger"
              @click="deleteSupply(item.Supplies.id)"
            >
              <i
                :class="
                  supply_status == 'true' ? 'fa fa-undo' : 'far fa-circle-xmark'
                "
              />
            </button>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="7">
            <Pagination
              :page="supplies_page"
              :pages="supplies_pages"
              :limit="supplies_limit"
              @get="getSupplies"
            />
          </td>
        </tr>
      </tfoot>
    </table>
  </div>

  <modal id="addProduct">
    <template #header> <h4>Mahsulot qo'shish</h4> </template>
    <template #body>
      <div class="row gap-2">
        <div class="col-md-12">
          <div class="input-group input-group-sm">
            <input
              type="number"
              min="0"
              class="form-control"
              placeholder="code"
              v-model="new_supply.code"
              @click="new_supply.code ? false : (new_supply.code = null)"
              @focusout="new_supply.code ? false : (new_supply.code = 0)"
            />
            <button
              class="btn btn-outline-primary"
              :disabled="!new_supply.code"
              @click="findProduct()"
            >
              <i class="fa fa-search" />
            </button>
          </div>
        </div>
        <div class="col-md-12">
          <div class="dropdown">
            <button
              id="dropdownMenuButtonMarkets"
              type="button"
              class="btn btn-sm btn-block btn-outline-primary dropdown-toggle"
              data-toggle="dropdown"
              @click="getMarkets()"
            >
              {{ market ? market.name : "Ta'minotchi" }}
            </button>
            <div
              class="dropdown-menu w-100 mt-1"
              aria-labelledby="dropdownMenuButtonMarkets"
            >
              <div
                class="responsive-y markets-scroll"
                style="max-height: 20vh"
                @scroll="scrollMarkets()"
              >
                <button
                  type="button"
                  class="dropdown-item"
                  v-for="item in markets"
                  :key="item"
                  @click="market = item"
                >
                  {{ item.name }}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-12">
          <div class="dropdown">
            <input
              type="text"
              class="form-control form-control-sm"
              placeholder="kategoriya"
              data-toggle="dropdown"
              v-model="category"
              @keyup="getCategories()"
              @click="getCategories()"
            />
            <!-- <button
              id="dropdownMenuButtonCategories"
              type="button"
              class="btn btn-sm btn-block btn-outline-primary dropdown-toggle"
              data-toggle="dropdown"
              @click="getCategories()"
            >
              {{ category ? category.name : "Kategoriya" }}
            </button> -->
            <div
              class="dropdown-menu w-100 mt-1"
              aria-labelledby="dropdownMenuButtonCategories"
            >
              <div
                class="responsive-y categories-scroll"
                style="max-height: 20vh"
                @scroll="scrollCategories()"
              >
                <button
                  type="button"
                  class="dropdown-item"
                  v-for="item in categories"
                  :key="item"
                  @click="category = item.name"
                >
                  {{ item.name }}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-12">
          <div class="input-group input-group-sm">
            <input
              type="text"
              step="any"
              class="form-control"
              placeholder="artikul"
              required
              v-model="new_supply.product_type_name"
            />
          </div>
        </div>
        <div class="col-md-12">
          <input
            type="text"
            class="form-control form-control-sm"
            placeholder="marka"
            required
            v-model="new_supply.product_type_name2"
          />
        </div>
        <div class="col-md-12">
          <div class="input-group input-group-sm">
            <input
              type="number"
              class="form-control"
              min="0"
              step="any"
              placeholder="miqdor"
              v-model="unit_quantity"
              @keyup="countUnit()"
              v-if="product_units.length"
            />
            <div class="input-group-append" v-if="product_units.length">
              <div class="dropdown">
                <button
                  id="dropdownMenuButtonUnit"
                  type="button"
                  class="btn btn-sm btn-block btn-outline-primary dropdown-toggle"
                  data-toggle="dropdown"
                >
                  {{
                    unit_id
                      ? product_units.find((item) => item.id == unit_id).olchov
                      : "O'lchov birligi"
                  }}
                </button>
                <div
                  class="dropdown-menu w-100 mt-1"
                  aria-labelledby="dropdownMenuButtonUnit"
                >
                  <button
                    type="button"
                    class="dropdown-item"
                    v-for="item in product_units"
                    :key="item"
                    @click="
                      unit_id = item.id;
                      countUnit();
                    "
                  >
                    {{ item.olchov }}
                  </button>
                </div>
              </div>
            </div>
            <input
              type="number"
              min="0"
              step="any"
              class="form-control"
              placeholder="miqdori"
              required
              v-model="new_supply.quantity"
            />
            <div class="input-group-append">
              <div class="dropdown">
                <button
                  id="dropdownMenuButtonUnit"
                  type="button"
                  class="btn btn-sm btn-block btn-outline-primary dropdown-toggle"
                  data-toggle="dropdown"
                >
                  {{
                    new_supply.olchov_birligi
                      ? new_supply.olchov_birligi
                      : "O'lchov birligi"
                  }}
                </button>
                <div
                  class="dropdown-menu w-100 mt-1"
                  aria-labelledby="dropdownMenuButtonUnit"
                >
                  <button
                    type="button"
                    class="dropdown-item"
                    v-for="item in units"
                    :key="item"
                    @click="new_supply.olchov_birligi = item"
                  >
                    {{ item }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-12">
          <div class="input-group input-group-sm">
            <input
              type="number"
              min="0"
              step="any"
              class="form-control"
              placeholder="narx"
              required
              v-model="new_supply.price"
            />
            <div class="input-group-append">
              <div class="dropdown">
                <button
                  id="dropdownMenuButtonCategories"
                  type="button"
                  class="btn btn-sm btn-block btn-outline-primary dropdown-toggle"
                  data-toggle="dropdown"
                  @click="getCurrencies()"
                >
                  {{ currency ? currency.currency : "valyuta" }}
                </button>
                <div
                  class="dropdown-menu w-100 mt-1"
                  aria-labelledby="dropdownMenuButtonCategories"
                >
                  <div class="responsive-y" style="max-height: 20vh">
                    <button
                      type="button"
                      class="dropdown-item"
                      v-for="item in currencies"
                      :key="item"
                      @click="currency = item"
                    >
                      {{ item.currency }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <button
        class="btn btn-outline-primary"
        :disabled="
          !market ||
          !category ||
          !new_supply.product_type_name ||
          !new_supply.product_type_name2 ||
          !new_supply.quantity ||
          !new_supply.olchov_birligi ||
          !new_supply.price ||
          !currency
        "
        @click="addSupply(new_supply)"
      >
        <i class="far fa-circle-check" />
      </button>
      <button
        class="btn btn-outline-danger"
        data-dismiss="modal"
        close-add-supply
      >
        <i class="far fa-circle-xmark" />
      </button>
    </template>
  </modal>

  <modal id="filter" size="sm">
    <template #header>
      <h4>Qidiruv</h4>
    </template>
    <template #body>
      <div class="row gap-2">
        <div class="col-md-12">
          <div class="dropdown">
            <button
              id="dropdownMenuButtonMarkets"
              type="button"
              class="btn btn-sm btn-block btn-outline-primary dropdown-toggle"
              data-toggle="dropdown"
              @click="getMarkets()"
            >
              {{ supplies_market ? supplies_market.name : "Ta'minotchi" }}
            </button>
            <div
              class="dropdown-menu w-100 mt-1"
              aria-labelledby="dropdownMenuButtonMarkets"
            >
              <div
                class="responsive-y markets-scroll"
                style="max-height: 20vh"
                @scroll="scrollMarkets()"
              >
                <button
                  type="button"
                  class="dropdown-item"
                  v-for="item in markets"
                  :key="item"
                  @click="supplies_market = item"
                >
                  {{ item.name }}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-12">
          <div class="dropdown">
            <button
              id="dropdownMenuButtonCategories"
              type="button"
              class="btn btn-sm btn-block btn-outline-primary dropdown-toggle"
              data-toggle="dropdown"
              @click="getCategories()"
            >
              {{ supplies_category ? supplies_category.name : "Kategoriya" }}
            </button>
            <div
              class="dropdown-menu w-100 mt-1"
              aria-labelledby="dropdownMenuButtonCategories"
            >
              <input
                type="text"
                class="form-control form-control-sm"
                placeholder="qidiruv"
                v-model="category_search"
                @keyup="getCategories()"
              />
              <div
                class="responsive-y categories-scroll"
                style="max-height: 20vh"
                @scroll="scrollCategories()"
              >
                <button
                  type="button"
                  class="dropdown-item"
                  v-for="item in categories"
                  :key="item"
                  @click="supplies_category = item"
                >
                  {{ item.name }}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-12">
          <div class="dropdown">
            <button
              id="dropdownMenuButtonTypes"
              type="button"
              class="btn btn-sm btn-block btn-outline-primary dropdown-toggle"
              data-toggle="dropdown"
              @click="getProductTypes()"
            >
              {{
                supplies_product_type
                  ? supplies_product_type.name +
                    " " +
                    supplies_product_type.name2
                  : "Mahsulot"
              }}
            </button>
            <div
              class="dropdown-menu w-100 mt-1"
              aria-labelledby="dropdownMenuButtonTypes"
            >
              <input
                type="text"
                class="form-control form-control-sm"
                placeholder="qidiruv"
                v-model="type_search"
                @keyup="getProductTypes()"
              />
              <div
                class="responsive-y types-scroll"
                style="max-height: 20vh"
                @scroll="scrollTypes()"
              >
                <button
                  type="button"
                  class="dropdown-item"
                  v-for="item in types"
                  :key="item"
                  @click="supplies_product_type = item"
                >
                  {{ item.name + " " + item.name2 }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <button
        class="btn btn-outline-primary"
        data-dismiss="modal"
        @click="getSupplies(0, 25)"
      >
        <i class="far fa-circle-check" />
      </button>
      <button
        class="btn btn-outline-danger"
        data-dismiss="modal"
        @click="
          supplies_market = null;
          supplies_category = null;
          supplies_product_type = null;
          getSupplies(0, 25);
        "
      >
        <i class="fa fa-trash" />
      </button>
    </template>
  </modal>
</template>

<script>
import {
  catchError,
  categories,
  currencies,
  markets,
  productsForTrade,
  productTypes,
  removeSupply,
  success,
  supplies,
  takeSupply,
  productUnits,
} from "@/components/Api/api";
import Pagination from "../../components/Pagination/Pagination.vue";
export default {
  name: "Products",
  emits: ["setloading", "getBalance"],
  components: { Pagination },
  data() {
    return {
      _: Intl.NumberFormat(),
      supply_status: localStorage.supply_status,
      markets_page: 0,
      markets_pages: 1,
      markets: [],
      market: null,
      category_search: "",
      categories_page: 0,
      categories_pages: 1,
      categories: [],
      category: "",
      type_search: "",
      type_page: 0,
      type_pages: 1,
      types: [],
      currencies: [],
      currency: null,
      units: ["dona", "kg", "litr", "metr"],
      supplies_page: 0,
      supplies_pages: 1,
      supplies_limit: 25,
      supplies_category: null,
      supplies_product_type: null,
      supplies_market: null,
      supplies: [],
      new_supply: {
        code: 0,
        category_name: "",
        product_type_name: "",
        product_type_name2: "",
        quantity: null,
        olchov_birligi: "",
        price: null,
        currency_id: null,
        market_id: null,
        party_id: this.$route.params.id,
      },
      product_units: [],
      unit_quantity: null,
      unit_id: null,
    };
  },
  created() {
    this.getSupplies(0, 25);
  },
  methods: {
    getSupplies(page, limit) {
      this.$emit("setloading", true);
      let category_id = this.supplies_category ? this.supplies_category.id : 0;
      let product_type_id = this.supplies_product_type
        ? this.supplies_product_type.id
        : 0;
      let market_id = this.supplies_market ? this.supplies_market.id : 0;
      supplies(
        category_id,
        product_type_id,
        market_id,
        this.$route.params.id,
        page,
        limit
      )
        .then((Response) => {
          this.supplies_page = Response.data.current_page;
          this.supplies_pages = Response.data.pages;
          this.supplies_limit = Response.data.limit;
          this.supplies = Response.data.data;
          this.$emit("getBalance");
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    findProduct() {
      this.$emit("setloading", true);
      productsForTrade(this.new_supply.code)
        .then((res) => {
          if (res.data) {
            this.category = res.data.category;
            this.currency = res.data.Products.currency;
            this.new_supply.olchov_birligi = res.data.Products.olchov_birligi;
            this.new_supply.price = res.data.Products.price;
            this.new_supply.product_type_name =
              res.data.Products.product_type.name;
            this.new_supply.product_type_name2 =
              res.data.Products.product_type.name2;
            this.getUnits();
          } else {
            swal({
              icon: "warning",
              title: "Bunday mahsulot mavjud emas !",
              timer: 2000,
            }).then(() => {
              this.new_supply.code = 0;
            });
          }
          this.$emit("setloading", false);
        })
        .catch((err) => {
          this.$emit("setloading", false);
          catchError(err);
        });
    },
    getUnits() {
      this.$emit("setloading", true);
      productUnits(this.new_supply.code)
        .then((res) => {
          this.product_units = res.data;
          this.$emit("setloading", false);
        })
        .catch((err) => {
          this.$emit("setloading", false);
          catchError(err);
        });
    },
    countUnit() {
      let unit = this.product_units.find(({ id }) => {
        return id == this.unit_id;
      });
      if (unit) {
        this.new_supply.quantity = this.unit_quantity * unit.quantity;
      } else {
        this.new_supply.quantity = 0;
      }
    },
    addSupply(supply) {
      this.$emit("setloading", true);
      supply.code = supply.code ? supply.code : 0;
      supply.category_name = this.category;
      supply.market_id = this.market.id;
      supply.currency_id = this.currency.id;
      takeSupply(supply)
        .then((Response) => {
          success("close-add-supply").then(() => {
            // this.market = null;
            // this.category = "";
            this.currency = null;
            new_supply.code = 0;
            new_supply.category_name = "";
            new_supply.product_type_name = "";
            new_supply.product_type_name2 = "";
            new_supply.quantity = null;
            new_supply.olchov_birligi = "";
            new_supply.price = null;
            new_supply.currency_id = null;
            new_supply.market_id = null;
            new_supply.party_id = $route.params.id;
            this.getSupplies(0, 25);
          });
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    deleteSupply(supply_id) {
      removeSupply(supply_id)
        .then((Response) => {
          success().then(() => {
            this.getSupplies(0, 25);
          });
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getMarkets() {
      markets(0, 25)
        .then((Response) => {
          this.markets_page = 0;
          this.markets_pages = Response.data.pages;
          this.markets = Response.data.data;
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getCategories() {
      let search = this.category
        ? this.category
        : this.category_search
        ? this.category_search
        : "";
      categories(search, 0, 25)
        .then((Response) => {
          this.categories_page = 0;
          this.categories_pages = Response.data.pages;
          this.categories = Response.data.data;
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getProductTypes() {
      let category_id = this.supplies_category ? this.supplies_category.id : 0;
      productTypes(category_id, this.type_search, 0, 25)
        .then((Response) => {
          this.type_page = 0;
          this.type_pages = Response.data.pages;
          this.types = Response.data.data;
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
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
    scrollMarkets() {
      let div = document.querySelector(".markets-scroll");
      if (div.scrollTop + div.clientHeight >= div.scrollHeight) {
        if (this.markets_page < this.markets_pages - 1) {
          markets(this.markets_page + 1, 25)
            .then((Response) => {
              this.markets_page = Response.data.current_page;
              this.markets = this.markets.concat(Response.data.data);
            })
            .catch((error) => {
              catchError(error);
            });
        }
      }
    },
    scrollCategories() {
      let div = document.querySelector(".categories-scroll");
      if (div.scrollTop + div.clientHeight >= div.scrollHeight) {
        if (this.categories_page < this.categories_pages - 1) {
          categories(this.category, this.categories_page + 1, 25)
            .then((Response) => {
              this.categories_page = Response.data.current_page;
              this.categories = this.categories.concat(Response.data.data);
            })
            .catch((error) => {
              catchError(error);
            });
        }
      }
    },
    scrollTypes() {
      let div = document.querySelector(".types-scroll");
      if (div.scrollTop + div.clientHeight >= div.scrollHeight) {
        if (this.type_page < this.type_pages - 1) {
          productTypes(this.type_search, this.type_page + 1, 25)
            .then((Response) => {
              this.type_page = Response.data.current_page;
              this.types = this.types.concat(Response.data.data);
            })
            .catch((error) => {
              catchError(error);
            });
        }
      }
    },
  },
};
</script>
