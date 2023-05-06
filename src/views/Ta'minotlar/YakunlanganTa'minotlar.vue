<template>
  <div class="responsive-y" style="max-height: 75vh">
    <table class="table table-sm table-hover">
      <thead>
        <tr>
          <th>Kategoriya</th>
          <th>Artikul</th>
          <th>O'lcham</th>
          <th>Hajm</th>
          <th>Narx</th>
          <th>Ombor</th>
          <th>Sana</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in transfers" :key="item">
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
            {{
              $util.currency(item.Transfers.quantity) +
              (item.Warehouse_products.boyi ? " dona" : " metr")
            }}
          </td>
          <td>
            {{
              $util.currency(item.Transfers.transfer_price) +
              " " +
              item.Currencies.currency
            }}
          </td>
          <td>{{ item.warehouse }}</td>
          <td>{{ item.Transfers.time.replace("T", " ").substring(0, 16) }}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="7">
            <Pagination
              :page="page"
              :pages="pages"
              :limit="limit"
              @get="getTransfers"
            />
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script>
import Pagination from "../../components/Pagination/Pagination.vue";
import * as api from "../../components/Api/api";
export default {
  name: "Closed",
  emits: ["setloading"],
  components: { Pagination },
  data() {
    return {
      _: Intl.NumberFormat(),
      branch_id: localStorage.getItem("branch_id"),
      page: 0,
      pages: 1,
      limit: 25,
      transfers: [],
    };
  },
  created() {
    this.getTransfers(0, 25);
  },
  methods: {
    getTransfers(page, limit) {
      this.$emit("setloading", true);
      api
        .transfers(
          0,
          "filialga_berish_tasdiqlandi",
          this.branch_id,
          "",
          "",
          page,
          limit
        )
        .then((Response) => {
          this.page = Response.data.current_page;
          this.pages = Response.data.pages;
          this.limit = Response.data.limit;
          this.transfers = Response.data.data;
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
