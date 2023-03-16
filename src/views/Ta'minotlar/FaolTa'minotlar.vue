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
          <th></th>
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
              item.Transfers.quantity +
              (item.Warehouse_products.boyi ? " dona" : " metr")
            }}
          </td>
          <td>
            {{
              _.format(item.Transfers.transfer_price) +
              " " +
              item.Currencies.currency
            }}
          </td>
          <td>{{ item.warehouse }}</td>
          <td>{{ item.Transfers.time.replace("T", " ").substring(0, 16) }}</td>
          <td>
            <button
              class="btn btn-sm btn-outline-primary"
              data-toggle="modal"
              data-target="#confirm"
              @click="
                transfer_id = item.Transfers.id;
                transfer_product = item;
              "
            >
              <i class="fa fa-share" />
            </button>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="8">
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

  <ConfirmTransfer
    :transfer_id="transfer_id"
    :transfer_product="transfer_product"
    @setloading="setloading"
    @getTransfers="getTransfers"
  />
</template>

<script>
import { catchError, transfers } from "@/components/Api/api";
import Pagination from "../../components/Pagination/Pagination.vue";
import ConfirmTransfer from "./Ta'minotQabul.vue";
export default {
  name: "Active",
  emits: ["setloading"],
  components: { Pagination, ConfirmTransfer },
  data() {
    return {
      _: Intl.NumberFormat(),
      branch_id: localStorage.getItem("branch_id"),
      page: 0,
      pages: 1,
      limit: 25,
      transfers: [],
      transfer_product: null,
      transfer_id: null,
    };
  },
  created() {
    this.getTransfers(0, 25);
  },
  methods: {
    setloading(loading) {
      this.$emit("setloading", loading);
    },
    getTransfers(page, limit) {
      this.$emit("setloading", true);
      transfers(
        0,
        "filialga_berish_kutish",
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
          catchError(error);
        });
    },
  },
};
</script>
