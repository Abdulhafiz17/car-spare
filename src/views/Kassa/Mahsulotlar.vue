<template>
  <div class="row my-1">
    <div class="col-md-5 mx-auto">
      <form @submit.prevent="checkProduct(barcode)">
        <div class="dropdown">
          <input
            type="text"
            class="form-control form-control-sm text-center"
            placeholder="code"
            list="products"
            barcode
            :disabled="!order"
            v-model="barcode"
            @keyup="keyupBarcode(barcode)"
            @focusout="barcode = null"
          />
          <div class="dropdown-menu mt-1 w-100" dropdown>
            <div class="responsive-y" style="max-height: 30vh">
              <li
                class="dropdown-item justify-content-between align-items-center"
                style="display: flex"
                v-for="item in products"
                :key="item"
                @click="checkProduct(item.Products.code)"
              >
                <span>
                  {{
                    `${item.category} - ${item.Products.product_type?.name} ${item.Products.product_type?.name2}`
                  }}
                </span>
                <span>{{ `${$util.currency(item.sum_quantity)} dona` }}</span>
              </li>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>

  <div class="responsive-y" style="height: 72vh">
    <table class="table table-sm table-hover">
      <thead>
        <tr>
          <th>№</th>
          <th>Mahsulot</th>
          <th style="width: 20%">Hajm</th>
          <th>Narx</th>
          <th>Chegirma</th>
          <th>To'lov</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in trades" :key="item">
          <td>{{ index + 1 }}</td>
          <td>
            {{
              item.Trades.product.category.name +
              " - " +
              item.Trades.product.product_type.name +
              " - " +
              item.Trades.product.product_type.name2 +
              (item.Trades.product_composition
                ? " ( " + item.Trades.product_composition.name + " ) "
                : "")
            }}
          </td>
          <td>
            <div class="input-group input-group-sm">
              <input
                type="number"
                min="0"
                step="any"
                class="form-control text-center"
                v-model="item.unit_quantity"
                @keyup="countTradeUnit(item.Trades.id)"
                @focusout="
                  item.unit_quantity && item.unit_id ? putTrade(item) : false
                "
                v-if="item.Trades.product.olchovlar.length"
              />
              <select
                class="form-select form-select-sm"
                style="padding: 4px 10px"
                v-model="item.unit_id"
                @change="countTradeUnit(item.Trades.id)"
                @focusout="
                  item.unit_quantity && item.unit_id ? putTrade(item) : false
                "
                v-if="item.Trades.product.olchovlar.length"
              >
                <option
                  v-for="item2 in item.Trades.product.olchovlar"
                  :value="item2.id"
                >
                  {{ item2.olchov }}
                </option>
              </select>
              <input
                type="number"
                min="0"
                step="any"
                class="form-control text-center"
                required
                v-model="item.sum_quantity"
                @focusout="putTrade(item)"
              />
              <div class="input-group-text">
                {{
                  item.Trades.product_composition
                    ? item.Trades.product_composition.olchov_birligi
                    : item.Trades.product.olchov_birligi
                }}
              </div>
            </div>
          </td>
          <td>
            <div class="input-group input-group-sm">
              <input
                type="number"
                min="0"
                step="any"
                class="form-control text-center"
                required
                :disabled="item.Trades.product_composition"
                v-model="item.Trades.price"
                @focusout="putTrade(item)"
              />
              <div class="input-group-text">so'm</div>
            </div>
          </td>
          <td>
            <div class="input-group input-group-sm">
              <input
                type="number"
                min="0"
                step="any"
                class="form-control text-center"
                required
                :disabled="item.Trades.product_composition"
                v-model="item.Trades.discount"
                @focusout="putTrade(item)"
              />
              <div class="input-group-text">so'm</div>
            </div>
          </td>
          <td>
            {{
              $util.currency(
                (item.Trades.price - item.Trades.discount) * item.sum_quantity
              ) + " so'm"
            }}
          </td>
          <td>
            <button
              class="btn btn-sm btn-outline-danger"
              @click="deleteTrade(item)"
            >
              <i class="fa fa-trash" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <button
    data-toggle="modal"
    data-target="#to-trade"
    data-backdrop="static"
    to-trade-button
    v-show="false"
  ></button>
  <modal id="to-trade">
    <template #header>
      <h4>
        {{
          product?.category +
          " " +
          product?.Products?.product_type?.name +
          " " +
          product?.Products?.product_type?.name2
        }}
        <br />
        <div class="text-start">
          {{ $util.currency(product?.vitrina) + " so'm" }}
        </div>
      </h4>
    </template>
    <template #body>
      <form id="post-trade" @submit.prevent="postTrade()">
        <div class="row gap-1">
          <div
            class="col-12"
            v-if="product?.Products?.product_type?.product_composition?.length"
          >
            <button
              type="button"
              class="btn btn-sm btn-block"
              :class="composition_status ? 'btn-danger' : 'btn-primary'"
              @click="
                composition_status = !composition_status;
                composition = null;
                trade = {
                  code: null,
                  o_pr_id: 0,
                  pr_comp_id: 0,
                  quantity: null,
                  price: null,
                  discount: null,
                  order_id: 0,
                  status: true,
                };
              "
            >
              Qismga bo'lib sotish
              <i :class="`fa fa-${composition_status ? 'xmark' : 'plus'}`"></i>
            </button>
          </div>
          <div class="col-12" v-if="composition_status">
            <div class="row mb-1">
              <div class="col-6">
                <button
                  type="button"
                  class="btn btn-sm btn-block"
                  :class="trade.status ? 'btn-primary' : 'btn-outline-primary'"
                  @click="
                    composition = null;
                    trade.status = true;
                    compositions =
                      product?.Products?.product_type?.product_composition;
                  "
                >
                  Yangi tarkib
                </button>
              </div>
              <div class="col-6">
                <button
                  type="button"
                  class="btn btn-sm btn-block"
                  :class="!trade.status ? 'btn-primary' : 'btn-outline-primary'"
                  @click="
                    trade.status = false;
                    composition = null;
                    getOpenedProducts(0, 25);
                  "
                >
                  Buzilgan tarkib
                </button>
              </div>
            </div>
            <div class="responsive-y" style="max-height: 35vh">
              <ul class="list-group" v-if="trade.status">
                <li
                  class="list-group-item"
                  :class="item == composition ? 'bg-success' : ''"
                  v-for="item in compositions"
                  :key="item"
                  @click="
                    item == composition
                      ? (composition = null)
                      : (composition = item)
                  "
                >
                  <span>{{ item.name }}</span>
                  <span>{{ $util.currency(item.quantity) + " " + item.olchov_birligi }}</span>
                </li>
              </ul>
              <div class="row gap-1" v-else-if="!trade.status">
                <div
                  class="col-12 text-start"
                  v-for="(item, index) in opened_products?.data"
                  :key="item"
                >
                  <strong>
                    {{ "Mahsulot id: " + item.Opened_products.id }}
                  </strong>
                  <ul class="list-group">
                    <li
                      class="list-group-item"
                      :class="item2 == composition ? 'bg-success' : ''"
                      v-for="item2 in item.Opened_products.product_type
                        .product_composition"
                      :key="item2"
                      v-show="item2.quantity"
                      @click="
                        trade.o_pr_id = item.Opened_products.id;
                        item2 == composition
                          ? (composition = null)
                          : (composition = item2);
                      "
                    >
                      <span>{{ item2.name }}</span>
                      <span>{{
                        $util.currency(item2.quantity) + " " + item2.olchov_birligi
                      }}</span>
                    </li>
                  </ul>
                  <hr v-if="index < opened_products?.data?.length - 1" />
                </div>
                <!-- <div
                  class="col-12"
                  v-for="item in composition_products?.data"
                  :key="item"
                >
                  <collapse
                    @click="
                      trade.o_pr_id = item.Opened_products.id;
                      getOpenedProductCompositions(item);
                    "
                  >
                    <template #header>
                      Mahsulot id: {{ item.Opened_products.id }}
                    </template>
                    <template #body>
                      <ul class="list-group">
                        <li
                          class="list-group-item"
                          :class="item == composition ? 'bg-success' : ''"
                          v-for="item in compositions"
                          :key="item"
                          v-show="item.quantity"
                          @click="
                            item == composition
                              ? (composition = null)
                              : (composition = item)
                          "
                        >
                          <span>{{ item.name }}</span>
                          <span>{{
                            item.quantity + " " + item.olchov_birligi
                          }}</span>
                        </li>
                      </ul>
                    </template>
                  </collapse>
                </div> -->
                <div class="col-12">
                  <Pagination
                    :page="opened_products?.current_page"
                    :pages="opened_products?.pages"
                    :limit="opened_products?.limit"
                    @get="getOpenedProducts"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="col-12">
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
              <select
                class="form-select form-select-sm"
                v-model="unit_id"
                @change="countUnit()"
                v-if="product_units.length"
              >
                <option
                  v-for="item in product_units"
                  :key="item"
                  :value="item.id"
                >
                  {{ item.olchov }}
                </option>
              </select>
              <input
                type="number"
                class="form-control"
                min="1"
                step="any"
                placeholder="miqdor"
                required
                v-model="trade.quantity"
              />
              <div class="input-group-text">
                {{
                  composition_status && composition && !product_units.length
                    ? composition?.olchov_birligi
                    : product?.Products?.olchov_birligi
                }}
              </div>
            </div>
          </div>
          <div class="col-12">
            <div class="input-group input-group-sm">
              <input
                class="form-control"
                type="number"
                min="0"
                step="any"
                placeholder="narx"
                required
                v-model="trade.price"
              />
              <div class="input-group-text">so'm</div>
              <div class="input-group-append">
                <button
                  type="button"
                  class="btn btn-outline-primary"
                  @click="show_price = !show_price"
                >
                  <i class="fa fa-money-bill"></i>
                </button>
              </div>
            </div>
          </div>
          <div class="col-12 text-left" v-if="show_price">
            <div class="row">
              <div class="col-12">
                Vitrina:
                <strong>{{ $util.currency(product.vitrina) }}</strong> so'm
              </div>
              <div class="col-12">
                Sotuv: <strong>{{ $util.currency(product.sotuv) }}</strong> so'm
              </div>
              <div class="col-12">
                Minimal:
                <strong>{{ $util.currency(product.last) }}</strong> so'm
              </div>
            </div>
          </div>
          <div class="col-12">
            <div class="input-group input-group-sm">
              <input
                class="form-control"
                type="number"
                min="0"
                step="any"
                placeholder="chegirma"
                v-model="trade.discount"
              />
              <div class="input-group-text">so'm</div>
            </div>
          </div>
        </div>
      </form>
    </template>
    <template #footer>
      <button class="btn btn-outline-primary" form="post-trade">
        <i class="far fa-circle-check"></i>
      </button>
      <button
        class="btn btn-outline-danger"
        data-dismiss="modal"
        close-to-trade-modal
      >
        <i class="far fa-circle-xmark"></i>
      </button>
    </template>
  </modal>

  <button
    data-toggle="modal"
    data-target="#composition"
    data-backdrop="static"
    composition-modal-button
    v-show="false"
  ></button>
  <modal id="composition">
    <template #header>
      <h4>Mahsulot qismlari</h4>
    </template>
    <template #body>
      <div class="responsive-y" style="max-height: 65vh">
        <ul class="list-group">
          <li
            class="list-group-item"
            v-for="item in compositions"
            :key="item"
            @click="postTrade(barcode, item.id)"
          >
            <span>{{ item.name }}</span>
            <span>{{
              $util.currency(item.quantity) + " " + item.olchov_birligi
            }}</span>
          </li>
        </ul>
      </div>
    </template>
    <template #footer>
      <button class="btn btn-outline-primary">
        <i class="far fa-circle-check"></i>
      </button>
      <button
        class="btn btn-outline-danger"
        data-dismiss="modal"
        close-composition-modal
      >
        <i class="far fa-circle-xmark"></i>
      </button>
    </template>
  </modal>
</template>

<script>
import {
  catchError,
  openedProducts,
  productUnits,
  products,
  productsForTrade,
  success,
  toTrade,
  trades,
  updateTrade,
  removeTrade,
} from "@/components/Api/api";
import Pagination from "@/components/Pagination/Pagination.vue";
import swal from "sweetalert";
export default {
  name: "Products",
  props: ["current_order"],
  emits: ["setloading", "getOrderBalance"],
  components: { Pagination },
  data() {
    return {
      _: Intl.NumberFormat(),
      branch_id: localStorage["branch_id"],
      barcode: null,
      products: [],
      product: null,
      compositions: [],
      composition: null,
      opened_products: [],
      composition_status: false,
      product_units: [],
      unit_quantity: null,
      unit_id: null,
      show_price: false,
      trade: {
        code: null,
        o_pr_id: 0,
        pr_comp_id: 0,
        quantity: null,
        price: null,
        discount: null,
        order_id: 0,
        status: true,
      },
      trades: [],
    };
  },
  computed: {
    order() {
      return this.$props.current_order;
    },
  },
  watch: {
    order(order) {
      if (order) {
        this.getTrades();
      } else {
        this.trades = [];
      }
    },
  },
  created() {
    if (this.order) {
      this.getTrades();
    } else {
      this.trades = [];
    }
  },
  methods: {
    keyupBarcode(barcode) {
      if (barcode) this.getProducts();
      else this.products = [];
      this.toggleDropdown(false);
    },
    toggleDropdown(status) {
      let div = document.querySelector("[dropdown]");
      if (status) {
        div.classList.add("show");
      } else {
        div.classList.remove("show");
        this.products = [];
      }
    },
    getProducts() {
      products(this.barcode, "price_true", this.branch_id, 0, 50)
        .then((Response) => {
          this.products = Response.data.data;
          this.toggleDropdown(this.products.length);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    checkProduct(barcode) {
      this.$emit("setloading", true);
      productsForTrade(barcode)
        .then((Response) => {
          this.toggleDropdown(0);
          if (Response.data) {
            this.product = Response.data;
            this.compositions =
              Response.data.Products.product_type.product_composition;
            this.composition = null;
            this.composition_status = false;
            this.product_units = [];
            this.unit_quantity = null;
            this.unit_id = null;
            this.show_price = false;
            this.trade = {
              code: null,
              o_pr_id: 0,
              pr_comp_id: 0,
              quantity: 1,
              price: this.product.vitrina,
              discount: null,
              order_id: 0,
              status: true,
            };
            this.getProductUnits();
          } else {
            swal({
              icon: "error",
              title: "Bunday mahsulot mavjud emas",
              text: " ",
              timer: 2000,
              buttons: false,
              closeOnEsc: false,
              closeOnClickOutside: false,
            }).then(() => {
              this.toggleDropdown(0);
              this.$emit("setloading", false);
            });
          }
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getProductUnits() {
      productUnits(this.product.Products.code)
        .then((res) => {
          this.product_units = res.data;
          this.$emit("setloading", false);
          document.querySelector("[to-trade-button]").click();
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getOpenedProducts(page, limit) {
      this.$emit("setloading", true);
      openedProducts(
        this.product.Products.code,
        this.branch_id,
        page,
        limit
      ).then((res) => {
        this.opened_products = res.data;
        this.opened_products.data.forEach((item, index) => {
          item.Opened_products.product_type.product_composition.forEach(
            (item2) => {
              let composition = this.opened_products.trade_quantity.find(
                (item3) => {
                  return (
                    item.Opened_products.id == item3.o_pr_id &&
                    item2.id == item3.pr_comp_id
                  );
                }
              );
              if (composition) {
                item2.quantity = item2.quantity - composition.trade_quantity;
              }
            }
          );
          if (index == this.opened_products.data.length - 1) {
            this.$emit("setloading", false);
          }
        });
      });
    },
    countUnit() {
      let unit = this.product_units.find(({ id }) => {
        return id == this.unit_id;
      });
      if (unit) {
        this.trade.quantity = this.unit_quantity * unit.quantity;
      } else {
        this.trade.quantity = 0;
      }
    },
    countTradeUnit(id) {
      let trade = this.trades.find((item) => {
        return item.Trades.id == id;
      });
      let unit = trade.Trades.product.olchovlar.find(({ id }) => {
        return id == trade.unit_id;
      });
      if (unit) {
        trade.sum_quantity = trade.unit_quantity * unit.quantity;
      } else {
        trade.sum_quantity = 0;
      }
    },
    postTrade() {
      this.$emit("setloading", true);
      this.trade.code = this.product.Products.code;
      this.trade.order_id = this.order.Orders.id;
      this.trade.discount = this.trade.discount ? this.trade.discount : 0;
      this.trade.pr_comp_id = this.composition ? this.composition.id : 0;
      toTrade(this.trade)
        .then((Response) => {
          success().then(() => {
            this.barcode = null;
            this.trade = {
              code: null,
              o_pr_id: 0,
              pr_comp_id: 0,
              quantity: null,
              price: null,
              discount: null,
              order_id: 0,
              status: true,
            };
            document.querySelector("[close-to-trade-modal]").click();
            this.getTrades();
          });
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
          this.barcode = null;
          document.querySelector("[barcode]").focus();
        });
    },
    getTrades() {
      this.$emit("setloading", true);
      trades(this.order.Orders.id, this.branch_id)
        .then((Response) => {
          this.trades = Response.data.trades;
          this.trades.forEach((item) => {
            item.unit_quantity = 0;
            item.unit_id = 0;
            item.Trades.price = Number(item.Trades.price.toFixed(2));
          });
          this.toggleDropdown(0);
          document.querySelector("[barcode]").focus();
          // this.$emit("getOrderBalance", this.order.Orders.id);
          this.$emit("getOrderBalance", Response.data.order_balance);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    // putTradeQuantity(trade, action) {
    //   this.$emit("setloading", true);
    //   swal({
    //     icon: "info",
    //     title: "Miqdorni kiriting",
    //     content: {
    //       element: "input",
    //       attributes: {
    //         type: "number",
    //         class: "form-control form-control-sm",
    //         min: "0",
    //         step: "any",
    //         placeholder: "miqdor",
    //       },
    //     },
    //     buttons: {
    //       confirm: {
    //         visible: true,
    //         text: "Ok",
    //         value: true,
    //       },
    //       cancel: {
    //         visible: true,
    //         text: "Bekor qilish",
    //         value: false,
    //       },
    //     },
    //   }).then((value) => {
    //     if (value) {
    //       let status = Boolean;
    //       let data = {
    //         code: trade.Trades.code,
    //         quantity: value,
    //         price: trade.Trades.price,
    //         discount: trade.Trades.discount,
    //         order_id: this.order.Orders.id,
    //       };
    //       action == "+"
    //         ? (status = true)
    //         : action == "-"
    //         ? (status = false)
    //         : false;
    //       updateTrade(status, data)
    //         .then((Response) => {
    //           success().then(() => {
    //             this.getTrades();
    //           });
    //         })
    //         .catch((error) => {
    //           this.$emit("setloading", false);
    //           catchError(error);
    //         });
    //     } else {
    //       this.$emit("setloading", false);
    //     }
    //   });
    // },
    putTrade(trade) {
      this.$emit("setloading", true);
      let data = {
        code: trade.Trades.code,
        o_pr_id: 0,
        pr_comp_id: trade.Trades.pr_comp_id,
        quantity: trade.sum_quantity,
        price: trade.Trades.price,
        discount: trade.Trades.discount,
        order_id: this.order.Orders.id,
        status: true,
      };
      updateTrade(data)
        .then((Response) => {
          success().then(() => {
            this.getTrades();
          });
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
          this.getTrades();
        });
    },
    deleteTrade(trade) {
      this.$emit("setloading", true);
      removeTrade(trade.Trades.id)
        .then((Response) => {
          success().then(() => {
            this.getTrades();
          });
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
          document.querySelector("[barcode]").focus();
        });
    },
  },
};
</script>

<style lang="scss" scoped>
input[type="number"] {
  appearance: textfield;
  -moz-appearance: textfield;
}

input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
