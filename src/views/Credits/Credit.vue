<template>
  <h3>Savdo</h3>
  <div class="row">
    <div class="col-md-4"></div>
    <div class="col-md-4 my-1"></div>
    <div class="col-md-4"></div>
  </div>
  <hr />
  <ul class="nav nav-pills nav-justified">
    <li class="nav-item">
      <button class="nav-link">Mahsulotlar</button>
    </li>
    <li class="nav-item">
      <button class="nav-link">To'lovlar</button>
    </li>
  </ul>
</template>

<script>
export default {
  name: "Credit",
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
