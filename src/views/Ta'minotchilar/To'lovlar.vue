<template>
  <form @submit.prevent="getExpenses(0, 25)">
    <div class="row">
      <div class="col-md-5 mb-1">
        <input
          class="form-control form-control-sm"
          type="date"
          v-model="from_time"
        />
      </div>
      <div class="col-md-5 mb-1">
        <input
          class="form-control form-control-sm"
          type="date"
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
  <div class="responsive-y" style="height: 69vh">
    <table class="table table-sm table-hover">
      <thead>
        <tr>
          <th>Summa</th>
          <th>Izoh</th>
          <th>Kim tomonidan</th>
          <th>Sana</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in expenses" :key="item">
          <td>
            {{ Intl.NumberFormat().format(item.Expenses.money) }}
            {{ item.currency }}
          </td>
          <td>{{ item.Expenses.comment }}</td>
          <td>{{ item.user }}</td>
          <td>
            {{
              item.Expenses.time
                .replace("T", " ")
                .substring(0, item.Expenses.time.length - 3)
            }}
          </td>
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
import { catchError, marketExpenses } from "@/components/Api/api";
import Pagination from "../../components/Pagination/Pagination.vue";
export default {
  name: "Payments",
  emits: ["setloading"],
  components: { Pagination },
  data() {
    return {
      page: 0,
      pages: 1,
      limit: 25,
      from_time: "",
      to_time: "",
      expenses: [],
    };
  },
  created() {
    this.getExpenses(0, 25);
  },
  methods: {
    getExpenses(page, limit) {
      this.$emit("setloading", true);
      marketExpenses(
        this.$route.params.id,
        this.from_time,
        this.to_time,
        page,
        limit
      )
        .then((Response) => {
          this.page = Response.data.current_page;
          this.pages = Response.data.pages;
          this.limit = Response.data.limit;
          this.expenses = Response.data.data;
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
