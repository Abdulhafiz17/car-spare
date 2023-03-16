<template>
  <h3>Sozlamalar</h3>
  <div class="row">
    <div class="col-md-4"></div>
    <div class="col-md-4 my-1"></div>
    <div class="col-md-4">
      <router-link to="/" class="btn btn-sm btn-outline-secondary float-right">
        <i class="fa fa-sign-out"></i> Tizimdan chiqish
      </router-link>
    </div>
  </div>
  <hr />

  <tabs
    :tab_buttons="[`Umumiy`, `Valyutalar`, `Kategoriyalar`, `Mahsulot turlari`]"
    :tab_slots="[`common`, `currencies`, `categories`, `product_types`]"
  >
    <template #common>
      <div :class="common_class">
        <div class="row">
          <div class="col-md-12">
            <h5>Tunggi rejim</h5>
            <p>Tizim uchun tunggi yoki tonggi mavzu</p>
          </div>
          <div class="col-md-12">
            <ul class="list-group">
              <li class="list-group-item px-5 p-2" @click="changeMode()">
                <span>Tunggi rejim</span>
                <span class="toggle-wrapper">
                  <label class="toggle">
                    <input
                      id="mode"
                      type="checkbox"
                      :checked="mode === 'dark' ? 'checked' : false"
                      @change="changeMode()"
                    />
                    <span class="toggler round">
                      <span id="sun">☀️</span>
                      <span id="moon">🌙</span>
                    </span>
                  </label>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div :class="common_class">
        <div class="row">
          <div class="col-md-12">
            <h5>Shaxsiy ma'lumotlar</h5>
            <p>
              Ism, telefon raqami, foydalanuvchi nomi yoki parolni o'zgartirish
            </p>
          </div>
          <div class="col-md-12">
            <User @setloading="setloading" />
          </div>
        </div>
      </div>
    </template>

    <template #currencies>
      <div :class="common_class">
        <Currency @setloading="setloading" />
      </div>
    </template>

    <template #categories>
      <div :class="common_class">
        <Category @setloading="setloading" />
      </div>
    </template>

    <template #product_types>
      <div :class="common_class">
        <ProductType @setloading="setloading" />
      </div>
    </template>
  </tabs>
</template>

<script>
import User from "./User.vue";
import Currency from "./Currency.vue";
import Category from "./Category.vue";
import ProductType from "./ProductType.vue";
export default {
  name: "Setting",
  emits: ["setloading"],
  components: { User, Currency, Category, ProductType },
  data() {
    return {
      common_class: "p-3 mb-1 border border-primary rounded text-left",
      mode: document.querySelector("#app").classList[0],
    };
  },
  created() {},
  methods: {
    setloading(loading) {
      this.$emit("setloading", loading);
    },
    changeMode() {
      if (this.mode) {
        this.mode = "";
        document.querySelector("#app").classList.remove("dark");
        localStorage.setItem("mode", this.mode);
      } else {
        this.mode = "dark";
        document.querySelector("#app").classList.add("dark");
        localStorage.setItem("mode", this.mode);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.form-control {
  position: relative;
}

.form-control::before {
  content: "123456789";
  position: absolute;
  bottom: 0;
  width: 200px;
  height: 10vh;
  padding: 5px;
  color: #2196f3;
  background-color: lightslategrey;
}

.toggle {
  position: relative;
  display: inline-block;
  width: 55px;
  height: 24px;
  margin: 5px;
}
.toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggler {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--dark);
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.toggler:before {
  position: absolute;
  content: "";
  height: 22px;
  width: 22px;
  left: 3px;
  bottom: 1px;
  background: lightgray;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.dark .toggler::before {
  background: rgb(50, 55, 65);
}

input:focus + toggler {
  box-shadow: 0 0 2px #2196f3;
}

input:checked + .toggler:before {
  -webkit-transform: translateX(31px);
  -ms-transform: translateX(31px);
  transform: translateX(31px);
}

.dark .toggler.round {
  background: gray;
  border-radius: 34px;
  width: 60px;
}

.toggler.round {
  border-radius: 34px;
  width: 60px;
}

.toggler.round:before {
  border-radius: 50%;
}

#sun {
  float: left;
  margin-top: -3px;
  font-size: 1.3rem;
}

#moon {
  float: right;
  margin-top: -4px;
  font-size: 1.3rem;
}
</style>
