<template>
  <div class="row">
    <div class="col-md-11">
      <div class="dropdown">
        <button
          id="dropdownMenuButton"
          type="button"
          class="btn btn-sm btn-block btn-outline-primary dropdown-toggle"
          data-toggle="dropdown"
        >
          {{ branch ? branch.Branches.name : "Filial tanlang" }}
        </button>
        <div
          class="dropdown-menu w-100 mt-1"
          aria-labelledby="dropdownMenuButton"
        >
          <button
            type="button"
            class="dropdown-item"
            v-for="item in branches"
            :key="item"
            @click="branch = item"
          >
            {{ item.Branches.name }}
          </button>
        </div>
      </div>
    </div>
    <div class="col-md-1">
      <form
        @submit.prevent="postProductsToBranch(products_to_branch)"
        id="form"
      >
        <button
          class="btn btn-sm btn-block btn-outline-primary"
          :disabled="!branch || !products_to_branch.length"
        >
          <i class="far fa-circle-check" />
        </button>
      </form>
    </div>
  </div>
  <div class="responsive-y" style="max-height: 70vh">
    <table class="table table-sm table-hover">
      <thead>
        <tr>
          <th></th>
          <th>
            <select
              class="form-select form-select-sm"
              v-model="category_id"
              @change="getWarehouseProducts(0, 25)"
            >
              <option value="0">Kategoriya</option>
              <option v-for="item in categories" :key="item" :value="item.id">
                {{ item.name }}
              </option>
            </select>
          </th>
          <th>Artikul</th>
          <th>O'lcham</th>
          <th>Hajm</th>
          <th>Tan narx</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in warehouse_products"
          :key="item"
          :class="
            products_to_branch.find((product) => product == item)
              ? 'checked'
              : ''
          "
        >
          <td>
            <label class="w-100 h-100">
              <input
                type="checkbox"
                v-model="products_to_branch"
                :value="item"
              />
            </label>
          </td>
          <td>{{ item.Categories.name }}</td>
          <td>{{ item.Warehouse_products.articul }}</td>
          <td>
            {{
              item.Warehouse_products.eni +
              (item.Warehouse_products.boyi
                ? " x " + item.Warehouse_products.boyi
                : " metr")
            }}
          </td>
          <td>
            <div class="input-group input-group-sm w-75 mx-auto">
              <input
                form="form"
                type="number"
                class="form-control"
                min="0"
                :max="item.Warehouse_products.quantity"
                step="any"
                :placeholder="
                  item.Warehouse_products.quantity +
                  (item.Warehouse_products.boyi ? ' dona' : ' metr')
                "
                :required="
                  products_to_branch.find((product) => product == item)
                "
                v-model="item.quantity"
              />
              <div class="input-group-text">
                {{ item.Warehouse_products.boyi ? "dona" : "metr" }}
              </div>
            </div>
          </td>
          <td>
            {{
              $util.currency(item.Warehouse_products.tan_narx) +
              " " +
              item.currency
            }}
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="6">
            <Pagination
              :page="page"
              :pages="pages"
              :limit="limit"
              @get="getWarehouseProducts"
            />
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script>
import {
  branches,
  catchError,
  categories,
  success,
  transferProducts,
  warehouseProducts,
} from "@/components/Api/api";
import Pagination from "../../components/Pagination/Pagination.vue";
export default {
  name: "Transfer",
  emits: ["setloading"],
  components: { Pagination },
  data() {
    return {
      _: Intl.NumberFormat(),
      page: 0,
      pages: 1,
      limit: 25,
      branches: [],
      branch: null,
      categories: [],
      category_id: 0,
      warehouse_products: [],
      products_to_branch: [],
    };
  },
  created() {
    this.$emit("setloading", true);
    this.getBranches();
  },
  mounted() {},
  methods: {
    getBranches() {
      branches()
        .then((Response) => {
          this.branches = Response.data;
          this.getCategories();
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getCategories() {
      categories("", "", 0, 100)
        .then((Response) => {
          this.categories = Response.data.data;
          this.getWarehouseProducts(0, 25);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getWarehouseProducts(page, limit) {
      this.$emit("setloading", true);
      warehouseProducts(this.$route.params.id, this.category_id, page, limit)
        .then((Response) => {
          this.page = Response.data.current_page;
          this.pages = Response.data.pages;
          this.limit = Response.data.limit;
          this.warehouse_products = Response.data.data;
          this.warehouse_products.forEach((product) => {
            product.quantity = null;
          });
          this.$emit("setloading", false);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    postProductsToBranch(products) {
      this.$emit("setloading", true);
      let data = [];
      products.forEach((product, index) => {
        data.push({
          warehouse_pr_id: product.Warehouse_products.id,
          quantity: product.quantity,
          transfer_price: product.Warehouse_products.tan_narx,
          to_: this.branch.Branches.id,
        });
        if (index == products.length - 1) {
          transferProducts(data)
            .then((Response) => {
              success().then(() => {
                this.products_to_branch = [];
                this.branch = null;
                this.getWarehouseProducts(0, 25);
              });
            })
            .catch((error) => {
              this.$emit("setloading", false);
              catchError(error);
            });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.checked {
  background-color: rgb(13, 110, 253, 0.2);
}
.checked:hover {
  background-color: rgb(13, 110, 253, 0.2);
}
</style>
