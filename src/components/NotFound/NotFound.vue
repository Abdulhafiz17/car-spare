<template>
  <div
    class="container-fluid w-100 h-100 d-flex align-items-center justify-content-center"
  >
    <h1>Sahifa topilmadi <small>(Xatolik kodi 404)</small></h1>
  </div>
</template>
<script>
export default {
  name: "NotFound",
  emits: ["setloading"],
  created() {
    this.$emit("setloading", false);
  },
};
</script>
