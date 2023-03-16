<template>
  <div class="responsive-y" style="max-height: 74vh">
    <table class="table table-sm table-hover">
      <thead>
        <tr>
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
          <th>Miqdor</th>
          <th>Narx</th>
          <th>Tan narx</th>
          <th>Summa</th>
          <th>
            <button
              class="btn btn-sm btn-outline-secondary"
              data-toggle="modal"
              data-target="#addProduct"
            >
              <i class="fa fa-box"></i> Mahsulot qo'shish
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in products" :key="item">
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
              item.Warehouse_products.quantity +
              (item.Warehouse_products.boyi ? " dona" : " metr")
            }}
          </td>
          <td>
            {{ _.format(item.Warehouse_products.price) + " " + item.currency }}
          </td>
          <td>
            {{
              _.format(item.Warehouse_products.tan_narx) + " " + item.currency
            }}
          </td>
          <td>
            {{
              _.format(
                item.Warehouse_products.tan_narx *
                  item.Warehouse_products.quantity
              ) +
              " " +
              item.currency
            }}
          </td>
          <td>
            <div class="btn-group btn-group-sm">
              <button
                class="btn btn-outline-success"
                data-toggle="modal"
                data-target="#addPhoto"
                @click="
                  product = item;
                  getProductPhotos(item.Warehouse_products.articul);
                "
              >
                <i class="fa fa-image"></i>
              </button>
              <button
                class="btn btn-outline-danger"
                @click="removeProduct(item)"
                v-if="item.Warehouse_products.status == 'not_supply'"
              >
                <i class="far fa-circle-xmark"></i>
              </button>
            </div>
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
              @get="getWarehouseProducts"
            />
          </td>
        </tr>
      </tfoot>
    </table>
  </div>

  <div class="modal fade" id="addProduct">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h4>Yangi mahsulot qo'shish</h4>
        </div>
        <div class="modal-body">
          <form @submit.prevent="addProduct(add)">
            <div class="row my-1">
              <div class="col-md-3 mb-1">
                <select
                  class="form-select form-select-sm"
                  required
                  v-model="add.category_id"
                  @change="setCategory(add.category_id)"
                >
                  <option value="">kategoriya</option>
                  <option
                    v-for="item in categories"
                    :key="item"
                    :value="item.id"
                  >
                    {{ item.name }}
                  </option>
                </select>
              </div>
              <div class="col-md-3 mb-1">
                <input
                  type="text"
                  class="form-control form-control-sm"
                  placeholder="artikul"
                  required
                  v-model="add.articul"
                />
              </div>
              <div
                :class="`col-md-${
                  category && category.type == 'dona' ? 2 : 3
                } mb-1`"
              >
                <input
                  type="number"
                  step="any"
                  min="0"
                  class="form-control form-control-sm"
                  placeholder="eni"
                  required
                  v-model="add.eni"
                />
              </div>
              <div
                class="col-md-2 mb-1"
                v-if="category && category.type == 'dona'"
              >
                <input
                  type="number"
                  step="any"
                  min="0"
                  class="form-control form-control-sm"
                  placeholder="bo'yi"
                  required
                  v-model="add.boyi"
                />
              </div>
              <div
                :class="`col-md-${category && category.type == 'dona' ? 2 : 3}`"
              >
                <input
                  type="number"
                  step="any"
                  min="0"
                  class="form-control form-control-sm"
                  :placeholder="
                    category && category.type == 'dona' ? `miqdori` : `bo'yi`
                  "
                  required
                  v-model="add.quantity"
                />
              </div>
            </div>
            <div class="row my-1">
              <div class="col-md-4 mb-1">
                <div class="input-group input-group-sm">
                  <input
                    type="number"
                    step="any"
                    min="0"
                    :max="add.tan_narx ? add.tan_narx : false"
                    class="form-control"
                    placeholder="narx"
                    required
                    v-model="add.price"
                  />
                  <div class="input-group-append">
                    <select
                      class="form-select form-select-sm"
                      required
                      v-model="add.currency_id"
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
              <div class="col-md-4 mb-1">
                <div class="input-group input-group-sm">
                  <input
                    type="number"
                    step="any"
                    :min="add.price ? add.price : 0"
                    class="form-control"
                    placeholder="tan narx"
                    required
                    v-model="add.tan_narx"
                  />
                  <div class="input-group-append">
                    <select
                      class="form-select form-select-sm"
                      required
                      v-model="add.tan_narx_currency_id"
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
              <div class="col-md-4">
                <button class="btn btn-sm btn-block btn-outline-secondary">
                  <i class="fa fa-plus"></i> Ro'yxatga qo'shish
                </button>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-body" v-show="new_products.length">
          <div class="responsive-y my-1" style="max-height: 60vh">
            <table class="table table-sm table-hover">
              <thead>
                <tr>
                  <th>Kategoriya</th>
                  <th>Artikul</th>
                  <th>O'lcham</th>
                  <th>Hajm</th>
                  <th>Narx</th>
                  <th>Tan narx</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in new_products" :key="item">
                  <td>
                    {{
                      categories.find(
                        (category) => category.id == item.category_id
                      ).name
                    }}
                  </td>
                  <td>{{ item.articul }}</td>
                  <td>
                    {{ item.eni + (item.boyi ? " x " + item.boyi : " metr") }}
                  </td>
                  <td>{{ item.quantity + (item.boyi ? " dona" : " metr") }}</td>
                  <td>
                    {{
                      _.format(item.price) +
                      " " +
                      currencies.find(
                        (currency) => currency.id == item.currency_id
                      ).currency
                    }}
                  </td>
                  <td>
                    {{
                      _.format(item.tan_narx) +
                      " " +
                      currencies.find(
                        (currency) => currency.id == item.tan_narx_currency_id
                      ).currency
                    }}
                  </td>
                  <td>
                    <button
                      class="btn btn-sm btn-outline-danger"
                      @click="new_products.splice(index, 1)"
                    >
                      <i class="fa fa-trash"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="modal-footer">
          <button
            class="btn btn-outline-primary"
            :disabled="!new_products.length"
            @click="postNewProducts(new_products)"
          >
            <i class="far fa-circle-check"></i>
          </button>
          <button
            class="btn btn-outline-danger"
            data-dismiss="modal"
            close-adding-product
          >
            <i class="far fa-circle-xmark"></i>
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="modal fade" id="addPhoto">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header" v-if="product">
          <h4>
            {{
              product.Categories.name + " " + product.Warehouse_products.articul
            }}
          </h4>
        </div>
        <form @submit.prevent="uploadProductPhoto(product)">
          <div class="modal-body">
            <div class="input-group input-group-sm">
              <input type="file" class="form-control" product-photo />
              <button class="btn btn-sm btn-outline-primary">
                <i class="far fa-circle-check" />
              </button>
            </div>
            <div class="row">
              <div
                class="col-md-4 my-1"
                v-for="photo in product_photos"
                :key="photo"
              >
                <span
                  v-if="product && product_photos.length"
                  class="photo-viewer"
                >
                  <img
                    :src="url + photo.file"
                    :alt="photo.file"
                    data-toggle="modal"
                    data-target="#mainPhoto"
                    @click="main_photo = photo.file"
                  />
                  <i
                    class="fa fa-xmark fa-2x text-danger"
                    @click="removeProductPhoto(photo.id)"
                  />
                </span>
              </div>
              <div class="col-md-12 p-5" v-show="!product_photos.length">
                <h5>Ushbu mahsulotga rasm yuklanmagan</h5>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              class="btn btn-outline-danger"
              data-dismiss="modal"
              close-product-photos
            >
              <i class="far fa-circle-xmark" />
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <div class="modal fade" id="mainPhoto">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-body">
          <span v-if="main_photo" class="photo-viewer">
            <img :src="url + main_photo" :alt="main_photo" />
          </span>
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
import {
  addProductToWarehouse,
  catchError,
  categories,
  currencies,
  removeFile,
  removeWarehouseProduct,
  success,
  uploadedFiles,
  uploadFile,
  url,
  warehouseProducts,
} from "@/components/Api/api";
import Pagination from "../../components/Pagination/Pagination.vue";
import swal from "sweetalert";
export default {
  name: "Products",
  emits: ["setloading"],
  components: { Pagination },
  data() {
    return {
      url: url,
      _: Intl.NumberFormat(),
      page: 0,
      pages: 1,
      limit: 25,
      category_id: 0,
      category: null,
      categories: [],
      products: [],
      currencies: [],
      add: {
        category_id: "",
        articul: null,
        eni: null,
        boyi: null,
        quantity: null,
        price: null,
        currency_id: "",
        tan_narx: null,
        tan_narx_currency_id: "",
        warehouse_id: this.$route.params.id,
      },
      new_products: [],
      product: null,
      product_photos: [],
      main_photo: null,
    };
  },
  created() {
    this.$emit("setloading", true);
    this.getCategories();
  },
  mounted() {},
  methods: {
    getCategories() {
      categories("", "", 0, 1000)
        .then((Response) => {
          this.categories = Response.data.data;
          this.getCurrencies();
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getCurrencies() {
      currencies()
        .then((Response) => {
          this.currencies = Response.data;
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
          this.products = Response.data.data;
          this.$emit("setloading", false);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    setCategory(category_id) {
      if (category_id) {
        this.category = this.categories.find((category) => {
          return category.id == category_id;
        });
      }
    },
    addProduct(product) {
      this.new_products.push(product);
      this.add = {
        category_id: "",
        articul: null,
        eni: null,
        boyi: null,
        quantity: null,
        price: null,
        currency_id: "",
        tan_narx: null,
        tan_narx_currency_id: "",
        warehouse_id: this.$route.params.id,
      };
    },
    postNewProducts(products) {
      this.$emit("setloading", true);
      addProductToWarehouse(products)
        .then((Response) => {
          success("close-adding-product").then(() => {
            this.new_products = [];
            this.getWarehouseProducts(0, 25);
          });
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    uploadProductPhoto(product) {
      this.$emit("setloading", true);
      let file = document.querySelector("[product-photo]").files[0];
      let form_data = new FormData();
      form_data.append("file", file);
      uploadFile(product.Warehouse_products.articul, form_data)
        .then((Response) => {
          success().then(() => {
            document.querySelector("[product-photo]").value = null;
            this.getProductPhotos(this.product.Warehouse_products.articul);
          });
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    removeProductPhoto(id) {
      this.$emit("setloading", true);
      removeFile(id)
        .then((Response) => {
          success().then(() => {
            this.getProductPhotos(this.product.Warehouse_products.articul);
          });
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getProductPhotos(articul) {
      this.product_photos = [];
      uploadedFiles(articul, "product")
        .then((Response) => {
          this.product_photos = Response.data;
          this.$emit("setloading", false);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    removeProduct(product) {
      this.$emit("setloading", true);
      swal({
        icon: "warning",
        title: "Hajmni kiriting",
        dangerMode: true,
        closeOnEsc: false,
        closeOnClickOutside: false,
        content: {
          element: "input",
          attributes: {
            type: "number",
            step: "any",
            min: "0",
            class: "form-control form-control-sm",
            placeholder: "hajm",
          },
        },
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
          removeWarehouseProduct(product.Warehouse_products.id, value)
            .then((Response) => {
              success().then(() => {
                this.getWarehouseProducts(this.page, this.limit);
              });
            })
            .catch((error) => {
              this.$emit("setloading", false);
              catchError(error);
            });
        } else {
          this.$emit("setloading", false);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.modal-body .photo-viewer {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  border: 1px solid rgb(0, 0, 0, 0.2);
  cursor: pointer;
  transition: 0.3s all;
}
.modal-body .photo-viewer:hover {
  box-shadow: 0 1px 15px 5px rgb(0, 0, 0, 0.3);
}
.modal-body .photo-viewer img {
  width: 100%;
}

.photo-viewer .fa.fa-xmark {
  position: absolute;
  top: 0;
  right: 2%;
  transition: 0.2s;
}
.photo-viewer .fa.fa-xmark:hover {
  color: red !important;
}
</style>
