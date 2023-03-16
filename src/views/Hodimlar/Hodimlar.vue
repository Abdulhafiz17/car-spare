<template>
  <h3>
    {{
      role == "admin"
        ? branch
          ? branch.Branches.name + " hodimlari"
          : ""
        : "Hodimlar"
    }}
  </h3>
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
        <i class="fa fa-user-plus"></i> Hodim qo'shish
      </button>
    </div>
  </div>
  <hr />

  <div class="responsive-y" style="max-height: 80vh">
    <div class="row">
      <div class="col-md-4 my-1" v-for="item in users" :key="item">
        <div
          class="card shadow border"
          :class="item.status ? 'border-secondary' : 'border-danger'"
        >
          <div class="card-body">
            <collapse>
              <template #header>
                <span>
                  <i class="fa fa-user" />
                </span>
                <span>
                  {{ item.name }}
                </span>
              </template>
              <template #body>
                <ul class="list-group">
                  <a class="list-group-item" :href="`tel:+998${item.phone}`">
                    <i class="fa fa-phone"></i>
                    {{ "+998 " + format(item.phone) }}
                  </a>
                  <li class="list-group-item">
                    <i class="fa fa-user-tag"></i>
                    {{
                      item.role == "branch_admin"
                        ? "Filial admin"
                        : item.role == "cashier"
                        ? "Kassir"
                        : item.role == "seller"
                        ? "Sotuvchi"
                        : ""
                    }}
                  </li>
                  <li class="list-group-item">
                    <i class="fa fa-coins"></i>
                    <span
                      :class="
                        item.balance > 0
                          ? 'text-success'
                          : item.balance < 0
                          ? 'text-danger'
                          : ''
                      "
                    >
                      {{ _.format(item.balance) + " so'm" }}
                    </span>
                  </li>
                </ul>
              </template>
            </collapse>
            <div class="row my-1">
              <div class="col">
                <router-link
                  :to="`/hodim/${item.id}`"
                  class="btn btn-sm btn-block btn-outline-info"
                >
                  <i class="fa fa-info"></i>
                </router-link>
              </div>
              <div class="col" v-if="role == 'branch_admin'">
                <button
                  class="btn btn-sm btn-block btn-outline-success"
                  data-toggle="modal"
                  data-target="#pay"
                  @click="
                    pay.source = item.id;
                    edit.name = item.name;
                  "
                >
                  <i class="fa fa-coins" />
                </button>
              </div>
              <div class="col">
                <button
                  class="btn btn-sm btn-block btn-outline-warning"
                  data-toggle="modal"
                  data-target="#edit"
                  @click="
                    edit.id = item.id;
                    edit.name = item.name;
                    edit.phone = item.phone;
                    edit.role = item.role;
                    edit.status = item.status;
                    edit.username = item.username;
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

  <div class="modal fade" id="edit">
    <div class="modal-dialog">
      <div class="modal-content" v-if="edit">
        <div class="modal-header">
          <h4>{{ edit.name }} ma'lumotlarini tahrirlash</h4>
        </div>
        <form @submit.prevent="put(edit)">
          <div class="modal-body text-left">
            <div class="row gap-3">
              <div class="col-md-12">
                <div class="row">
                  <div class="col-md-6">
                    Ism
                    <input
                      type="text"
                      class="form-control form-control-sm"
                      required
                      v-model="edit.name"
                    />
                  </div>
                  <div class="col-md-6">
                    Telefon raqam
                    <div class="input-group input-group-sm">
                      <div class="input-group-text">+998</div>
                      <input
                        type="tel"
                        minlength="9"
                        maxlength="9"
                        class="form-control"
                        required
                        v-model="edit.phone"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-12">
                Status
                <select
                  class="form-select form-select-sm"
                  required
                  v-model="edit.status"
                >
                  <option value="true">Faol</option>
                  <option value="false">Nofaol</option>
                </select>
              </div>
              <div class="col-md-12">
                <div class="row">
                  <div class="col-md-6">
                    Foydalanuvchi nomi
                    <input
                      type="text"
                      class="form-control form-control-sm"
                      required
                      v-model="edit.username"
                    />
                  </div>
                  <div class="col-md-6">
                    Parol
                    <input
                      type="password"
                      class="form-control form-control-sm"
                      v-model="edit.password"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline-primary">
              <i class="far fa-circle-check"></i>
            </button>
            <button
              class="btn btn-outline-danger"
              data-dismiss="modal"
              close-edit
            >
              <i class="far fa-circle-xmark"></i>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <div class="modal fade" id="add">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h4>Yangi hodim qo'shish</h4>
        </div>
        <form @submit.prevent="post(add)">
          <div class="modal-body text-left">
            <div class="row gap-3">
              <div class="col-md-12">
                <div class="row">
                  <div class="col-md-6">
                    Ism
                    <input
                      type="text"
                      class="form-control form-control-sm"
                      required
                      v-model="add.name"
                    />
                  </div>
                  <div class="col-md-6">
                    Telefon raqam
                    <div class="input-group input-group-sm">
                      <div class="input-group-text">+998</div>
                      <input
                        type="tel"
                        minlength="9"
                        maxlength="9"
                        class="form-control"
                        required
                        v-model="add.phone"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-12">
                Vazifasi
                <select class="form-select form-select-sm" v-model="add.role">
                  <option v-if="role == 'admin'" value="branch_admin">
                    Filial admin
                  </option>
                  <option value="seller">Sotuvchi</option>
                </select>
              </div>
              <div class="col-md-12">
                <div class="row">
                  <div class="col-md-6">
                    Foydalanuvchi nomi
                    <input
                      type="text"
                      class="form-control form-control-sm"
                      required
                      v-model="add.username"
                    />
                  </div>
                  <div class="col-md-6">
                    Parol
                    <input
                      type="password"
                      class="form-control form-control-sm"
                      required
                      v-model="add.password"
                    />
                  </div>
                </div>
              </div>
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

  <div class="modal fade" id="pay">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h4>{{ edit.name + " ga pul berish" }}</h4>
        </div>
        <form @submit.prevent="postExpense(pay)">
          <div class="modal-body">
            <div class="row gap-2">
              <div class="col-md-12">
                <div class="input-group input-group-sm">
                  <input
                    type="number"
                    min="0"
                    step="any"
                    class="form-control"
                    placeholder="summa"
                    required
                    v-model="pay.money"
                  />
                  <div class="input-group-text">so'm</div>
                </div>
              </div>
              <div class="col-md-12">
                <textarea
                  cols="30"
                  rows="2"
                  class="form-control"
                  placeholder="izoh"
                  v-model="pay.comment"
                ></textarea>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline-primary">
              <i class="far fa-circle-check" />
            </button>
            <button
              class="btn btn-outline-danger"
              data-dismiss="modal"
              close-pay-user
            >
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
  branch,
  catchError,
  users,
  updateUser,
  success,
  createUser,
  payForUser,
} from "../../components/Api/api";
export default {
  name: "Hodimlar",
  emits: ["setloading"],
  data() {
    return {
      search: "",
      _: Intl.NumberFormat(),
      role: localStorage.getItem("role"),
      branch_id: this.$route.params.id,
      branch: null,
      users: [],
      edit: {
        id: null,
        name: null,
        username: null,
        password: null,
        role: null,
        phone: null,
        status: null,
      },
      add: {
        id: 0,
        name: "",
        username: "",
        password: "",
        role: "",
        phone: null,
        branch_id: null,
        status: true,
      },
      pay: {
        money: null,
        currency_id: 0,
        source: null,
        comment: null,
      },
    };
  },
  created() {
    this.getBranch();
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
    getBranch() {
      branch(this.branch_id)
        .then((Response) => {
          this.branch = Response.data;
          this.getUsers();
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getUsers() {
      users(this.branch_id, 0, 50)
        .then((Response) => {
          this.users = Response.data.data;
          this.$emit("setloading", false);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    put(data) {
      this.$emit("setloading", true);
      data.password = data.password ? data.password : "";
      updateUser(data)
        .then((Response) => {
          success("close-edit").then(() => {
            this.getUsers();
          });
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    post(data) {
      this.$emit("setloading", true);
      data.branch_id = this.$route.params.id;
      createUser(data).then((Response) => {
        success("close-add")
          .then(() => {
            this.add = {
              id: 0,
              name: "",
              username: "",
              password: "",
              role: "",
              phone: null,
              branch_id: null,
              status: true,
            };
            this.getUsers();
          })
          .catch((error) => {
            this.$emit("setloading", false);
            catchError(error);
          });
      });
    },
    postExpense(data) {
      this.$emit("setloading", true);
      data.comment = data.comment ? data.comment : " ";
      payForUser(data)
        .then((Response) => {
          success("close-pay-user").then(() => {
            this.pay = {
              money: null,
              currency_id: 0,
              source: null,
              comment: null,
            };
            this.getUsers();
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
