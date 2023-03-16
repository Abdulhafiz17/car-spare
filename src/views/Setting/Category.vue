<template>
  <div class="responsive-y" style="max-height: 66vh">
    <div class="row">
      <div class="col-md-12">
        <h5>Kategoriyalar</h5>
        <p>
          Yangi kategoriya qo'shish yoki mavjud kategoriya ma'lumotini
          tahrirlash
        </p>
      </div>
      <div class="col-md-12">
        <div class="row gap-2">
          <div class="col-md-12">
            <form @submit.prevent="postCategory(new_category)">
              <div class="input-group input-group-sm">
                <input
                  type="text"
                  class="form-control text-center"
                  placeholder="nomi"
                  required
                  v-model="new_category.name"
                />
                <div class="input-group-append">
                  <button class="btn btn-sm btn-outline-primary">
                    <i class="fa fa-plus" />
                  </button>
                </div>
              </div>
            </form>
          </div>
          <div class="col-md-12" v-for="item in categories" :key="item">
            <form @submit.prevent="putCategory(item)">
              <div class="input-group input-group-sm">
                <input
                  type="text"
                  class="form-control text-center"
                  placeholder="nomi"
                  required
                  v-model="item.name"
                />
                <div class="input-group-append">
                  <button class="btn btn-sm btn-outline-primary">
                    <i class="fa fa-check" />
                  </button>
                </div>
              </div>
            </form>
          </div>
          <div class="col-md-12 text-center">
            <Pagination
              :page="page"
              :pages="pages"
              :limit="limit"
              @get="getCategories"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  catchError,
  categories,
  createCategory,
  success,
  updateCategory,
} from "@/components/Api/api";
import Pagination from "../../components/Pagination/Pagination.vue";
export default {
  name: "Category",
  emits: ["setloading"],
  components: { Pagination },
  data() {
    return {
      new_category: {
        name: null,
        percent: 0,
        type: "",
      },
      page: 0,
      pages: 1,
      limit: 25,
      categories: [],
    };
  },
  created() {
    this.getCategories(0, 25);
  },
  methods: {
    postCategory(category) {
      this.$emit("setloading", true);
      createCategory(category)
        .then((Response) => {
          success().then(() => {
            this.new_category = {
              name: null,
              percent: 0,
              type: "",
            };
            this.getCategories(0, 25);
          });
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getCategories(page, limit) {
      this.$emit("setloading", true);
      categories("", page, limit)
        .then((Response) => {
          this.page = Response.data.current_page;
          this.pages = Response.data.pages;
          this.limit = Response.data.limit;
          this.categories = Response.data.data;
          this.$emit("setloading", false);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    putCategory(category) {
      this.$emit("setloading", true);
      updateCategory(category)
        .then((Response) => {
          success().then(() => {
            this.getCategories(0, 25);
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
