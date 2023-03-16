<template>
  <h3>Ta'minotlar</h3>
  <div class="row">
    <div class="col-md-4">
      <button class="btn btn-sm btn-outline-primary" @click="addParty()">
        <i class="fa fa-plus" /> Ta'minot qo'shish
      </button>
    </div>
    <div class="col-md-4 my-1"></div>
    <div class="col-md-4"></div>
  </div>

  <hr />

  <div class="row">
    <div class="col-md-6">
      <h5>Faol</h5>
      <div class="responsive-y" style="max-height: 73vh">
        <ul class="list-group">
          <button
            class="list-group-item"
            v-for="item in parties_active"
            :key="item"
            @click="router(item.id, item.status)"
          >
            <span>
              <strong>Id: </strong>
              {{ item.id }}
            </span>
            <span>
              <strong>Sana: </strong>
              {{ item.time }}
            </span>
          </button>
        </ul>
        <div class="d-felx justify-content-center">
          <Pagination
            :page="page"
            :pages="pages"
            :limit="limit"
            @get="getPartiesActive"
          />
        </div>
      </div>
    </div>

    <div class="col-md-6">
      <h5>Yakunlangan</h5>
      <div class="responsive-y" style="max-height: 73vh">
        <ul class="list-group">
          <button
            class="list-group-item"
            v-for="item in parties_closed"
            :key="item"
            @click="router(item.id, item.status)"
          >
            <span>
              <strong>Id: </strong>
              {{ item.id }}
            </span>
            <span>
              <strong>Sana: </strong>
              {{ item.time }}
            </span>
          </button>
        </ul>
        <div class="d-felx justify-content-center">
          <Pagination
            :page="page_1"
            :pages="pages_1"
            :limit="limit_1"
            @get="getPartiesClosed"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  catchError,
  createParty,
  parties,
  success,
} from "@/components/Api/api";
import Pagination from "../../components/Pagination/Pagination.vue";
export default {
  name: "Ta'minotlar",
  emits: ["setloading"],
  components: { Pagination },
  data() {
    return {
      page: 0,
      pages: 1,
      limit: 25,
      page_1: 0,
      pages_1: 1,
      limit_1: 25,
      parties_active: [],
      parties_closed: [],
    };
  },
  created() {
    this.getPartiesActive(0, 25);
    this.getPartiesClosed(0, 25);
  },
  methods: {
    getPartiesActive(page, limit) {
      this.$emit("setloading", true);
      parties("false", page, limit)
        .then((Response) => {
          this.page = Response.data.current_page;
          this.pages = Response.data.pages;
          this.limit = Response.data.limit;
          this.parties_active = Response.data.data;
          this.$emit("setloading", false);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getPartiesClosed(page, limit) {
      this.$emit("setloading", true);
      parties("true", page, limit)
        .then((Response) => {
          this.page_1 = Response.data.current_page;
          this.pages_1 = Response.data.pages;
          this.limit_1 = Response.data.limit;
          this.parties_closed = Response.data.data;
          this.$emit("setloading", false);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    router(id, status) {
      localStorage.setItem("supply_status", status);
      this.$router.push(`/taminot/${id}`);
    },
    addParty() {
      this.$emit("setloading", true);
      createParty()
        .then((Response) => {
          success().then(() => {
            this.getPartiesActive(0, 25);
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
