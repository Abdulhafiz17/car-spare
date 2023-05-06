<template>
  <h3><i class="fa fa-box" /> Mahsulotlar qoldig'ini qayta ko'rib chiqish</h3>
  <div class="row">
    <div class="col-md-6">
      <div class="btn-group btn-group-sm">
        <button
          class="btn btn-outline-success"
          :disabled="products_waiting.length || products_counted.length"
          @click="openControl()"
        >
          <i class="fa fa-plus"></i> Tekshiruv qo'shish
        </button>
        <button
          class="btn btn-outline-danger"
          :disabled="!products_waiting.length || products_counted.length"
          @click="cancelControl()"
        >
          <i class="fa fa-ban"></i> Tekshiruvni yakunlash
        </button>
        <button
          class="btn btn-outline-primary"
          :disabled="
            products_waiting.length
              ? true
              : products_counted.length
              ? false
              : true
          "
          @click="submitControl()"
        >
          <i class="fa fa-check"></i> Tekshiruvni tasdiqlash
        </button>
      </div>
    </div>
    <div class="col-md-3 my-1"></div>
    <div class="col-md-3">
      <button
        class="btn btn-sm btn-outline-secondary"
        data-toggle="modal"
        data-target="#controls"
        @click="getControls(0, 25)"
      >
        <i class="fa fa-history"></i> Tekshiruvlar tarixi
      </button>
    </div>
  </div>
  <hr />

  <tabs
    :tab_buttons="[`Jarayon`, `Tasdiqlash`]"
    :tab_slots="[`action`, `confirm`]"
  >
    <template #action>
      <div class="row">
        <div class="col-md-6">
          <h5>Sanalmagan</h5>
          <form @submit.prevent="getProductsWaiting(0, 25)">
            <div class="input-group input-group-sm">
              <input
                type="search"
                class="form-control"
                placeholder="Qidiruv"
                v-model="code"
                @focusout="code ? false : getProductsWaiting(0, 25)"
              />
              <div class="input-group-text">
                <i class="fa fa-barcode" />
              </div>
            </div>
          </form>
          <div class="responsive-y" style="max-height: 62vh">
            <table class="table table-sm table-hover">
              <thead>
                <tr>
                  <th>Mahsulot - Artikul - Marka - Code</th>
                  <th>Hajm</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in products_waiting" :key="item">
                  <td>
                    {{
                      item.category +
                      " - " +
                      item.product_type_name +
                      " - " +
                      item.product_type_name +
                      " - " +
                      item.code
                    }}
                  </td>
                  <td>
                    <form @submit.prevent="putProduct(item)">
                      <div class="input-group input-group-sm">
                        <input
                          class="form-control"
                          type="number"
                          step="any"
                          min="0"
                          placeholder="miqdor"
                          required
                          v-model="item.real_quantity"
                          @click="
                            item.real_quantity = item.real_quantity
                              ? item.real_quantity
                              : null
                          "
                          @focusout="
                            item.real_quantity = item.real_quantity
                              ? item.real_quantity
                              : 0
                          "
                        />
                        <div class="input-group-text">dona</div>
                        <div class="input-group-append">
                          <button class="btn btn-outline-info">
                            <i class="fa fa-share"></i>
                          </button>
                        </div>
                      </div>
                    </form>
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="2">
                    <Pagination
                      :page="page"
                      :pages="pages"
                      :limit="limit"
                      @get="getProductsWaiting"
                    />
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div class="col-md-6">
          <h5>Sanalgan</h5>
          <form @submit.prevent="getProductsCounted(0, 25)">
            <div class="input-group input-group-sm">
              <input
                type="search"
                class="form-control"
                placeholder="Qidiruv"
                v-model="code_1"
                @focusout="code_1 ? false : getProductsCounted(0, 25)"
              />
              <div class="input-group-text">
                <i class="fa fa-barcode" />
              </div>
            </div>
          </form>
          <div class="responsive-y" style="max-height: 62vh">
            <table class="table table-sm table-hover">
              <thead>
                <tr>
                  <th>Mahsulot - Artikul - Marka - Code</th>
                  <th>Hajm</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in products_counted" :key="item">
                  <td>
                    {{
                      item.category +
                      " - " +
                      item.product_type_name +
                      " - " +
                      item.product_type_name +
                      " - " +
                      item.code
                    }}
                  </td>
                  <td>
                    <form
                      @submit.prevent="
                        putProduct(item);
                        item.edit = false;
                      "
                    >
                      <div class="input-group input-group-sm">
                        <input
                          class="form-control"
                          type="number"
                          step="any"
                          min="0"
                          placeholder="miqdor"
                          required
                          v-model="item.real_quantity"
                          :readonly="!item.edit"
                          @dblclick="item.edit = true"
                        />
                        <div class="input-group-text">dona</div>
                        <div class="input-group-append" v-if="item.edit">
                          <button class="btn btn-outline-warning">
                            <i class="far fa-edit"></i>
                          </button>
                        </div>
                      </div>
                    </form>
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="4">
                    <Pagination
                      :page="page_1"
                      :pages="pages_1"
                      :limit="limit_1"
                      @get="getProductsCounted"
                    />
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </template>
    <template #confirm>
      <div class="row">
        <div class="col-md-12">
          <h5>Farqli</h5>
          <form @submit.prevent="getProductsNotEqual(0, 25)">
            <div class="input-group input-group-sm">
              <input
                type="search"
                class="form-control"
                placeholder="Qidiruv"
                v-model="code_2"
                @focusout="code_2 ? false : getProductsNotEqual(0, 25)"
              />
              <div class="input-group-text">
                <i class="fa fa-barcode" />
              </div>
            </div>
          </form>
          <div class="responsive-y" style="max-height: 62vh">
            <table class="table table-sm table-hover">
              <thead>
                <tr>
                  <th>Mahsulot - Artikul - Marka - Code</th>
                  <th>Real hajm</th>
                  <th>Tizimdagi hajm</th>
                  <th>Farq</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in products_not_equal" :key="item">
                  <td>
                    {{
                      item.category +
                      " - " +
                      item.product_type_name +
                      " - " +
                      item.product_type_name +
                      " - " +
                      item.code
                    }}
                  </td>
                  <td>
                    <!-- <form @submit.prevent="putProduct(item)">
                        <div class="input-group input-group-sm">
                          <input
                            class="form-control"
                            type="number"
                            step="any"
                            min="0"
                            placeholder="miqdor"
                            required
                            v-model="item.real_quantity"
                            @click="
                              item.real_quantity = item.real_quantity
                                ? item.real_quantity
                                : null
                            "
                            @focusout="
                              item.real_quantity = item.real_quantity
                                ? item.real_quantity
                                : 0
                            "
                          />
                          <div class="input-group-text">dona</div>
                          <div class="input-group-append">
                            <button class="btn btn-outline-info">
                              <i class="fa fa-share"></i>
                            </button>
                          </div>
                        </div>
                      </form> -->
                    <form
                      @submit.prevent="
                        putProduct(item);
                        item.edit = false;
                      "
                    >
                      <div class="input-group input-group-sm">
                        <input
                          class="form-control"
                          type="number"
                          step="any"
                          min="0"
                          placeholder="miqdor"
                          required
                          v-model="item.real_quantity"
                          :readonly="!item.edit"
                          @dblclick="item.edit = true"
                        />
                        <div class="input-group-text">dona</div>
                        <div class="input-group-append" v-if="item.edit">
                          <button class="btn btn-outline-warning">
                            <i class="far fa-edit"></i>
                          </button>
                        </div>
                      </div>
                    </form>
                  </td>
                  <td>{{ `${$util.currency(item.quantity)} dona` }}</td>
                  <td
                    :class="
                      item.real_quantity - item.quantity > 0
                        ? 'text-warning'
                        : item.real_quantity - item.quantity < 0
                        ? 'text-danger'
                        : ''
                    "
                    v-if="item.real_quantity - item.quantity !== 0"
                  >
                    {{ `${$util.currency(item.real_quantity - item.quantity)} dona` }}
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="4">
                    <Pagination
                      :page="page_2"
                      :pages="pages_2"
                      :limit="limit_2"
                      @get="getProductsNotEqual"
                    />
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </template>
  </tabs>

  <div class="modal fade" id="controls">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h4>Mahsulot tekshiruvlari tarixi</h4>
        </div>
        <div class="modal-body">
          <div class="responsive-y" style="max-height: 60vh">
            <ul class="list-group">
              <li
                class="list-group-item"
                v-for="item in controls.data"
                :key="item"
              >
                {{ item.time.replace("T", " ") }}
              </li>
            </ul>
            <Pagination
              :page="controls.current_page"
              :pages="controls.pages"
              :limit="controls.limit"
              @get="getControls"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline-danger" data-dismiss="modal">
            <i class="far fa-circle-xmark"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  catchError,
  changeControlProductQuantity,
  controlProducts,
  controls,
  createControl,
  removeControl,
  success,
  updateControlProduct,
} from "@/components/Api/api";
import Pagination from "../../components/Pagination/Pagination.vue";
export default {
  name: "Revision",
  emits: ["setloading"],
  components: { Pagination },
  data() {
    return {
      template: "action",
      control_id: 0,
      controls: [],
      code: null,
      page: 0,
      pages: 1,
      limit: 25,
      code_1: null,
      page_1: 0,
      pages_1: 1,
      limit_1: 25,
      code_2: null,
      page_2: 0,
      pages_2: 1,
      limit_2: 25,
      products_waiting: [],
      products_counted: [],
      products_not_equal: [],
    };
  },
  created() {
    this.getProductsWaiting(0, 25);
    this.getProductsCounted(0, 25);
  },
  mounted() {
    document.querySelector("[name='action']").onclick = () => {
      this.getProductsWaiting(0, 25);
      this.getProductsCounted(0, 25);
      this.template = "action";
    };
    document.querySelector("[name='confirm']").onclick = () => {
      this.getProductsNotEqual(0, 25);
      this.template = "confirm";
    };
  },
  methods: {
    openControl() {
      this.$emit("setloading", true);
      createControl()
        .then((Response) => {
          success().then(() => {
            this.getProductsWaiting(0, 25);
            this.getProductsCounted(0, 25);
          });
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    cancelControl() {
      this.$emit("setloading", true);
      removeControl()
        .then((Response) => {
          success().then(() => {
            this.getProductsWaiting(0, 25);
            this.getProductsCounted(0, 25);
          });
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    submitControl() {
      this.$emit("setloading", true);
      changeControlProductQuantity()
        .then((Response) => {
          success().then(() => {
            if (this.template == "action") {
              this.getProductsWaiting(0, 25);
              this.getProductsCounted(0, 25);
            } else if (this.template == "confirm") {
              this.getProductsNotEqual(0, 25);
            }
          });
          this.$emit("setloading", false);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getControls(page, limit) {
      this.$emit("setloading", true);
      controls(this.$route.params.id, page, limit)
        .then((Response) => {
          console.log(Response.data);
          this.controls = Response.data;
          this.$emit("setloading", false);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getProductsWaiting(page, limit) {
      this.$emit("setloading", true);
      let code = this.code ? this.code : 0;
      controlProducts(0, "not_counted", code, page, limit)
        .then((Response) => {
          this.page = Response.data.current_page;
          this.pages = Response.data.pages;
          this.limit = Response.data.limit;
          this.products_waiting = Response.data.data;
          this.$emit("setloading", false);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getProductsCounted(page, limit) {
      this.$emit("setloading", true);
      let code = this.code_1 ? this.code_1 : 0;
      controlProducts(0, "counted", code, page, limit)
        .then((Response) => {
          this.page_1 = Response.data.current_page;
          this.pages_1 = Response.data.pages;
          this.limit_1 = Response.data.limit;
          this.products_counted = Response.data.data;
          if (this.products_counted.length) {
            this.products_counted.forEach((product) => {
              product.edit = false;
            });
          }
          this.$emit("setloading", false);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getProductsNotEqual(page, limit) {
      this.$emit("setloading", true);
      let code = this.code_2 ? this.code_2 : 0;
      controlProducts(0, "not_equal", code, page, limit)
        .then((Response) => {
          this.page_2 = Response.data.current_page;
          this.pages_2 = Response.data.pages;
          this.limit_2 = Response.data.limit;
          this.products_not_equal = Response.data.data;
          if (this.products_not_equal.length) {
            this.products_not_equal.forEach((product) => {
              product.edit = false;
            });
          }
          this.$emit("setloading", false);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    putProduct(product) {
      this.$emit("setloading", true);
      updateControlProduct(product)
        .then((Response) => {
          success().then(() => {
            if (this.template == "action") {
              this.getProductsWaiting(0, 25);
              this.getProductsCounted(0, 25);
            } else if (this.template == "confirm") {
              this.getProductsNotEqual(0, 25);
            }
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
