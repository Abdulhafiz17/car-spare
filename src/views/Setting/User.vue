<template>
  <form @submit.prevent="putUser(user)" v-if="user">
    <div class="row gap-2 text-left">
      <div class="col-md-12">
        <div class="row">
          <label class="col-md-6">
            Ism
            <input
              type="text"
              class="form-control form-control-sm"
              required
              v-model="user.name"
            />
          </label>
          <label class="col-md-6">
            Telefon raqami
            <div class="input-group input-group-sm">
              <div class="input-group-text">+998</div>
              <input
                type="tel"
                class="form-control"
                minlength="9"
                maxlength="9"
                required
                v-model="user.phone"
              />
            </div>
          </label>
        </div>
      </div>
      <div class="col-md-12">
        <div class="row">
          <label class="col-md-6">
            Foydalanuvchi nomi
            <input
              type="text"
              class="form-control form-control-sm"
              required
              v-model="user.username"
            />
          </label>
          <label class="col-md-6">
            Parol
            <input
              type="password"
              class="form-control form-control-sm"
              v-model="user.password"
            />
          </label>
        </div>
      </div>
      <div class="col-md-12">
        <button class="btn btn-sm btn-outline-primary float-right">
          <i class="far fa-circle-check"></i> Tasdiqlash
        </button>
      </div>
    </div>
  </form>
</template>

<script>
import { catchError, success, updateUser, user } from "@/components/Api/api";
export default {
  name: "User",
  emits: ["setloading"],
  data() {
    return {
      user: null,
      id: localStorage.getItem("id"),
    };
  },
  created() {
    this.getUser();
  },
  methods: {
    getUser() {
      this.$emit("setloading", true);
      user(this.id)
        .then((Response) => {
          this.user = Response.data;
          this.user.password = "";
          this.$emit("setloading", false);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    putUser(user) {
      this.$emit("setloading", true);
      updateUser(user)
        .then((Response) => {
          success().then(() => {
            this.getUser();
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
