<template>
  <button
    v-show="false"
    data-toggle="modal"
    data-target="#product-edit"
  ></button>

  <modal id="product-edit">
    <template #header>
      <h4>
        {{
          product?.category +
          " " +
          product?.Products?.product_type?.name +
          " " +
          product?.Products?.product_type?.name2
        }}
        mahsulotni tahrirlash
      </h4>
    </template>
    <template #body>
      <tabs
        :tab_buttons="[`Narxi`, `Qismlari`, `O'lchov birliklari`, `O'rni`]"
        :tab_slots="[`price`, `part`, `unit`, `cell`]"
      >
        <template #price>
          <form id="edit-product" @submit.prevent="putProduct(product)">
            <div class="row gap-2 text-left">
              <label class="col-12">
                oxirgi narx
                <div class="input-group input-group-sm">
                  <input
                    type="number"
                    min="0"
                    step="any"
                    class="form-control"
                    placeholder="oxirgi narx"
                    required
                    v-model="product.Products.last_price"
                  />
                  <div class="input-group-append">
                    <select
                      class="form-select form-select-sm"
                      v-model="product.Products.last_currency_id"
                      @change="
                        product.Products.sotuv_currency_id =
                          product.Products.last_currency_id;
                        product.Products.vitrina_currency_id =
                          product.Products.last_currency_id;
                      "
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
              </label>
              <label class="col-12">
                sotuv narx
                <div class="input-group input-group-sm">
                  <input
                    type="number"
                    min="0"
                    step="any"
                    class="form-control"
                    placeholder="sotuv narx"
                    required
                    v-model="product.Products.sotuv_price"
                  />
                  <div class="input-group-append">
                    <select
                      class="form-select form-select-sm"
                      disabled
                      v-model="product.Products.sotuv_currency_id"
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
              </label>
              <label class="col-12">
                vitrina narx
                <div class="input-group input-group-sm">
                  <input
                    type="number"
                    min="0"
                    step="any"
                    class="form-control"
                    placeholder="vitrina narx"
                    required
                    v-model="product.Products.vitrina_price"
                  />
                  <div class="input-group-append">
                    <select
                      class="form-select form-select-sm"
                      disabled
                      v-model="product.Products.vitrina_currency_id"
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
              </label>
            </div>
          </form>
        </template>
        <template #part>
          <form
            id="edit-product"
            @submit.prevent="postComposition(product_composition)"
          >
            <div class="row gap-2">
              <div class="col-12">
                <input
                  type="text"
                  class="form-control form-control-sm"
                  placeholder="qism nomi"
                  required
                  v-model="product_composition.name"
                />
              </div>
              <div class="col-12">
                <div class="input-group input-group-sm">
                  <input
                    type="number"
                    step="any"
                    class="form-control"
                    placeholder="qism hajmi"
                    required
                    v-model="product_composition.quantity"
                  />
                  <div class="input-group-append">
                    <select
                      class="form-select form-select-sm"
                      required
                      v-model="product_composition.olchov_birligi"
                    >
                      <option hidden value="">o'lchov birligi</option>
                      <option value="dona">dona</option>
                      <option value="kg">kg</option>
                      <option value="litr">litr</option>
                      <option value="metr">metr</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </form>
          <hr />
          <div class="row gap-2">
            <div
              class="col-12"
              v-for="item in product.Products.product_type.product_composition"
              :key="item"
            >
              <form @submit.prevent="putComposition(item)">
                <div class="input-group input-group-sm">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="qism nomi"
                    required
                    v-model="item.name"
                  />
                  <div class="input-group-text">
                    {{
                      $util.currency(item.quantity) + " " + item.olchov_birligi
                    }}
                  </div>
                  <div class="input-group-append">
                    <button class="btn btn-outline-warning">
                      <i class="far fa-edit"></i>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </template>
        <template #unit>
          <div class="row gap-1">
            <div class="col-12">
              <form id="edit-product" @submit.prevent="postUnit(product_unit)">
                <div class="input-group input-group-sm">
                  <div class="input-group-text">1</div>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="o'lchov turi"
                    required
                    v-model="product_unit.olchov"
                  />
                  <div class="input-group-text">=</div>
                  <input
                    type="number"
                    class="form-control"
                    min="0"
                    step="any"
                    placeholder="miqdori"
                    required
                    v-model="product_unit.quantity"
                  />
                  <div class="input-group-text">
                    {{ product.Products.olchov_birligi }}
                  </div>
                </div>
              </form>
            </div>
            <div class="col-12">
              <ul class="list-group gap-1">
                <li
                  class="list-group-item"
                  v-for="item in product_units"
                  :key="item"
                >
                  {{
                    "1 " +
                    item.olchov +
                    " = " +
                    $util.currency(item.quantity) +
                    " dona"
                  }}
                  <button
                    class="btn btn-sm btn-outline-danger"
                    @click="deleteUnit(item.id)"
                  >
                    <i class="fa fa-trash"></i>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </template>
        <template #cell>
          <form id="edit-product" @submit.prevent="putProduct(product)">
            <div class="dropdown">
              <button
                type="button"
                id="cellDropdown"
                class="btn btn-sm btn-block btn-outline-primary dropdown-toggle"
                data-toggle="dropdown"
                @click="getCells()"
              >
                {{ cell?.name || "Mahsulot o'rni" }}
              </button>
              <div
                class="dropdown-menu w-100 mt-1 p-1"
                aria-labelledby="cellDropdown"
              >
                <ul
                  class="list-group p-1 responsive"
                  style="max-height: 25vh"
                  @scroll="scrollCells($event)"
                >
                  <li
                    class="list-group-item p-2"
                    @click="
                      cell = null;
                      product.Products.cell_id = 0;
                    "
                  >
                    Bo'sh
                  </li>
                  <li
                    class="list-group-item p-2"
                    v-for="item in cells.data"
                    :key="item"
                    @click="
                      cell = item;
                      product.Products.cell_id = item.id;
                    "
                  >
                    {{ item.name }}
                  </li>
                </ul>
              </div>
            </div>
          </form>
        </template>
      </tabs>
    </template>
    <template #footer>
      <button type="submit" class="btn btn-outline-primary" form="edit-product">
        <i class="far fa-circle-check"></i>
      </button>
      <button
        class="btn btn-outline-danger"
        data-dismiss="modal"
        close-update-product-modal
      >
        <i class="far fa-circle-xmark"></i>
      </button>
    </template>
  </modal>
</template>

<script>
import * as api from "../Api/api";
export default {
  name: "ProductEdit",
  emits: ["setloading", "getProducts"],
  data() {
    return {
      currencies: [],
      product: {
        Products: {
          code: 0,
          cell_id: 0,
          cell: null,
          currency_id: 0,
          last_currency_id: 0,
          updated_code: 0,
          tan_narx: 0,
          user_id: 0,
          category_id: 0,
          tan_narx_currency_id: 0,
          branch_id: 0,
          product_type_id: 0,
          vitrina_price: 0,
          quantity: 0,
          vitrina_currency_id: 0,
          olchov_birligi: "",
          sotuv_price: 0,
          price: 0,
          sotuv_currency_id: 0,
          id: 0,
          last_price: 0,
          product_type: {
            category_id: 0,
            name: "",
            name2: "",
            id: 0,
            product_composition: [
              {
                product_type_id: 0,
                olchov_birligi: "",
                quantity: 0,
                name: "",
                id: 0,
                user_id: 0,
              },
            ],
          },
        },
        category: "",
        sum_quantity: 0,
        vitrina_currency: { user_id: 0, currency: "", id: 0, price: 0 },
        sotuv_currency: { user_id: 0, currency: "", id: 0, price: 0 },
        last_currency: { user_id: 0, currency: "", id: 0, price: 0 },
        vitrina: 0,
        sotuv: 0,
        last: 0,
      },
      product_composition: {
        product_type_id: null,
        name: "",
        quantity: null,
        olchov_birligi: "",
      },
      product_unit: {
        code: null,
        olchov: "",
        quantity: null,
      },
      product_units: [],
      search_cell: "",
      cells: {
        current_page: 0,
        pages: 1,
        limit: 25,
        data: [],
      },
      cell: null,
    };
  },
  created() {
    this.getCurrencies();
    this.getCells();
  },
  methods: {
    start(code) {
      this.getProduct(code);
    },
    getProduct(code) {
      this.$emit("setloading", true);
      api
        .productsForTrade(code)
        .then((res) => {
          this.product = res.data;
          this.cell = this.product.Products.cell;
          this.getUnits();
        })
        .catch((err) => {
          this.$emit("setloading", false);
          api.catchError(err);
        });
    },
    getCurrencies() {
      api
        .currencies()
        .then((res) => {
          this.currencies = res.data;
          this.$emit("setloading", false);
        })
        .catch((err) => {
          this.$emit("setloading", false);
          api.catchError(err);
        });
    },
    getCells() {
      this.$emit("setloading", true);
      api
        .cells(this.search_cell, 0, 25)
        .then((res) => {
          this.cells = res.data;
          this.$emit("setloading", false);
        })
        .catch((err) => {
          this.$emit("setloading", false);
          api.catchError(err);
        });
    },
    scrollCells(event) {
      const element = event.target;
      if (element.scrollTop + element.clientHeight >= element.scrollHeight) {
        if (this.cells.current_page < this.cells.pages) {
          api
            .cells(this.search_cell, this.cells.current_page + 1, 25)
            .then((res) => {
              this.cells.current_page = res.data.current_page;
              this.cells.pages = res.data.pages;
              this.cells.data = this.cells.data.concat(res.data.data);
            });
        }
      }
    },
    putProduct(product) {
      this.$emit("setloading", true);
      let data = {
        vitrina_price: product.Products.vitrina_price,
        vitrina_currency_id: product.Products.vitrina_currency_id,
        sotuv_price: product.Products.sotuv_price,
        sotuv_currency_id: product.Products.sotuv_currency_id,
        last_price: product.Products.last_price,
        last_currency_id: product.Products.last_currency_id,
        code: product.Products.code,
        cell_id: this.cell?.id || 0,
      };
      api
        .updateProduct(data)
        .then((res) => {
          api.success("close-update-product-modal").then(() => {
            this.$emit("getProducts", 0, 25);
          });
        })
        .catch((err) => {
          this.$emit("setloading", false);
          api.catchError(err);
        });
    },
    postComposition(composition) {
      this.$emit("setloading", true);
      composition.product_type_id = this.product.Products.product_type_id;
      api
        .createProductComposition(composition)
        .then((res) => {
          api.success("close-update-product-modal").then(() => {
            this.product_composition = {
              product_type_id: null,
              name: "",
              quantity: null,
              olchov_birligi: "",
            };
            this.$emit("getProducts", 0, 25);
          });
        })
        .catch((err) => {
          this.$emit("setloading", false);
          api.catchError(err);
        });
    },
    putComposition(composition) {
      this.$emit("setloading", true);
      api
        .updateProductComposition(composition)
        .then((res) => {
          api.success("close-update-product-modal").then(() => {
            this.$emit("getProducts", 0, 25);
          });
        })
        .catch((err) => {
          this.$emit("setloading", false);
          api.catchError(err);
        });
    },
    getUnits() {
      this.$emit("setloading", true);
      api
        .productUnits(this.product.Products.code)
        .then((res) => {
          this.product_units = res.data;
          document.querySelector(`[data-target="#product-edit"]`).click();
          this.$emit("setloading", false);
        })
        .catch((err) => {
          this.$emit("setloading", false);
          api.catchError(err);
        });
    },
    postUnit(unit) {
      this.$emit("setloading", true);
      unit.code = this.product.Products.code;
      api
        .createProductUnit(unit)
        .then((res) => {
          api.success("close-update-product-modal").then(() => {
            this.product_unit = {
              code: null,
              olchov: "",
              quantity: null,
            };
            this.$emit("getProducts", 0, 25);
          });
        })
        .catch((err) => {
          this.$emit("setloading", false);
          api.catchError(err);
        });
    },
    deleteUnit(id) {
      this.$emit("setloading", true);
      api
        .deleteProductUnit(id)
        .then((res) => {
          api.success("close-update-product-modal").then(() => {
            this.$emit("getProducts", 0, 25);
          });
        })
        .catch((err) => {
          this.$emit("setloading", false);
          api.catchError(err);
        });
    },
  },
};
</script>
