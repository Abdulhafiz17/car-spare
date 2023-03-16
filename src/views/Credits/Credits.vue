<template>
  <h3>Muddatli to'lov</h3>
  <div class="row">
    <div class="col-md-4"></div>
    <div class="col-md-4 my-1"></div>
    <div class="col-md-4"></div>
  </div>
  <hr />

  <ul class="nav nav-pills nav-justified">
    <li class="nav-item">
      <button
        class="nav-link"
        :class="template == 'active' ? 'active' : ''"
        @click="template = 'active'"
      >
        Faol
      </button>
    </li>
    <li class="nav-item">
      <button
        class="nav-link"
        :class="template == 'closed' ? 'active' : ''"
        @click="template = 'closed'"
      >
        Yakunlangan
      </button>
    </li>
  </ul>

  <div class="tab-content pt-2">
    <div class="responsive-y shadow" style="height: 75vh">
      <table class="table table-sm table-hover">
        <thead>
          <tr>
            <th>Mijoz</th>
            <th>Summa</th>
            <th>To'langan summa</th>
            <th>Qoldiq summa</th>
            <th>Olingan sana</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in 10" :key="item">
            <td>{ mijoz }</td>
            <td>{ summa }</td>
            <td>{ summa }</td>
            <td>{ summa }</td>
            <td>{ sana }</td>
            <td>
              <div class="btn-group btn-group-sm">
                <router-link
                  :to="`/credit/${item}`"
                  class="btn btn-outline-info"
                >
                  <i class="fa fa-info" />
                </router-link>
                <button class="btn btn-outline-success">
                  <i class="fa fa-coins" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "Credits",
  emits: ["setloading"],
  data() {
    return {
      _: Intl.NumberFormat(),
      template: "",
    };
  },
  created() {
    this.$emit("setloading", false);
  },
};
</script>
