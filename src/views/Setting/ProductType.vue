<template>
  <div class="responsive-y" style="height: 65vh">
    <div class="row">
      <div class="col-12" v-for="item in categories?.data" :key="item">
        <collapse
          @open="item.open = $event"
          @click="
            item.search = '';
            category = item;
            !item.open ? getProductTypes(0, 25) : false;
          "
        >
          <template #header>{{ item.name }}</template>
          <template #body>
            <input
              type="text"
              class="form-control form-control-sm mb-1"
              placeholder="qidiruv"
              v-model="item.search"
              @keyup="
                category = item;
                getProductTypes(0, 25);
              "
            />
            <div class="row gap-1">
              <div
                class="col-12"
                v-for="item1 in item.product_types?.data"
                :key="item"
              >
                <form @submit.prevent="putProductType(item1)">
                  <div class="input-group input-group-sm">
                    <input
                      type="text"
                      class="form-control"
                      placeholder="artikul"
                      required
                      v-model="item1.name"
                    />
                    <input
                      type="text"
                      class="form-control"
                      placeholder="marke"
                      required
                      v-model="item1.name2"
                    />
                    <div class="input-group-append">
                      <button class="btn btn-outline-warning">
                        <i class="far fa-edit"></i>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              <div class="col-12 text-center">
                <Pagination
                  :page="item.product_types?.current_page"
                  :pages="item.Product_types?.pages"
                  :limit="item.product_types?.limit"
                  @get="getProductTypes"
                />
              </div>
            </div>
          </template>
        </collapse>
      </div>
      <div class="col-12 text-center">
        <Pagination
          :page="categories?.current_page"
          :pages="categories?.pages"
          :limit="categories?.limit"
          @get="getCategories"
        />
      </div>
    </div>
  </div>
</template>

<script>
import * as api from "../../components/Api/api";
import Pagination from "../../components/Pagination/Pagination.vue";
export default {
  name: "ProductType",
  emits: ["setloading"],
  components: { Pagination },
  data() {
    return {
      categories: null,
      category: null,
    };
  },
  created() {
    this.getCategories(0, 25);
  },
  methods: {
    getCategories(page, limit, search) {
      this.$emit("setloading", true);
      api
        .categories(search, page, limit)
        .then((res) => {
          this.categories = res.data;
          this.categories.data.forEach((item) => {
            item.search = "";
          });
          this.$emit("setloading", false);
        })
        .catch((err) => {
          this.$emit("setloading", false);
          api.catchError(err);
        });
    },
    getProductTypes(page, limit) {
      this.$emit("setloading", true);
      api
        .productTypes(this.category.id, this.category.search, page, limit)
        .then((res) => {
          this.category.product_types = res.data;
          this.$emit("setloading", false);
        })
        .catch((err) => {
          this.$emit("setloading", false);
          api.catchError(err);
        });
    },
    putProductType(product_type) {
      this.$emit("setloading", true);
      api
        .updateProductType(product_type)
        .then((res) => {
          api.success().then(() => {
            this.$emit("setloading", false);
          });
        })
        .catch((err) => {
          this.$emit("setloading", false);
          api.catchError(err);
        });
    },
  },
};
</script>
