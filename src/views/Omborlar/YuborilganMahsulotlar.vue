<template>
  <tabs
    :tab_buttons="[`Kutilayotgan`, `Qabul qilingan`]"
    :tab_slots="[`waiting`, `accepted`]"
  >
    <template #waiting>
      <div class="row">
        <div class="col-md-5">
          <input
            type="date"
            class="form-control form-control-sm"
            v-model="from_time"
          />
        </div>
        <div class="col-md-5">
          <input
            type="date"
            class="form-control form-control-sm"
            v-model="to_time"
          />
        </div>
        <div class="col-md-2">
          <button
            class="btn btn-sm btn-block btn-outline-secondary"
            @click="
              branch_id = 0;
              getTransfersWaiting(0, 25);
            "
          >
            <i class="fa fa-search" />
          </button>
        </div>
      </div>
      <div class="responsive-y" style="height: 63vh">
        <table class="table table-sm table-hover">
          <thead>
            <tr>
              <th>
                <select
                  class="form-select form-select-sm"
                  v-model="branch_id"
                  @change="getTransfersWaiting(0, 25)"
                >
                  <option value="0">Filial</option>
                  <option
                    v-for="item in branches"
                    :key="item"
                    :value="item.Branches.id"
                  >
                    {{ item.Branches.name }}
                  </option>
                </select>
              </th>
              <th>Kategoriya</th>
              <th>Artikul</th>
              <th>O'lcham</th>
              <th>Hajm</th>
              <th>Narx</th>
              <th>Summa</th>
              <th>Sana</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in transfers_waiting" :key="item">
              <td>{{ item.branche }}</td>
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
              <td>
                {{
                  _.format(
                    item.Transfers.transfer_price * item.Transfers.quantity
                  ) +
                  " " +
                  item.Currencies.currency
                }}
              </td>
              <td>
                {{ item.Transfers.time.replace("T", " ").substring(0, 16) }}
              </td>
              <td>
                <button
                  class="btn btn-sm btn-outline-danger"
                  @click="deleteTransfer(item.Transfers.id)"
                >
                  <i class="far fa-circle-xmark" />
                </button>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="9">
                <Pagination
                  :page="page"
                  :pages="pages"
                  :limit="limit"
                  @get="getTransfersWaiting"
                />
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </template>

    <template #accepted>
      <div class="row">
        <div class="col-md-5">
          <input
            type="date"
            class="form-control form-control-sm"
            v-model="from_time"
          />
        </div>
        <div class="col-md-5">
          <input
            type="date"
            class="form-control form-control-sm"
            v-model="to_time"
          />
        </div>
        <div class="col-md-2">
          <button
            class="btn btn-sm btn-block btn-outline-secondary"
            @click="
              branch_id = 0;
              getTransfersAccepted(0, 25);
            "
          >
            <i class="fa fa-search" />
          </button>
        </div>
      </div>
      <div class="responsive-y" style="height: 63vh">
        <table class="table table-sm table-hover">
          <thead>
            <tr>
              <th>
                <select
                  class="form-select form-select-sm"
                  v-model="branch_id"
                  @change="getTransfersAccepted(0, 25)"
                >
                  <option value="0">Filial</option>
                  <option
                    v-for="item in branches"
                    :key="item"
                    :value="item.Branches.id"
                  >
                    {{ item.Branches.name }}
                  </option>
                </select>
              </th>
              <th>Kategoriya</th>
              <th>Artikul</th>
              <th>O'lcham</th>
              <th>Hajm</th>
              <th>Narx</th>
              <th>Summa</th>
              <th>Sana</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in transfers_accepted" :key="item">
              <td>{{ item.branche }}</td>
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
              <td>
                {{
                  _.format(
                    item.Transfers.transfer_price * item.Transfers.quantity
                  ) +
                  " " +
                  item.Currencies.currency
                }}
              </td>
              <td>
                {{ item.Transfers.time.replace("T", " ").substring(0, 16) }}
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
                  @get="getTransfersAccepted"
                />
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </template>
  </tabs>
</template>

<script>
import {
  branches,
  catchError,
  removeTransfer,
  success,
  transfers,
} from "@/components/Api/api";
import Pagination from "../../components/Pagination/Pagination.vue";
import swal from "sweetalert";
export default {
  name: "Taminotlar",
  emits: ["setloading"],
  components: { Pagination },
  data() {
    return {
      _: Intl.NumberFormat(),
      page: 0,
      pages: 1,
      limit: 25,
      from_time: "",
      to_time: "",
      branch_id: 0,
      branches: [],
      transfers_waiting: [],
      transfers_accepted: [],
    };
  },
  created() {
    this.$emit("setloading", true);
    this.getBranches();
  },
  mounted() {
    document.querySelector("[name=waiting]").onclick = () => {
      this.from_time = "";
      this.to_time = "";
      this.branch_id = 0;
      this.getTransfersWaiting(0, 25);
    };
    document.querySelector("[name=accepted]").onclick = () => {
      this.from_time = "";
      this.to_time = "";
      this.branch_id = 0;
      this.getTransfersAccepted(0, 25);
    };
  },
  methods: {
    getBranches() {
      branches()
        .then((Response) => {
          this.branches = Response.data;
          this.getTransfersWaiting(0, 25);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getTransfersWaiting(page, limit) {
      this.$emit("setloading", true);
      transfers(
        this.$route.params.id,
        "filialga_berish_kutish",
        this.branch_id,
        this.from_time,
        this.to_time,
        page,
        limit
      )
        .then((Response) => {
          this.page = Response.data.current_page;
          this.pages = Response.data.pages;
          this.limit = Response.data.limit;
          this.transfers_waiting = Response.data.data;
          this.$emit("setloading", false);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getTransfersAccepted(page, limit) {
      this.$emit("setloading", true);
      transfers(
        this.$route.params.id,
        "filialga_berish_tasdiqlandi",
        this.branch_id,
        this.from_time,
        this.to_time,
        page,
        limit
      )
        .then((Response) => {
          this.page = Response.data.current_page;
          this.pages = Response.data.pages;
          this.limit = Response.data.limit;
          this.transfers_accepted = Response.data.data;
          this.$emit("setloading", false);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    deleteTransfer(id) {
      this.$emit("setloading", true);
      swal({
        icon: "error",
        title: "Mahsulotlar o'chirilsinmi ?",
        text: "Ushbu amalni ortga qaytarib bo'lmaydi !",
        closeOnEsc: false,
        closeOnClickOutside: false,
        dangerMode: true,
        buttons: {
          confirm: {
            visible: true,
            text: "Ok",
            value: true,
          },
          cancel: {
            visible: true,
            text: "Bekor qilish",
            value: false,
          },
        },
      }).then((value) => {
        if (value) {
          removeTransfer(id).then((Response) => {
            success().then(() => {
              this.getTransfersWaiting(0, 25);
            });
          });
        } else {
          this.$emit("setloading", false);
        }
      });
    },
  },
};
</script>
