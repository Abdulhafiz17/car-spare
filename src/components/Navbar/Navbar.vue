<template>
  <nav class="desktop">
    <router-link
      v-for="item in links"
      :key="item"
      class="link"
      :to="item.path"
      v-show="item.role ? item.role == role : true"
    >
      {{ item.title }}
    </router-link>
  </nav>

  <nav class="mobile text-right">
    <button
      class="btn btn-sm"
      type="button"
      data-bs-toggle="offcanvas"
      data-bs-target="#offcanvasExample"
      aria-controls="offcanvasExample"
    >
      <i class="fa fa-bars" />
    </button>
  </nav>

  <div
    class="offcanvas offcanvas-end"
    tabindex="-1"
    id="offcanvasExample"
    aria-labelledby="offcanvasExampleLabel"
    data-bs-dismiss="offcanvas"
  >
    <div class="offcanvas-header justify-content-end">
      <button
        type="button"
        class="btn btn-sm"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
      >
        <i class="fa fa-lg fa-xmark" />
      </button>
    </div>
    <div class="offcanvas-body">
      <ul class="list-group">
        <router-link
          v-for="item in links"
          :key="item"
          class="link list-group-item"
          data-bs-dismiss="offcanvas"
          :to="item.path"
          v-show="item.role ? item.role == role : true"
        >
          {{ item.title }}
        </router-link>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "Navbar",
  data() {
    return {
      role: localStorage.getItem("role"),
      links: [
        {
          path: `/filiallar`,
          role: `admin`,
          title: `Filiallar`,
        },
        {
          path: `/taminotlar`,
          role: `admin`,
          title: `Ta'minotlar`,
        },
        {
          path: `/taminotchilar`,
          role: `admin`,
          title: `Ta'minotchilar`,
        },
        {
          path: `/kassa`,
          role: `branch_admin`,
          title: `Kassa`,
        },
        {
          path: `/hisobotlar/${localStorage["branch_id"]}`,
          role: `branch_admin`,
          title: `Hisobotlar`,
        },
        {
          path: `/hodimlar/${localStorage["branch_id"]}`,
          role: `branch_admin`,
          title: `Hodimlar`,
        },
        {
          path: `/mijozlar`,
          role: `branch_admin`,
          title: `Mijozlar`,
        },
        {
          path: `/nasiyalar`,
          role: `branch_admin`,
          title: `Nasiyalar`,
        },
        {
          path: `/return`,
          role: `branch_admin`,
          title: `Mahsulot qaytarish`,
        },
        {
          path: `/mahsulotlar/${localStorage["branch_id"]}`,
          role: `branch_admin`,
          title: `Mahsulotlar`,
        },
        {
          path: `/cells`,
          role: `branch_admin`,
          title: `Mahsulot o'rni`,
        },
        {
          path: `/revision/${localStorage["branch_id"]}`,
          role: `branch_admin`,
          title: `Mahsulotlar qoldig'i`,
        },
        {
          path: `/chiqim`,
          role: `branch_admin`,
          title: `Chiqim`,
        },
        {
          path: `/setting`,
          title: `Sozlamalar`,
        },
      ],
    };
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
nav.desktop {
  display: block;
}
nav {
  padding: 5px;
  text-align: left;
  box-shadow: 0 1px 50px -5px rgb(50, 55, 65);

  a {
    position: relative;
    padding: 5px;
    font-size: 15px;
    font-weight: bold;
    color: #2c3e50;
    border-radius: 5px;
    text-decoration: none;
    transition: 0.2s all;

    // &:first-child {
    //   border-radius: 4px 0 0 4px;
    // }

    // &:last-child {
    //   border-radius: 0 4px 4px 0;
    // }

    &:hover {
      background: rgb(50, 55, 65, 0.2);
    }

    &::after {
      content: "";
      display: block;
      position: absolute;
      bottom: 5%;
      left: 50%;
      right: 50%;
      width: 0;
      height: 2px;
      background: rgb(50, 55, 65);
      transition: 0.2s all;
    }

    &:hover::after {
      left: 5%;
      right: 5%;
      width: 90%;
    }

    &.router-link-exact-active {
      color: whitesmoke;
      background: rgb(50, 55, 65);
    }

    &.router-link-exact-active::after {
      background: rgb(245, 245, 245);
    }

    &.router-link-exact-active:hover {
      color: whitesmoke;
      background: rgb(50, 55, 65);
    }

    &.router-link-exact-active:hover::after {
      left: 50%;
      right: 50%;
      width: 0;
    }
  }
}

.dark nav.desktop {
  box-shadow: 0 1px 20px -5px black;

  a {
    color: rgb(245, 245, 245);

    &:hover {
      background: rgb(245, 245, 245, 0.2);
    }

    &::after {
      background: rgb(245, 245, 245);
    }

    &.router-link-exact-active {
      color: rgb(50, 55, 65);
      background: rgb(245, 245, 245);
    }

    &.router-link-exact-active::after {
      background: rgb(50, 55, 65);
    }

    &.router-link-exact-active:hover {
      color: rgb(50, 55, 65);
      background: rgb(245, 245, 245);
    }
  }
}

nav.mobile {
  display: none;
  padding: 5px;
  text-align: left;
  box-shadow: 0 1px 50px -5px rgb(50, 55, 65);
}
.dark nav.mobile {
  box-shadow: 0 1px 20px -5px black;
}

@media (max-width: 768px) {
  nav.mobile {
    display: block;
  }

  nav.desktop {
    display: none;
  }
}
</style>
