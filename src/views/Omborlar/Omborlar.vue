<template>
  <h3>Omborlar</h3>
  <div class="row">
    <div class="col-md-4">
      <div class="input-group input-group-sm">
        <input
          type="search"
          class="form-control"
          placeholder="Qidiruv"
          v-model="search"
        />
        <div class="input-group-text">
          <i class="fa fa-search" />
        </div>
      </div>
    </div>
    <div class="col-md-4 my-1"></div>
    <div class="col-md-4">
      <button
        class="btn btn-sm btn-outline-primary w-100"
        data-toggle="modal"
        data-target="#add"
      >
        <i class="fa fa-plus" /> Ombor qo'shish
      </button>
    </div>
  </div>

  <hr />

  <div class="responsive-y" style="max-height: 80vh">
    <div class="row">
      <div class="col-md-4 my-1" v-for="item in filter" :key="item">
        <div class="card shadow">
          <div class="card-body">
            <ul class="list-group">
              <li class="list-group-item">
                <i class="fa fa-warehouse"></i>
                <span>{{ item.name }}</span>
              </li>
              <li class="list-group-item">
                <i class="fa fa-location-dot"></i>
                <span>{{ item.address }}</span>
              </li>
            </ul>
            <div class="row my-1">
              <div class="col">
                <router-link
                  :to="`/ombor/${item.id}`"
                  class="btn btn-sm btn-block btn-outline-success"
                >
                  <i class="fa fa-door-open"></i>
                </router-link>
              </div>
              <div class="col">
                <button
                  class="btn btn-sm btn-block btn-outline-warning"
                  data-toggle="modal"
                  data-target="#edit"
                  @click="
                    edit.id = item.id;
                    edit.name = item.name;
                    edit.address = item.address;
                  "
                >
                  <i class="fa fa-edit"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="modal fade" id="add">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h4>Ombor qo'shish</h4>
        </div>
        <form @submit.prevent="post(add)">
          <div class="modal-body text-left">
            <div class="row gap-2">
              <label class="col-md-12">
                Nomi
                <input
                  type="text"
                  class="form-control form-control-sm"
                  required
                  v-model="add.name"
                />
              </label>
              <label class="col-md-12">
                Manzil
                <input
                  type="text"
                  class="form-control form-control-sm"
                  required
                  v-model="add.address"
                />
              </label>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline-primary">
              <i class="far fa-circle-check"></i>
            </button>
            <button class="btn btn-outline-danger" data-dismiss="modal">
              <i class="far fa-circle-xmark"></i>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <div class="modal fade" id="edit">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h4>Ombor ma'lumotlarini tahrirlash</h4>
        </div>
        <form @submit.prevent="put(edit)">
          <div class="modal-body text-left">
            <div class="row gap-2">
              <label class="col-md-12">
                Nomi
                <input
                  type="text"
                  class="form-control form-control-sm"
                  required
                  v-model="edit.name"
                />
              </label>
              <label class="col-md-12">
                Manzil
                <input
                  type="text"
                  class="form-control form-control-sm"
                  required
                  v-model="edit.address"
                />
              </label>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline-primary">
              <i class="far fa-circle-check"></i>
            </button>
            <button class="btn btn-outline-danger" data-dismiss="modal">
              <i class="far fa-circle-xmark"></i>
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
  createWarehouse,
  success,
  updateWarehouse,
  warehouses,
} from "@/components/Api/api";
export default {
  name: "Omborlar",
  emits: ["setloading"],
  data() {
    return {
      search: "",
      add: {
        name: null,
        address: null,
      },
      edit: {
        id: null,
        name: null,
        address: null,
      },
      warehouses: [],
    };
  },
  computed: {
    filter() {
      return this.warehouses.filter((warehouse) => {
        return warehouse.name.toLowerCase().match(this.search.toLowerCase());
      });
    },
  },
  created() {
    this.getWarehouses();
  },
  methods: {
    getWarehouses() {
      warehouses()
        .then((Response) => {
          this.warehouses = Response.data;
          this.$emit("setloading", false);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    post(data) {
      this.$emit("setloading", true);
      createWarehouse(data)
        .then((Response) => {
          success(0).then(() => {
            this.add = {
              name: null,
              address: null,
            };
            this.getWarehouses();
          });
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    put(data) {
      this.$emit("setloading", true);
      updateWarehouse(data)
        .then((Response) => {
          success(1).then(() => {
            this.getWarehouses();
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