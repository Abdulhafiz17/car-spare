<template>
  <h3>Nasiyalar</h3>
  <div class="row">
    <div class="col-md-4"></div>
    <div class="col-md-4 my-1 text-center">
      Umumiy nasiya <strong>{{ _.format(sum_residual) + " so'm" }}</strong>
    </div>
    <div class="col-md-4"></div>
  </div>
  <hr />

  <ul class="nav nav-pills nav-justified">
    <li class="nav-item">
      <button
        class="nav-link"
        :class="template == 'active' ? 'active' : ''"
        @click="
          template = 'active';
          getLoanCustomersActive(0, 25);
        "
      >
        Faol
      </button>
    </li>
    <li class="nav-item">
      <button
        class="nav-link"
        :class="template == 'closed' ? 'active' : ''"
        @click="
          template = 'closed';
          getLoanCustomersClosed(0, 25);
        "
      >
        Yakunlangan
      </button>
    </li>
  </ul>

  <div class="tab-content pt-2">
    <div class="responsive-y" style="height: 70vh">
      <ul class="list-group">
        <li
          class="list-group-item"
          v-for="item in template == 'active'
            ? customers_active.data
            : customers_closed.data"
          :key="item"
        >
          <div class="text-left">
            <div>
              <h5 class="mb-1">{{ item.Customers.name }}</h5>
            </div>
            <span>{{ _.format(item.sum_loan_price) + " so'm" }}</span>
          </div>
          <button
            class="btn btn-sm btn-info"
            data-toggle="modal"
            data-target="#loans"
            @click="
              customer = item;
              template1 = 'active';
              getLoansActive(0, 25);
            "
          >
            <i class="fa fa-info"></i>
          </button>
        </li>
      </ul>
      <Pagination
        v-if="template == 'active'"
        :page="customers_active.current_page"
        :pages="customers_active.pages"
        :limit="customers_active.limit"
        @get="getLoanCustomersActive"
      />
      <Pagination
        v-else
        :page="customers_closed.current_page"
        :pages="customers_closed.pages"
        :limit="customers_closed.limit"
        @get="getLoanCustomersClosed"
      />
    </div>
  </div>

  <modal id="loans" size="lg">
    <template #header>
      <div>
        <h4>{{ customer?.Customers?.name }}</h4>
        <strong>{{ _.format(customer?.sum_loan_price) + " so'm" }}</strong>
      </div>
    </template>
    <template #body>
      <ul class="nav nav-pills nav-justified">
        <li class="nav-item">
          <button
            class="nav-link"
            :class="template1 == 'active' ? 'active' : ''"
            @click="
              template1 = 'active';
              getLoansActive(0, 25);
            "
          >
            Faol
          </button>
        </li>
        <li class="nav-item">
          <button
            class="nav-link"
            :class="template1 == 'closed' ? 'active' : ''"
            @click="
              template1 = 'closed';
              getLoansClosed(0, 25);
            "
          >
            Yakunlangan
          </button>
        </li>
      </ul>

      <div class="tab-content pt-2">
        <div class="responsive-y" style="height: 55vh">
          <table class="table table-sm table-hover">
            <thead>
              <tr>
                <th>Nasiya summasi</th>
                <th v-if="template1 == 'active'">Qoldiq summa</th>
                <th>Qaytarish sanasi</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in template1 == 'active'
                  ? loans_active
                  : loans_closed"
                :key="item"
              >
                <td>
                  {{ _.format(item.Loans.money) + " so'm" }}
                </td>
                <td v-if="template1 == 'active'">
                  {{ _.format(item.Loans.residual) + " so'm" }}
                </td>
                <td>{{ item.Loans.return_date }}</td>
                <td>
                  <router-link
                    :to="`/nasiya/${item.Loans.id}`"
                    class="btn btn-sm btn-outline-info"
                    data-dismiss="modal"
                  >
                    <i class="fa fa-info" />
                  </router-link>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="5">
                  <Pagination
                    :page="page"
                    :pages="pages"
                    :limit="limit"
                    @get="
                      template1 == 'active' ? getLoansActive : getLoansClosed
                    "
                  />
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </template>
    <template #footer>
      <button class="btn btn-outline-danger" data-dismiss="modal">
        <i class="far fa-circle-xmark"></i>
      </button>
    </template>
  </modal>
</template>

<script>
import { catchError, loans, loansCustomer } from "@/components/Api/api";
import Pagination from "@/components/Pagination/Pagination.vue";
export default {
  name: "Nasiyalar",
  components: { Pagination },
  emits: ["setloading"],
  data() {
    return {
      template: "active",
      template1: "active",
      _: Intl.NumberFormat(),
      branch_id: localStorage.getItem("branch_id"),
      customer: null,
      customer_search: "",
      customers_page: 0,
      customers_pages: 1,
      customers: [],
      page: 0,
      pages: 1,
      limit: 25,
      customers_active: {
        current_page: 0,
        pages: 1,
        limit: 25,
        data: [],
      },
      customers_closed: {
        current_page: 0,
        pages: 1,
        limit: 25,
        data: [],
      },
      loans_active: [],
      loans_closed: [],
      sum_residual: null,
      take_loan: {
        id: null,
        money: null,
        type: "naqd",
      },
    };
  },
  created() {
    this.getLoanCustomersActive(0, 25);
  },
  methods: {
    getLoanCustomersActive(page, limit) {
      this.$emit("setloading", true);
      loansCustomer(false, this.branch_id, page, limit)
        .then((Response) => {
          this.customers_active = Response.data;
          this.sum_residual = Response.data.sum_loan_residual;
          this.$emit("setloading", false);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getLoanCustomersClosed(page, limit) {
      this.$emit("setloading", true);
      loansCustomer(true, this.branch_id, page, limit)
        .then((Response) => {
          this.customers_closed = Response.data;
          this.sum_residual = Response.data.sum_loan_residual;
          this.$emit("setloading", false);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getLoansActive(page, limit) {
      this.$emit("setloading", true);
      let customer_id = this.customer ? this.customer.Customers.id : 0;
      loans(false, this.branch_id, customer_id, page, limit)
        .then((Response) => {
          this.page = Response.data.current_page;
          this.pages = Response.data.pages;
          this.limit = Response.data.limit;
          this.loans_active = Response.data.data;
          this.sum_residual = Response.data.sum_loan_residual;
          this.$emit("setloading", false);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getLoansClosed(page, limit) {
      this.$emit("setloading", true);
      let customer_id = this.customer ? this.customer.Customers.id : 0;
      loans(true, this.branch_id, customer_id, page, limit)
        .then((Response) => {
          this.page = Response.data.current_page;
          this.pages = Response.data.pages;
          this.limit = Response.data.limit;
          this.loans_closed = Response.data.data;
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
