<template>
  <div class="modal fade" id="confirm">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h4>Mahsulot qabul qilish</h4>
        </div>
        <form @submit.prevent="postAccept(accept)">
          <div class="modal-body">
            <div class="row gap-2">
              <div class="col-md-12">
                <ul class="list-group">
                  <li class="list-group-item">
                    <span>{{ "Kategoriya:" }}</span>
                    <span> {{ product?.Categories.name }}</span>
                  </li>
                  <li class="list-group-item">
                    <span>{{ "Artikul:" }}</span>
                    <span> {{ product?.Warehouse_products.articul }}</span>
                  </li>
                  <li class="list-group-item">
                    <span>{{ "O'lcham:" }}</span>
                    <span>
                      {{
                        product?.Warehouse_products.eni +
                        (product?.Warehouse_products.boyi
                          ? " x " + product?.Warehouse_products.boyi
                          : " metr")
                      }}</span
                    >
                  </li>
                  <li class="list-group-item">
                    <span>{{ "Hajm:" }}</span>
                    <span>
                      {{
                        $util.currency(product?.sum_quantity) +
                        (product?.Warehouse_products.boyi ? " dona" : " metr")
                      }}</span
                    >
                  </li>
                  <li class="list-group-item">
                    <span>{{ "Narx:" }}</span>
                    <span>
                      {{
                        $util.currency(product?.Transfers.transfer_price) +
                        " " +
                        product?.Currencies.currency
                      }}</span
                    >
                  </li>
                </ul>
              </div>
              <div class="col-md-12">
                <div class="input-group input-group-sm">
                  <input
                    type="number"
                    min="0"
                    step="any"
                    class="form-control"
                    placeholder="oxirgi narx"
                    required
                    v-model="accept.oxirgi_narx"
                  />
                  <div class="input-group-append">
                    <select
                      class="form-select form-select-sm"
                      required
                      v-model="accept.oxirgi_currency_id"
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
                </div>
              </div>
              <div class="col-md-12">
                <div class="input-group input-group-sm">
                  <input
                    type="number"
                    min="0"
                    step="any"
                    class="form-control"
                    placeholder="sotuv narx"
                    required
                    v-model="accept.sotuv_narx"
                  />
                  <div class="input-group-append">
                    <select
                      class="form-select form-select-sm"
                      required
                      v-model="accept.sotuv_currency_id"
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
                </div>
              </div>
              <div class="col-md-12">
                <div class="input-group input-group-sm">
                  <input
                    type="number"
                    min="0"
                    step="any"
                    class="form-control"
                    placeholder="vitrina narx"
                    required
                    v-model="accept.vitrina_narx"
                  />
                  <div class="input-group-append">
                    <select
                      class="form-select form-select-sm"
                      required
                      v-model="accept.vitrina_currency_id"
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
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline-primary">
              <i class="far fa-circle-check" />
            </button>
            <button
              class="btn btn-outline-danger"
              data-dismiss="modal"
              close-accept-transfer
            >
              <i class="far fa-circle-xmark" />
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import {
  acceptTransfer,
  catchError,
  currencies,
  success,
} from "@/components/Api/api";
export default {
  name: "ConfirmTransfer",
  props: ["transfer_product", "transfer_id"],
  emits: ["setloading", "getTransfers"],
  data() {
    return {
      _: Intl.NumberFormat(),
      currencies: [],
      accept: {
        vitrina_narx: null,
        vitrina_currency_id: "",
        sotuv_narx: null,
        sotuv_currency_id: "",
        oxirgi_narx: null,
        oxirgi_currency_id: "",
        pr_loc_id: 0,
      },
    };
  },
  computed: {
    id() {
      return this.$props.transfer_id;
    },
    product() {
      return this.$props.transfer_product;
    },
  },
  watch: {
    id() {
      this.accept = {
        vitrina_narx: null,
        vitrina_currency_id: "",
        sotuv_narx: null,
        sotuv_currency_id: "",
        oxirgi_narx: null,
        oxirgi_currency_id: "",
        pr_loc_id: 0,
      };
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
    postAccept(accept) {
      this.$emit("setloading", true);
      acceptTransfer(this.id, accept)
        .then((Response) => {
          success("close-accept-transfer").then(() => {
            this.accept = {
              vitrina_narx: null,
              vitrina_currency_id: "",
              sotuv_narx: null,
              sotuv_currency_id: "",
              oxirgi_narx: null,
              oxirgi_currency_id: "",
              pr_loc_id: 0,
            };
            this.$emit("getTransfers", 0, 25);
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
