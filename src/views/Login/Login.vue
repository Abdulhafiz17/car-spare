<template>
  <div class="container-fluid d-flex align-items-center justify-content-center">
    <div class="card shadow">
      <div class="card-body">
        <div class="card-img">
          <img src="../../assets/logo.png" alt="" />
        </div>
        <h3>Xush kelibsiz</h3>
        <form @submit.prevent="post(data)">
          <div class="row gap-2">
            <div class="col-md-12">
              <div class="input-group">
                <input
                  type="text"
                  class="form-control text-center"
                  placeholder="foydalanuvchi nomi"
                  required
                  v-model="data.username"
                />
                <div class="input-group-text">
                  <i class="fa fa-at" />
                </div>
              </div>
            </div>
            <div class="col-md-12">
              <div class="input-group">
                <input
                  :type="type ? 'password' : 'text'"
                  class="form-control text-center"
                  placeholder="parol"
                  required
                  v-model="data.password"
                />
                <div class="input-group-text" @click="type = !type">
                  <i :class="`fa fa-eye${type ? '-slash' : ''}`" />
                </div>
              </div>
            </div>
            <div class="col-md-12">
              <button class="btn btn-primary w-100">Kirish</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { catchError, token } from "../../components/Api/api";
export default {
  name: "Login",
  emits: ["setloading"],
  data() {
    return {
      data: {
        username: "",
        password: "",
      },
      type: true,
    };
  },
  created() {
    this.$emit("setloading", false);
    localStorage.removeItem("access_token");
    localStorage.removeItem("role");
    localStorage.removeItem("branch_id");
    localStorage.removeItem("id");
  },
  mounted() {
    document.querySelector("[type=text]").focus();
  },
  methods: {
    post(data) {
      this.$emit("setloading", true);
      token(data)
        .then((Response) => {
          this.require(Response.data);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    require(data) {
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("branch_id", data.branch_id);
      localStorage.setItem("id", data.id);
      location.href = "/home";
    },
  },
};
</script>

<style lang="scss" scoped>
.container-fluid {
  height: 100%;

  .card {
    width: 350px;
    border: none;

    .card-img {
      padding: 10px;

      img {
        width: 80%;
      }
    }

    .card-body {
      .input-group-text {
        width: 40px;
        display: flex;
        justify-content: center;
      }
    }
  }
}
</style>
