<template>
  <div class="responsive-y">
    <table class="table table-sm table-hover">
      <thead>
        <tr>
          <td colspan="15">
            <div class="row">
              <div class="col-md-6">
                Umumiy tan narx:
                <span
                  class="p-2"
                  v-for="item in products?.products_sum_price"
                  :key="item"
                  v-show="item.total_price"
                >
                  {{ $util.currency(item.total_price) + " " + item.currency }}
                </span>
              </div>
              <div class="col-md-6">
                Umumiy vitrina narx:
                <span
                  class="p-2"
                  v-for="item in products?.products_sum_vitrina_price"
                  :key="item"
                  v-show="item.total_vitrina_price"
                >
                  {{
                    $util.currency(item.total_vitrina_price) +
                    " " +
                    item.currency
                  }}
                </span>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <th>№</th>
          <th>Kodi</th>
          <th>Kategoriya</th>
          <th>Artikul</th>
          <th>Marka</th>
          <th>Qoldiq</th>
          <th>O'rni</th>
          <th>Narx</th>
          <th>Tan narx</th>
          <th>Minimal narx</th>
          <th>Sotuv narx</th>
          <th>Vitrina narx</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in products.data" :key="item">
          <td>
            {{
              util.countOrdinalNumber(
                index,
                products.current_page + 1,
                products.limit
              )
            }}
          </td>
          <td>{{ item.Products.code }}</td>
          <td>{{ item.category }}</td>
          <td>{{ item.Products.product_type?.name }}</td>
          <td>{{ item.Products.product_type?.name2 }}</td>
          <td>
            {{
              $util.currency(item.sum_quantity) +
              " " +
              item.Products.olchov_birligi
            }}
          </td>
          <td>{{}}</td>
          <td>
            {{
              $util.currency(item.Products.price) +
              " " +
              item.Products.currency.currency
            }}
          </td>
          <td>
            {{
              $util.currency(item.Products.tan_narx) +
              " " +
              item.tan_narx_currency.currency
            }}
          </td>
          <td>
            {{
              status == "price_true"
                ? $util.currency(item.Products.last_price) +
                  " " +
                  item.last_currency.currency
                : "narx belgilanmagan"
            }}
          </td>
          <td>
            {{
              status == "price_true"
                ? $util.currency(item.Products.sotuv_price) +
                  " " +
                  item.sotuv_currency.currency
                : "narx belgilanmagan"
            }}
          </td>
          <td>
            {{
              status == "price_true"
                ? $util.currency(item.Products.vitrina_price) +
                  " " +
                  item.vitrina_currency.currency
                : "narx belgilanmagan"
            }}
          </td>
          <td>
            <div class="btn-group btn-group-sm">
              <button
                class="btn btn-outline-warning"
                @click="$refs.editProduct.start(item.Products.code)"
                v-if="editable"
              >
                <i class="far fa-edit"></i>
              </button>
              <button
                class="btn btn-outline-primary"
                @click="$refs.productBarcode.start(item)"
                v-if="show_barcode"
              >
                <i class="fa fa-barcode"></i>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="15"></td>
        </tr>
        <tr>
          <td colspan="15">
            <Pagination
              :page="products.current_page"
              :pages="products.pages"
              :limit="products.limit"
              @get="getProducts"
            />
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
  <ProductsEditModal
    @setloading="setloading"
    @get-products="getProducts"
    ref="editProduct"
  />
  <ProductsBarcodeModal @setloading="setloading" ref="productBarcode" />
</template>

<script>
import * as api from "../Api/api";
import * as util from "../../utils/utils";
import Pagination from "../Pagination/Pagination.vue";
import ProductsEditModal from "./ProductsEditModal.vue";
import ProductsBarcodeModal from "./ProductsBarcodeModal.vue";
export default {
  name: "ProductsTable",
  components: { Pagination, ProductsEditModal, ProductsBarcodeModal },
  props: {
    type: { type: String, required: true },
    tableHeight: { type: String, default: "50vh" },
    edit: { default: false },
    barcode: { default: false },
  },
  emits: ["setloading"],
  data() {
    return {
      util,
      _: Intl.NumberFormat(),
      branch_id: localStorage["branch_id"],
      products: {
        current_page: 0,
        pages: 1,
        limit: 25,
        data: [],
      },
    };
  },
  computed: {
    status() {
      return this.$props.type;
    },
    height() {
      return this.$props.tableHeight;
    },
    editable() {
      return this.$props.edit;
    },
    show_barcode() {
      return this.$props.barcode;
    },
  },
  created() {
    this.getProducts(0, 25);
  },
  methods: {
    setloading(loading) {
      this.$emit("setloading", loading);
    },
    getProducts(page, limit) {
      this.$emit("setloading", true);
      api
        .products("", this.status, this.branch_id, page, limit)
        .then((Response) => {
          this.products = Response.data;
          this.$emit("setloading", false);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          api.catchError(error);
        });
    },
  },
};
</script>

<style scoped>
.responsive-y {
  max-height: v-bind(height);
}

caption {
  display: table-caption;
  width: 100%;
}
</style>
