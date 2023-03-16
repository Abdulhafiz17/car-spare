<template>
  <div class="modal fade" id="showcase">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h4>Vitrinalar</h4>
        </div>
        <div class="modal-body">
          <form @submit.prevent="postShowcase(new_location)">
            <div class="row text-left">
              <label class="col-md-12">
                Yangi vitrina
                <div class="input-group input-group-sm mt-1">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="vitrina nomi"
                    required
                    v-model="new_location.name"
                  />
                  <div class="input-group-append">
                    <button class="btn btn-outline-success">
                      <i class="fa fa-plus" />
                    </button>
                  </div>
                </div>
              </label>
            </div>
          </form>
        </div>
        <div class="modal-body">
          <label class="my-1 w-100 text-left">Mavjud vitrinalar</label>
          <div class="responsive-y" style="max-height: 45vh">
            <div class="row gap-2">
              <div class="col-md-12" v-for="item in locations" :key="item">
                <form @submit.prevent="putShowcase(item)">
                  <div class="input-group input-group-sm">
                    <input
                      type="text"
                      class="form-control"
                      placeholder="vitrina nomi"
                      required
                      v-model="item.name"
                    />
                    <div class="input-group-append">
                      <button class="btn btn-outline-warning">
                        <i class="fa fa-edit" />
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              <div class="col-md-12">
                <Pagination
                  :page="page"
                  :pages="pages"
                  :limit="limit"
                  @get="getLocations"
                />
              </div>
            </div>
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
import {
  catchError,
  createProductLocation,
  productLocations,
  success,
  updateProductLocation,
} from "@/components/Api/api";
import Pagination from "../../components/Pagination/Pagination.vue";
export default {
  name: "ModalShowcase",
  emits: ["setloading"],
  components: { Pagination },
  data() {
    return {
      new_location: {
        name: null,
      },
      page: 0,
      pages: 1,
      limit: 25,
      locations: [],
    };
  },
  created() {
    this.getLocations(0, 25);
  },
  methods: {
    getLocations(page, limit, status) {
      productLocations(page, limit)
        .then((Response) => {
          this.page = Response.data.current_page;
          this.pages = Response.data.pages;
          this.limit = Response.data.limit;
          this.locations = Response.data.data;
          status ? this.$emit("setloading", false) : false;
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    postShowcase(location) {
      this.$emit("setloading", true);
      createProductLocation(location)
        .then((Response) => {
          success().then(() => {
            this.new_location.name = null;
            this.getLocations(0, 25, true);
          });
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    putShowcase(location) {
      this.$emit("setloading", true);
      updateProductLocation(location)
        .then((Response) => {
          success().then(() => {
            this.$emit("setloading", false);
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
