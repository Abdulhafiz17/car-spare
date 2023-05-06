<template>
  <form @submit.prevent="getExpenses(0, 25)">
    <div class="row">
      <div class="col-md-5 mb-1">
        <input
          type="date"
          class="form-control form-control-sm"
          v-model="from_time"
        />
      </div>
      <div class="col-md-5 mb-1">
        <input
          type="date"
          class="form-control form-control-sm"
          v-model="to_time"
        />
      </div>
      <div class="col-md-2 mb-1">
        <button class="btn btn-sm btn-block btn-outline-primary">
          <i class="fa fa-search" />
        </button>
      </div>
    </div>
  </form>
  <div class="responsive-y" style="max-height: 64vh">
    <table class="table table-sm table-hover">
      <thead>
        <tr v-if="show_sum">
          <th colspan="3">
            Umumiy chiqim:
            <span v-for="item in sum" :key="item">
              <strong>{{ $util.currency(item.sum_expense) }}</strong>
              {{ item.currency }}
            </span>
          </th>
        </tr>
        <tr>
          <th>Summa</th>
          <th>Izoh</th>
          <th>Sana</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in data" :key="item">
          <td>
            {{
              $util.currency(item.Expenses.money) +
              " " +
              item.Currencies.currency
            }}
          </td>
          <td>{{ item.Expenses.comment }}</td>
          <td>{{ item.Expenses.time.replace("T", " ") }}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="3">
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
import { catchError, variableExpenses } from "@/components/Api/api";
export default {
  name: "BirMarttalik",
  emits: ["setloading"],
  components: { Pagination },
  data() {
    return {
      _: Intl.NumberFormat(),
      branch_id: localStorage.getItem("branch_id"),
      from_time: "",
      to_time: "",
      page: 0,
      pages: 1,
      limit: 25,
      data: [],
      sum: [],
      show_sum: false,
    };
  },
  created() {
    this.getExpenses(0, 25);
  },
  methods: {
    getExpenses(page, limit) {
      this.$emit("setloading", true);
      variableExpenses(
        this.branch_id,
        this.from_time,
        this.to_time,
        page,
        limit
      )
        .then((Response) => {
          this.page = Response.data.current_page;
          this.pages = Response.data.pages;
          this.limit = Response.data.limit;
          this.data = Response.data.data;
          this.sum = Response.data.sum_variable_expenses_data;
          if (this.from_time && this.to_time) this.show_sum = true;
          else this.show_sum = false;
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
