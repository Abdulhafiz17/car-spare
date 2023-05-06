<template>
  <div class="responsive-y" style="height: 74vh">
    <table class="table table-sm table-hover">
      <thead>
        <tr>
          <th>Partiya</th>
          <th>Kategoriya</th>
          <th>Nomi</th>
          <th>Marka</th>
          <th>Miqdor</th>
          <th>Narx</th>
          <th>Summa</th>
          <th>Sana</th>
          <th>
            <button
              class="btn btn-sm btn-outline-info"
              data-toggle="modal"
              data-target="#filter"
            >
              <i class="fa fa-filter" />
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in supplies.data" :key="item">
          <td>{{ item.Supplies.party_id }}</td>
          <td>{{ item.category }}</td>
          <td>{{ item.product_name }}</td>
          <td>{{ item.product_name2 }}</td>
          <td>
            {{
              $util.currency(item.Supplies.quantity) +
              " " +
              item.Supplies.olchov_birligi
            }}
          </td>
          <td>
            {{ $util.currency(item.Supplies.price) }}
            {{ item.currency }}
          </td>
          <td>
            {{ $util.currency(item.Supplies.price * item.Supplies.quantity) }}
            {{ item.currency }}
          </td>
          <td>
            {{
              item.Supplies.time
                .replace("T", " ")
                .substring(0, item.Supplies.time.length - 3)
            }}
          </td>
          <td></td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="8">
            <Pagination
              :page="supplies.current_page"
              :pages="supplies.pages"
              :limit="supplies.limit"
              @get="getSupplies"
            />
          </td>
        </tr>
      </tfoot>
    </table>
  </div>

  <modal id="filter" size="sm">
    <template #header>
      <h4>Qidiruv</h4>
    </template>
    <template #body>
      <div class="row gap-2">
        <div class="col-md-12">
          <div class="dropdown">
            <button
              id="dropdownMenuButtonCategories"
              type="button"
              class="btn btn-sm btn-block btn-outline-primary dropdown-toggle"
              data-toggle="dropdown"
              @click="getCategories(0, true)"
            >
              {{ filter.category ? filter.category.name : "Kategoriya" }}
            </button>
            <div
              class="dropdown-menu w-100 mt-1"
              aria-labelledby="dropdownMenuButtonCategories"
            >
              <input
                type="text"
                class="form-control form-control-sm"
                placeholder="qidiruv"
                v-model="categories_search"
                @keyup="getCategories(0, true)"
              />
              <div
                class="responsive-y categories-scroll"
                style="max-height: 20vh"
                @scroll="scrollCategories()"
              >
                <button
                  type="button"
                  class="dropdown-item"
                  v-for="item in categories.data"
                  :key="item"
                  @click="filter.category = item"
                >
                  {{ item.name }}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-12">
          <div class="dropdown">
            <button
              id="dropdownMenuButtonTypes"
              type="button"
              class="btn btn-sm btn-block btn-outline-primary dropdown-toggle"
              data-toggle="dropdown"
              @click="getProductTypes()"
            >
              {{
                filter.product_type
                  ? filter.product_type.name + " " + filter.product_type.name2
                  : "Mahsulot"
              }}
            </button>
            <div
              class="dropdown-menu w-100 mt-1"
              aria-labelledby="dropdownMenuButtonTypes"
            >
              <input
                type="text"
                class="form-control form-control-sm"
                placeholder="qidiruv"
                v-model="product_types_search"
                @keyup="getProductTypes()"
              />
              <div
                class="responsive-y types-scroll"
                style="max-height: 20vh"
                @scroll="scrollTypes()"
              >
                <button
                  type="button"
                  class="dropdown-item"
                  v-for="item in product_types.data"
                  :key="item"
                  @click="filter.product_type = item"
                >
                  {{ item.name + " " + item.name2 }}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-12">
          <div class="dropdown">
            <button
              id="dropdownMenuButtonMarkets"
              type="button"
              class="btn btn-sm btn-block btn-outline-primary dropdown-toggle"
              data-toggle="dropdown"
              @click="getParties(0, true)"
            >
              {{ filter.party ? filter.party.id : "Partiya" }}
            </button>
            <div
              class="dropdown-menu w-100 mt-1"
              aria-labelledby="dropdownMenuButtonMarkets"
            >
              <div
                class="responsive-y markets-scroll"
                style="max-height: 20vh"
                @scroll="scrollDown()"
              >
                <button
                  type="button"
                  class="dropdown-item"
                  v-for="item in parties.data"
                  :key="item"
                  @click="filter.party = item"
                >
                  {{ item.id }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <button
        class="btn btn-outline-primary"
        data-dismiss="modal"
        @click="getSupplies(0, 25)"
      >
        <i class="far fa-circle-check" />
      </button>
      <button
        class="btn btn-outline-danger"
        data-dismiss="modal"
        @click="getSupplies(0, 25, true)"
      >
        <i class="fa fa-trash" />
      </button>
    </template>
  </modal>
</template>

<script>
import {
  catchError,
  categories,
  parties,
  productTypes,
  supplies,
} from "@/components/Api/api";
import Pagination from "../../components/Pagination/Pagination.vue";
export default {
  name: "Supply",
  emits: ["setloading"],
  components: { Pagination },
  data() {
    return {
      party_page: 0,
      party_pages: 1,
      parties: [],
      page: 0,
      pages: 1,
      limit: 25,
      supplies: {
        current_page: null,
        pages: null,
        limit: null,
        data: [],
      },
      filter: {
        category: null,
        product_type: null,
        party: null,
      },
      categories_search: "",
      categories: {
        current_page: null,
        pages: null,
        limit: null,
        data: [],
      },
      product_types_search: "",
      product_types: {
        current_page: null,
        pages: null,
        limit: null,
        data: [],
      },
      parties: {
        current_page: null,
        pages: null,
        limit: null,
        data: [],
      },
      mounted: false,
    };
  },
  created() {
    this.getSupplies(0, 25);
  },
  methods: {
    getSupplies(page, limit, reset) {
      this.$emit("setloading", true);
      if (reset)
        this.filter = {
          category: null,
          product_type: null,
          party: null,
        };
      let category_id = this.filter.category ? this.filter.category.id : 0;
      let product_type_id = this.filter.product_type
        ? this.filter.product_type.id
        : 0;
      let party_id = this.filter.party ? this.filter.party.id : 0;
      supplies(
        category_id,
        product_type_id,
        this.$route.params.id,
        party_id,
        page,
        limit
      )
        .then((Response) => {
          this.supplies = Response.data;
          this.$emit("setloading", false);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getCategories(page, reset) {
      if (reset)
        this.categories = {
          current_page: null,
          pages: null,
          limit: null,
          data: [],
        };
      categories(this.categories_search, page, 25)
        .then((Response) => {
          this.categories = {
            current_page: Response.data.current_page,
            pages: Response.data.pages,
            limit: Response.data.limit,
            data: this.categories.data.concat(Response.data.data),
          };
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getProductTypes() {
      let category_id = this.filter.category ? this.filter.category.id : 0;
      productTypes(category_id, this.product_types_search, 0, 25)
        .then((Response) => {
          this.product_types = Response.data;
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getParties(page, reset) {
      if (reset)
        this.parties = {
          current_page: null,
          pages: null,
          limit: null,
          data: [],
        };
      parties(true, page, 25)
        .then((Response) => {
          this.parties = {
            current_page: Response.data.current_page,
            pages: Response.data.pages,
            limit: Response.data.limit,
            data: this.parties.data.concat(Response.data.data),
          };
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    scrollCategories() {
      let div = document.querySelector(".categories-scroll");
      if (div.scrollTop + div.clientHeight >= div.scrollHeight) {
        if (this.categories.current_page < this.categories.pages - 1) {
          this.getCategories(this.categories.current_page + 1);
        }
      }
    },
    scrollTypes() {
      let div = document.querySelector(".types-scroll");
      if (div.scrollTop + div.clientHeight >= div.scrollHeight) {
        if (this.product_types.current_page < this.product_types.pages - 1) {
          productTypes(
            this.product_types_search,
            this.product_types.current_page + 1,
            25
          )
            .then((Response) => {
              this.product_types = {
                current_page: Response.data.current_page,
                pages: Response.data.pages,
                limit: Response.data.limit,
                data: this.product_types.data.concat(Response.data.data),
              };
            })
            .catch((error) => {
              catchError(error);
            });
        }
      }
    },
    scrollDown() {
      let div = document.querySelector(".dropdown-scroll");
      if (div.scrollTop + div.clientHeight >= div.scrollHeight) {
        if (this.parties.current_page < this.parties.pages - 1) {
          this.getParties(this.parties.current_page + 1);
        }
      }
    },
  },
};
</script>
