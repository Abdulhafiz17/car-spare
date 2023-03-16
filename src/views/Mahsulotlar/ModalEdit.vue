<template>
  <div class="modal fade" id="editProduct">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h4>
            {{
              product?.category +
              " - " +
              product?.Products.articul +
              " - " +
              product?.Products.eni +
              (product?.Products.boyi
                ? " x " + product?.Products.boyi
                : " metr")
            }}
          </h4>
        </div>
        <div class="modal-body">
          <form @submit.prevent="putProduct(product)" id="form-put">
            <div class="row text-left gap-2" v-if="product">
              <div class="col-md-12">Mahsulot narxlari</div>
              <div class="col-md-12">
                <div class="input-group input-group-sm">
                  <input
                    type="number"
                    min="0"
                    step="any"
                    class="form-control form-control-sm"
                    placeholder="oxirgi narx"
                    required
                    v-model="product.Products.oxirgi_narx"
                  />
                  <div class="input-group-append">
                    <select
                      class="form-select form-select-sm"
                      required
                      v-model="product.Products.oxirgi_currency_id"
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
                  <div class="input-group-text">oxirgi narx</div>
                </div>
              </div>
              <div class="col-md-12">
                <div class="input-group input-group-sm">
                  <input
                    type="number"
                    min="0"
                    step="any"
                    class="form-control form-control-sm"
                    placeholder="sotuv narx"
                    required
                    v-model="product.Products.sotuv_narx"
                  />
                  <div class="input-group-append">
                    <select
                      class="form-select form-select-sm"
                      required
                      v-model="product.Products.sotuv_currency_id"
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
                  <div class="input-group-text">sotuv narx</div>
                </div>
              </div>
              <div class="col-md-12">
                <div class="input-group input-group-sm">
                  <input
                    type="number"
                    min="0"
                    step="any"
                    class="form-control form-control-sm"
                    placeholder="vitrina narx"
                    required
                    v-model="product.Products.vitrina_narx"
                  />
                  <div class="input-group-append">
                    <select
                      class="form-select form-select-sm"
                      required
                      v-model="product.Products.vitrina_currency_id"
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
                  <div class="input-group-text">vitrina narx</div>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-body">
          <div class="row text-left gap-2">
            <div class="col-md-12">Mahsulot vitrinasi</div>
            <div class="col-md-12">
              <div class="dropdown">
                <button
                  id="dropdownMenuButtonShowcases"
                  type="button"
                  class="btn btn-sm btn-block btn-outline-primary dropdown-toggle"
                  data-toggle="dropdown"
                  @click="getShowcases()"
                >
                  {{
                    location
                      ? location.name
                      : product?.Products.pr_loc_id
                      ? product?.pr_loc
                      : "Vitrina"
                  }}
                </button>
                <div
                  class="dropdown-menu w-100 mt-1"
                  aria-labelledby="dropdownMenuButtonShowcases"
                >
                  <div
                    class="responsive-y showcase-scroll"
                    style="max-height: 20vh"
                    @scroll="scrollShowcases()"
                  >
                    <button
                      type="button"
                      class="dropdown-item"
                      @click="location = null"
                    >
                      {{ "Vitrina" }}
                    </button>
                    <button
                      type="button"
                      class="dropdown-item"
                      v-for="item in showcases"
                      :key="item"
                      @click="location = item"
                    >
                      {{ item.name }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline-primary" form="form-put">
            <i class="far fa-circle-check" />
          </button>
          <button
            class="btn btn-outline-danger"
            data-dismiss="modal"
            close-edit
          >
            <i class="far fa-circle-xmark" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  catchError,
  currencies,
  productLocations,
  success,
  updateProduct,
} from "@/components/Api/api";
export default {
  name: "ModalEdit",
  props: ["product_edit"],
  emits: ["setloading", "getProducts"],
  data() {
    return {
      currencies: [],
      showcases_page: 0,
      showcases_pages: 1,
      showcases: [],
      location: null,
      update_product: {
        vitrina_narx: 0,
        vitrina_currency_id: 0,
        sotuv_narx: 0,
        sotuv_currency_id: 0,
        oxirgi_narx: 0,
        oxirgi_currency_id: 0,
        pr_loc_id: 0,
      },
    };
  },
  computed: {
    product() {
      return this.$props.product_edit;
    },
  },
  watch: {
    product(product) {
      this.location = null;
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
    getShowcases() {
      productLocations(0, 25)
        .then((Response) => {
          this.showcases_page = Response.data.current_page;
          this.showcases_pages = Response.data.pages;
          this.showcases = Response.data.data;
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    scrollShowcases() {
      let div = document.querySelector(".showcase-scroll");
      if (div.scrollTop + div.clientHeight >= div.scrollHeight) {
        if (this.showcases_page < this.showcases_pages - 1) {
          productLocations(this.showcases_page + 1, 25)
            .then((Response) => {
              this.showcases_page = Response.data.current_page;
              this.showcases = this.showcases.concat(Response.data.data);
            })
            .catch((error) => {
              this.$emit("setloading", false);
              catchError(error);
            });
        }
      }
    },
    putProduct(product) {
      this.$emit("setloading", true);
      let update_product = {
        vitrina_narx: product.Products.vitrina_narx,
        vitrina_currency_id: product.Products.vitrina_currency_id,
        sotuv_narx: product.Products.sotuv_narx,
        sotuv_currency_id: product.Products.sotuv_currency_id,
        oxirgi_narx: product.Products.oxirgi_narx,
        oxirgi_currency_id: product.Products.oxirgi_currency_id,
        pr_loc_id: this.location
          ? this.location.id
          : product.Products.pr_loc_id
          ? product.Products.pr_loc_id
          : 0,
      };
      updateProduct(product.Products.code, update_product)
        .then((Response) => {
          success("close-edit").then(() => {
            this.$emit("getProducts", 0, 25);
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
