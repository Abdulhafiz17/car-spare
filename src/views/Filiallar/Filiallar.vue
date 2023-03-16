<template>
  <h3>Filiallar</h3>
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
        <i class="fa fa-plus" /> Filial qo'shish
      </button>
    </div>
  </div>

  <hr />

  <div class="responsive-y" style="max-height: 80vh">
    <div class="row">
      <div class="col-md-4 my-1" v-for="item in filter" :key="item">
        <div class="card shadow">
          <div class="card-img" v-if="item.file">
            <img :src="url + item.file" :alt="item.file" />
          </div>
          <div class="card-img-not" v-if="!item.file">
            <i class="fa fa-5x fa-file-image" />
          </div>
          <div class="card-body">
            <ul class="list-group">
              <li class="list-group-item">
                <i class="fa fa-code-branch" />
                <span>
                  {{ item.Branches.name }}
                </span>
              </li>
              <a
                class="list-group-item"
                target="_blank"
                :href="`https://www.google.com/maps/@${item.Branches.map_lat},${item.Branches.map_long},18z`"
              >
                <i class="fa fa-location-dot" />
                <span>
                  {{ item.Branches.address }}
                </span>
              </a>
              <a
                class="list-group-item"
                :href="`tel:+998${item.Branches.phone}`"
              >
                <i class="fa fa-phone" />
                <span>
                  {{ "+998 " + format(item.Branches.phone) }}
                </span>
              </a>
            </ul>
            <div class="row my-1">
              <div class="col mb-1">
                <router-link
                  :to="`/hisobotlar/${item.Branches.id}`"
                  class="btn btn-sm btn-block btn-outline-success"
                >
                  <i class="fa fa-chart-line" />
                  <!-- Hisobotlar -->
                </router-link>
              </div>
              <div class="col mb-1">
                <router-link
                  :to="`/hodimlar/${item.Branches.id}`"
                  class="btn btn-sm btn-block btn-outline-primary"
                >
                  <i class="fa fa-user-group" />
                  <!-- Hodimlar -->
                </router-link>
              </div>
              <div class="col mb-1">
                <router-link
                  :to="`/filial_mahsulotlar/${item.Branches.id}`"
                  class="btn btn-sm btn-block btn-outline-info"
                >
                  <i class="fa fa-box" />
                  <!-- Tarix -->
                </router-link>
              </div>
              <div class="col mb-1">
                <button
                  class="btn btn-sm btn-block btn-outline-warning"
                  data-toggle="modal"
                  data-target="#edit"
                  @click="
                    edit.id = item.Branches.id;
                    edit.name = item.Branches.name;
                    edit.phone = item.Branches.phone;
                    edit.address = item.Branches.address;
                    edit.map_lat = item.Branches.map_lat;
                    edit.map_long = item.Branches.map_long;
                    edit.file = item.file;
                  "
                >
                  <i class="fa fa-edit" />
                  <!-- Tahrirlash -->
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
          <h4>Filial qo'shish</h4>
        </div>
        <form @submit.prevent="post(add)">
          <div class="modal-body">
            <div class="row gap-2 text-left">
              <div class="col-md-12">
                Nomi
                <input
                  type="text"
                  class="form-control form-control-sm"
                  required
                  v-model="add.name"
                />
              </div>
              <div class="col-md-12">
                Telefon raqami
                <label class="input-group input-group-sm">
                  <div class="input-group-text">+998</div>
                  <input
                    type="phone"
                    class="form-control"
                    minlength="9"
                    maxlength="9"
                    required
                    v-model="add.phone"
                  />
                </label>
              </div>
              <div class="col-md-12">
                Manzil
                <input
                  type="text"
                  class="form-control form-control-sm"
                  required
                  v-model="add.address"
                />
              </div>
              <div class="col-md-12">
                Geo joylashuv
                <div class="row">
                  <div class="col-md-6">
                    <label class="input-group input-group-sm">
                      <input
                        type="text"
                        class="form-control"
                        v-model="add.map_lat"
                      />
                      <div class="input-group-text">kenglik</div>
                    </label>
                  </div>
                  <div class="col-md-6">
                    <label class="input-group input-group-sm">
                      <input
                        type="text"
                        class="form-control"
                        v-model="add.map_long"
                      />
                      <div class="input-group-text">uzunlik</div>
                    </label>
                  </div>
                </div>
              </div>
              <div class="col-md-12">
                Rasm
                <input
                  type="file"
                  class="form-control form-control-sm"
                  required
                  add
                />
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline-primary">
              <i class="far fa-circle-check" />
            </button>
            <button class="btn btn-outline-danger" data-dismiss="modal">
              <i class="far fa-circle-xmark" />
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
          <h4>{{ edit.name + " ma'lumotlarini tahrirlash" }}</h4>
        </div>
        <form @submit.prevent="put(edit)">
          <div class="modal-body">
            <div class="row gap-2 text-left">
              <div class="col-md-12">
                Nomi
                <input
                  type="text"
                  class="form-control form-control-sm"
                  required
                  v-model="edit.name"
                />
              </div>
              <div class="col-md-12">
                Telefon raqami
                <label class="input-group input-group-sm">
                  <div class="input-group-text">+998</div>
                  <input
                    type="phone"
                    class="form-control"
                    minlength="9"
                    maxlength="9"
                    required
                    v-model="edit.phone"
                  />
                </label>
              </div>
              <div class="col-md-12">
                Manzil
                <input
                  type="text"
                  class="form-control form-control-sm"
                  required
                  v-model="edit.address"
                />
              </div>
              <div class="col-md-12">
                Geo joylashuv
                <div class="row">
                  <div class="col-md-6">
                    <label class="input-group input-group-sm">
                      <input
                        type="text"
                        class="form-control"
                        v-model="edit.map_lat"
                      />
                      <div class="input-group-text">kenglik</div>
                    </label>
                  </div>
                  <div class="col-md-6">
                    <label class="input-group input-group-sm">
                      <input
                        type="text"
                        class="form-control"
                        v-model="edit.map_long"
                      />
                      <div class="input-group-text">uzunlik</div>
                    </label>
                  </div>
                </div>
              </div>
              <div class="col-md-12">
                Rasm
                <input type="file" class="form-control form-control-sm" edit />
              </div>
              <div class="col-md-12">
                <div class="modal-img" v-if="edit.file">
                  <img :src="url + edit.file" :alt="edit.file" />
                </div>
                <div class="modal-img-not" v-if="!edit.file">
                  <i class="fa fa-5x fa-file-image" />
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline-primary">
              <i class="far fa-circle-check" />
            </button>
            <button class="btn btn-outline-danger" data-dismiss="modal">
              <i class="far fa-circle-xmark" />
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import {
  branches,
  catchError,
  createBranch,
  success,
  updateBranch,
  url,
} from "@/components/Api/api";
export default {
  name: "Filiallar",
  emits: ["setloading"],
  data() {
    return {
      search: "",
      url: url,
      branches: [],
      add: {
        name: null,
        phone: null,
        map_lat: null,
        map_long: null,
        address: null,
      },
      edit: {
        id: null,
        name: null,
        phone: null,
        map_lat: null,
        map_long: null,
        address: null,
        file: null,
      },
    };
  },
  computed: {
    filter: function () {
      return this.branches.filter((branch) => {
        return branch.Branches.name
          .toLowerCase()
          .match(this.search.toLowerCase());
      });
    },
  },
  created() {
    this.getBranches();
    this.getLocation();
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
    getBranches() {
      branches()
        .then((Response) => {
          this.branches = Response.data;
          this.$emit("setloading", false);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    post(add) {
      this.$emit("setloading", true);
      let data = new FormData();
      data.append("name", add.name);
      data.append("phone", add.phone);
      data.append("map_lat", add.map_lat);
      data.append("map_long", add.map_long);
      data.append("address", add.address);
      data.append("file", document.querySelector("[add]").files[0]);
      createBranch(data)
        .then((Response) => {
          success(0).then(() => {
            this.add = {
              name: null,
              phone: null,
              map_lat: null,
              map_long: null,
              address: null,
            };
            document.querySelector("[add]").value = null;
            this.getBranches();
          });
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    put(edit) {
      this.$emit("setloading", true);
      let data = new FormData();
      data.append("name", edit.name);
      data.append("phone", edit.phone);
      data.append("map_lat", edit.map_lat);
      data.append("map_long", edit.map_long);
      data.append("address", edit.address);
      data.append(
        "file",
        document.querySelector("[edit]").files[0]
          ? document.querySelector("[edit]").files[0]
          : ""
      );
      updateBranch(edit.id, data)
        .then((Response) => {
          success(1).then(() => {
            document.querySelector("[edit]").value = null;
            this.getBranches();
          });
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.add.map_lat = position.coords.latitude;
            this.add.map_long = position.coords.longitude;
          },
          (error) => {
            console.log(error.message);
          }
        );
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.card {
  height: 100%;

  .card-img-not {
    height: 100%;
    padding: 15px 10px 0 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .card-img {
    height: 100%;
    padding: 15px 10px 0 10px;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 70%;
      object-fit: contain;
    }
  }
}

.modal-content {
  .modal-img-not {
    padding: 15px 10px 0 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .modal-img {
    padding: 15px 10px 0 10px;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 30%;
      object-fit: contain;
    }
  }
}
</style>
