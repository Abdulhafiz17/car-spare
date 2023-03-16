<template>
  <div class="modal fade" id="history">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h4>Qaytarilgan mahsulotlar</h4>
        </div>
        <div class="modal-body">
          <div class="responsive-y" style="max-height: 65vh">
            <table class="table table-sm table-hover">
              <thead>
                <tr>
                  <th>Mahsulot</th>
                  <th>Hajm</th>
                  <th>Hodim</th>
                  <th>Sana</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in returned_products" :key="item">
                  <td>
                    {{
                      item.Returned_products?.trade?.product?.category?.name +
                      " - " +
                      item.Returned_products?.trade?.product?.product_type
                        ?.name +
                      " - " +
                      item.Returned_products?.trade?.product?.product_type
                        ?.name2
                    }}
                  </td>
                  <td>
                    {{
                      item.Returned_products?.quantity +
                      " " +
                      item.Returned_products?.trade?.product?.olchov_birligi
                    }}
                  </td>
                  <td>{{ item.user }}</td>
                  <td>
                    {{
                      item.Returned_products.time
                        .replace("T", " ")
                        .substring(0, 16)
                    }}
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="4">
                    <Pagination
                      :page="page"
                      :pages="pages"
                      :limit="limit"
                      @get="getReturnedProducts"
                    />
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline-danger" data-dismiss="modal">
            <i class="far fa-circle-xmark" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Pagination from "../../components/Pagination/Pagination.vue";
import { catchError, returnedProducts } from "@/components/Api/api";
export default {
  name: "ModalMahsulotlar",
  emits: ["setloading"],
  components: { Pagination },
  data() {
    return {
      order_id: 0,
      branch_id: localStorage.getItem("branch_id"),
      page: 0,
      pages: 1,
      limit: 25,
      returned_products: [],
    };
  },
  created() {},
  methods: {
    getReturnedProducts(page, limit) {
      this.$emit("setloading", true);
      returnedProducts(this.order_id, this.branch_id, page, limit)
        .then((Response) => {
          this.page = Response.data.current_page;
          this.pages = Response.data.pages;
          this.limit = Response.data.limit;
          this.returned_products = Response.data.data;
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
