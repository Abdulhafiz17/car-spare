<template></template>

<script>
import swal from "sweetalert";
export default {
  name: "Home",
  emits: ["setloading"],
  data() {
    return {
      role: localStorage.getItem("role"),
    };
  },
  created() {
    if (this.role == "admin") {
      this.$router.push("/filiallar");
    } else if (this.role == "branch_admin") {
      this.$router.push("/kassa");
    } else {
      swal({
        icon: "info",
        text: "Ushbu rolda tizimga kirish mumkin emas",
        closeOnEsc: false,
        closeOnClickOutside: false,
      }).then(() => {
        this.$router.push("/");
      });
    }
  },
};
</script>
