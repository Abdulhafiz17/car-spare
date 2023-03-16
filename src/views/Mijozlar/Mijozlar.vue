<template>
  <h3>Mijozlar</h3>
  <div class="row">
    <div class="col-md-4">
      <div class="input-group input-group-sm">
        <input
          class="form-control"
          type="search"
          placeholder="Qidiruv"
          v-model="search"
          @keyup="
            get(0, 25);
            $emit('setloading', false);
          "
        />
        <div class="input-group-text">
          <i class="fa fa-search" />
        </div>
      </div>
    </div>
    <div class="col-md-4 my-1"></div>
    <div class="col-md-4"></div>
  </div>
  <hr />

  <div class="body">
    <div class="responsive-y" style="max-height: 78vh">
      <div class="row">
        <div class="col-md-4 my-1" v-for="(item, idx) in mijozlar" :key="item">
          <div class="card shadow">
            <div class="card-body">
              <collapse>
                <template #header>
                  <span class="fa fa-user" />
                  <span>{{ item.name }}</span>
                </template>
                <template #body>
                  <div class="details-body">
                    <ul class="list-group">
                      <a
                        class="list-group-item"
                        :href="'tel:+998' + item.phone"
                      >
                        <i class="fa fa-phone" />
                        <span>+998 {{ format(item.phone) }}</span>
                      </a>
                      <li class="list-group-item">
                        <i class="fa fa-user-tag" />
                        <span> {{ item.type }} </span>
                      </li>
                    </ul>
                  </div>
                </template>
              </collapse>
              <div class="row my-1 gap-1">
                <div class="col">
                  <router-link
                    :to="`/mijoz/${item.id}`"
                    class="btn btn-sm btn-block btn-outline-info"
                  >
                    <span class="fa fa-info" />
                  </router-link>
                </div>
                <div class="col">
                  <button
                    class="btn btn-sm btn-block btn-outline-warning"
                    data-toggle="modal"
                    data-target="#editMijoz"
                    @click="editMijoz = item"
                  >
                    <span class="fas fa-edit" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Pagination :page="page" :pages="pages" :limit="limit" @get="get" />
    </div>
  </div>

  <div class="modal fade" id="editMijoz">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h4>{{ editMijoz.name }} ma'lumotlarini tahrirlash</h4>
        </div>
        <form @submit.prevent="put(editMijoz)">
          <div class="modal-body">
            <div class="row gap-2 text-left">
              <div class="col-md-12">
                Ism
                <input
                  class="form-control form-control-sm"
                  type="text"
                  placeholder="ism"
                  required
                  v-model="editMijoz.name"
                />
              </div>
              <div class="col-md-12">
                Telefon raqam
                <div class="input-group input-group-sm">
                  <div class="input-group-prepend">
                    <div class="input-group-text">+998</div>
                  </div>
                  <input
                    class="form-control"
                    type="tel"
                    minlength="9"
                    maxlength="9"
                    placeholder="tel"
                    required
                    v-model="editMijoz.phone"
                  />
                </div>
              </div>
              <div class="col-md-12">
                Toifa
                <select
                  class="form-select form-select-sm"
                  v-model="editMijoz.type"
                >
                  <option value="Umumiy">Umumiy</option>
                  <option value="Qora ro'yxat">Qora ro'yxat</option>
                </select>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline-primary">
              <span class="far fa-circle-check" />
            </button>
            <button
              id="close-modal"
              class="btn btn-outline-danger"
              data-dismiss="modal"
              @click="get(0, 100)"
            >
              <span class="far fa-circle-xmark" />
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import {
  catchError,
  customers,
  success,
  updateCustomer,
} from "@/components/Api/api";
import Pagination from "../../components/Pagination/Pagination.vue";
export default {
  name: "Mijozlar",
  emits: ["setloading"],
  components: { Pagination },
  data() {
    return {
      search: "",
      page: 0,
      pages: 1,
      limit: 25,
      mijozlar: [],
      editMijoz: {},
    };
  },
  created() {
    this.get(0, 25);
  },
  methods: {
    format(number) {
      return String(
        "(" +
          String(number).substr(0, 2) +
          ") " +
          String(number).substr(2, 3) +
          " " +
          String(number).substr(5, 2) +
          " " +
          String(number).substr(7, 2)
      );
    },
    get(page, limit) {
      this.$emit("setloading", true);
      customers(this.search, page, limit)
        .then((Response) => {
          this.page = Response.data.current_page;
          this.pages = Response.data.pages;
          this.limit = Response.data.limit;
          this.mijozlar = Response.data.data;
          this.$emit("setloading", false);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    put(data) {
      this.$emit("setloading", true);
      updateCustomer(data)
        .then((Response) => {
          document.querySelector("#close-modal").click();
          success().then(() => {
            this.get(0, 100);
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

<style scoped>
.list-group-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.responsive {
  overflow-x: hidden;
  max-height: 75vh;
}
</style>
