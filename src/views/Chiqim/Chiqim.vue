<template>
  <h3>Chiqim</h3>
  <div class="row">
    <div class="col-md-4"></div>
    <div class="col-md-4 my-1">
      <div class="btn-group btn-group-sm">
        <button
          class="btn btn-outline-primary"
          data-toggle="modal"
          data-target="#chiqimlar"
          get-fixed-expenses
        >
          <i class="fa fa-bars" />
        </button>
        <button
          class="btn btn-outline-primary"
          data-toggle="modal"
          data-target="#doimiy"
          fixed-expense
        >
          <i class="fa fa-coins" /> Doimiy
        </button>
        <button
          class="btn btn-outline-primary"
          data-toggle="modal"
          data-target="#bir-marttalik"
          variable-expense
        >
          <i class="fa fa-coins" /> Bir marttalik
        </button>
      </div>
    </div>
    <div class="col-md-4"></div>
  </div>
  <hr />

  <tabs
    :tab_buttons="[`Doimiy chiqimlar`, `Bir marttalik chiqimlar`]"
    :tab_slots="[`doimiy`, `bir_marttalik`]"
  >
    <template #doimiy>
      <Doimiy
        :fixed_expenses="expenses"
        @setloading="setloading"
        ref="history"
      />
    </template>
    <template #bir_marttalik>
      <BirMarttalik @setloading="setloading" ref="history" />
    </template>
  </tabs>

  <ModalChiqimlar
    :fixed_expenses="expenses"
    @setloading="setloading"
    @getExpenses="getExpenses"
    @get-history="getHistory"
  />
</template>

<script>
import ModalChiqimlar from "./ModalChiqimlar.vue";
import Doimiy from "./ChiqimlarDoimiy.vue";
import BirMarttalik from "./ChiqimlarBirMarttalik.vue";
import { catchError, getFixedExpenses } from "@/components/Api/api";
export default {
  name: "Expense",
  emits: ["setloading"],
  components: { ModalChiqimlar, Doimiy, BirMarttalik },
  data() {
    return {
      template: "",
      expenses: [],
    };
  },
  created() {
    this.template = "doimiy";
    this.getExpenses();
  },
  methods: {
    setloading(loading) {
      this.$emit("setloading", loading);
    },
    getExpenses(mounted) {
      getFixedExpenses()
        .then((Response) => {
          this.expenses = Response.data;
          mounted ? this.$emit("setloading", false) : false;
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getHistory(type) {
      document.querySelector(`[name="${type}"]`).click();
      this.$refs.history.getExpenses(0, 25);
    },
  },
};
</script>
