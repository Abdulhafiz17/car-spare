<script>
import * as api from "@/components/Api/api.js";
import Pagination from "@/components/Pagination/Pagination.vue";
export default {
  name: "Cells",
  emits: ["setloading"],
  components: { Pagination },
  data() {
    return {
      search: "",
      cells: {
        currenct_page: 0,
        pages: 1,
        limit: 25,
        data: [],
      },
      cell: {
        name: "",
        comment: "",
      },
    };
  },
  created() {
    this.getCells(0, 25);
  },
  methods: {
    getCells(page, limit) {
      this.$emit("setloading", true);
      api
        .cells(this.search, page, limit)
        .then((res) => {
          this.cells = res.data;
          this.$emit("setloading", false);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          api.catchError(error);
        });
    },
    postCell() {
      this.$emit("setloading", true);
      if (this.cell.id) {
        api
          .updateCell(this.cell)
          .then(() => {
            api.success("close-add").then(() => {
              this.cell = { name: "", comment: "" };
              this.getCells(0, 25);
            });
          })
          .catch((error) => {
            this.$emit("setloading", false);
            catchError(error);
          });
        return;
      } else {
        api
          .createCell(this.cell)
          .then(() => {
            api.success("close-add").then(() => {
              this.cell = { name: "", comment: "" };
              this.getCells(0, 25);
            });
          })
          .catch((error) => {
            this.$emit("setloading", false);
            catchError(error);
          });
      }
      return;
    },
  },
};
</script>

<template>
  <h3>Mahsulot o'rinlari</h3>
  <div class="row">
    <div class="col-md-4">
      <div class="input-group input-group-sm">
        <input
          type="search"
          class="form-control"
          placeholder="Qidiruv"
          v-model="search"
          @input="getCells(0, 25)"
        />
        <div class="input-group-text">
          <i class="fa fa-search"></i>
        </div>
      </div>
    </div>
    <div class="col-md-4 my-1"></div>
    <div class="col-md-4">
      <button
        class="btn btn-sm btn-block btn-outline-primary"
        data-toggle="modal"
        data-target="#add"
      >
        <i class="fa fa-box"></i><i class="fa fa-plus px-1"></i> Mahsulot o'rni
        qo'shish
      </button>
    </div>
  </div>
  <hr />

  <div class="responsive-y" style="max-height: 80vh">
    <div class="row">
      <div class="col-md-4 my-1" v-for="item in cells.data" :key="item">
        <div class="card shadow">
          <div class="card-body">
            <ul class="list-group">
              <li class="list-group-item">
                <i class="fa fa-signature"></i>
                {{ item.name }}
              </li>
              <li class="list-group-item">
                <i class="fa fa-comment"></i>
                {{ item.comment }}
              </li>
            </ul>
            <div class="row my-1">
              <div class="col" v-if="false">
                <router-link
                  :to="`/hodim/${item.id}`"
                  class="btn btn-sm btn-block btn-outline-info"
                >
                  <i class="fa fa-info"></i>
                </router-link>
              </div>
              <div class="col">
                <button
                  class="btn btn-sm btn-block btn-outline-warning"
                  data-toggle="modal"
                  data-target="#add"
                  @click="
                    cell.id = item.id;
                    cell.name = item.name;
                    cell.comment = item.comment;
                  "
                >
                  <i class="fa fa-edit"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12">
        <Pagination
          :page="cells.current_page"
          :pages="cells.pages"
          :limit="cells.limit"
          @get="getCells"
        />
      </div>
    </div>
  </div>

  <div class="modal fade" id="add">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h4>Mahsulot o'rni{{ cell?.id ? "ni tahrirlash" : " qo'shish" }}</h4>
        </div>
        <form @submit.prevent="postCell()">
          <div class="modal-body text-left">
            <div class="row gap-2">
              <label class="col-12">
                Nomi
                <input
                  type="text"
                  class="form-control form-control-sm"
                  required
                  v-model="cell.name"
                />
              </label>
              <label class="col-12">
                Izoh
                <input
                  type="text"
                  class="form-control form-control-sm"
                  required
                  v-model="cell.comment"
                />
              </label>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline-primary">
              <i class="far fa-circle-check"></i>
            </button>
            <button
              class="btn btn-outline-danger"
              data-dismiss="modal"
              close-add
            >
              <i class="far fa-circle-xmark"></i>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
