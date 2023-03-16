<template>
  <form @submit.prevent="getExpenses(0, 25)">
    <div class="row">
      <div class="col-md-3 mb-1">
        <select class="form-select form-select-sm" v-model="expense_id">
          <option value="0">Chiqimlar</option>
          <option v-for="item in expenses" :key="item" :value="item.id">
            {{ item.name }}
          </option>
        </select>
      </div>
      <div class="col-md-4 mb-1">
        <input
          type="date"
          class="form-control form-control-sm"
          v-model="from_time"
        />
      </div>
      <div class="col-md-4 mb-1">
        <input
          type="date"
          class="form-control form-control-sm"
          v-model="to_time"
        />
      </div>
      <div class="col-md-1 mb-1">
        <button class="btn btn-sm btn-block btn-outline-primary">
          <i class="fa fa-search" />
        </button>
      </div>
    </div>
  </form>
  <div class="responsive-y" style="max-height: 65vh">
    <table class="table table-sm table-hover">
      <thead>
        <tr>
          <th>Chiqim</th>
          <th>Summa</th>
          <th>Izoh</th>
          <th>Sana</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in data" :key="item">
          <td>{{ item.name }}</td>
          <td>
            {{ _.format(item.Expenses.money) + " " + item.Currencies.currency }}
          </td>
          <td>{{ item.Expenses.comment }}</td>
          <td>{{ item.Expenses.time.replace("T", " ") }}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="4">
            <Pagination
              :page="page"
              :pages="pages"
              :limit="limit"
              @get="getExpenses"
            />
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script>
import Pagination from "../../components/Pagination/Pagination.vue";
import { catchError, fixedExpenses } from "@/components/Api/api";
export default {
  name: "Doimiy",
  props: ["fixed_expenses"],
  emits: ["setloading"],
  components: { Pagination },
  data() {
    return {
      _: Intl.NumberFormat(),
      branch_id: localStorage.getItem("branch_id"),
      expense_id: 0,
      from_time: "",
      to_time: "",
      page: 0,
      pages: 1,
      limit: 25,
      data: [],
    };
  },
  computed: {
    expenses() {
      return this.$props.fixed_expenses;
    },
  },
  created() {
    this.getExpenses(0, 25);
  },
  methods: {
    getExpenses(page, limit) {
      this.$emit("setloading", true);
      fixedExpenses(
        this.branch_id,
        this.from_time,
        this.to_time,
        this.expense_id,
        page,
        limit
      )
        .then((Response) => {
          this.page = Response.data.current_page;
          this.pages = Response.data.pages;
          this.limit = Response.data.limit;
          this.data = Response.data.data;
          this.$emit("setloading", false);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
  },
};
</script>
