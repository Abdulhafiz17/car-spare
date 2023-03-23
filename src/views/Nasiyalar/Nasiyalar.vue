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
          getLoansActive(0, 25);
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
          getLoansClosed(0, 25);
        "
      >
        Yakunlangan
      </button>
    </li>
  </ul>

  <div class="tab-content pt-2">
    <div class="responsive-y" style="height: 70vh">
      <table class="table table-sm table-hover">
        <thead>
          <tr>
            <th>
              <div class="dropdown">
                <button
                  id="dropdownMenuButton"
                  type="button"
                  class="btn btn-sm btn-block btn-outline-primary dropdown-toggle"
                  data-toggle="dropdown"
                >
                  {{ customer ? customer.name : "Mijozlar" }}
                </button>
                <div
                  class="dropdown-menu w-100 mt-1"
                  aria-labelledby="dropdownMenuButton"
                >
                  <div
                    class="responsive-y scroll-customers"
                    style="max-height: 20vh"
                    @scroll="scrollCustomers()"
                  >
                    <input
                      type="search"
                      class="form-control form-control-sm mt-1"
                      v-model="customer_search"
                      @keyup="getCustomers(true)"
                    />
                    <button
                      type="button"
                      class="dropdown-item"
                      @click="
                        customer = null;
                        template == 'active'
                          ? getLoansActive(0, 25)
                          : getLoansClosed(0, 25);
                      "
                    >
                      {{ "Mijozlar" }}
                    </button>
                    <button
                      type="button"
                      class="dropdown-item"
                      v-for="item in customers"
                      :key="item"
                      @click="
                        customer = item;
                        template == 'active'
                          ? getLoansActive(0, 25)
                          : getLoansClosed(0, 25);
                      "
                    >
                      {{ item.name }}
                    </button>
                  </div>
                </div>
              </div>
            </th>
            <th>Nasiya summasi</th>
            <th v-if="template == 'active'">Qoldiq summa</th>
            <th>Qaytarish sanasi</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in template == 'active' ? loans_active : loans_closed"
            :key="item"
          >
            <td>{{ item.Customers.name }}</td>
            <td>
              {{ _.format(item.Loans.money) + " so'm" }}
            </td>
            <td v-if="template == 'active'">
              {{ _.format(item.Loans.residual) + " so'm" }}
            </td>
            <td>{{ item.Loans.return_date }}</td>
            <td>
              <div class="btn-group btn-group-sm">
                <button
                  v-if="template == 'active'"
                  class="btn btn-outline-success"
                  data-toggle="modal"
                  data-target="#pay"
                  @click="take_loan.id = item.Loans.id"
                >
                  <i class="fa fa-coins" />
                </button>
                <router-link
                  :to="`/nasiya/${item.Loans.id}`"
                  class="btn btn-outline-info"
                >
                  <i class="fa fa-info" />
                </router-link>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div class="modal fade" id="pay">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h4>Nasiya uchun pul olish</h4>
        </div>
        <form @submit.prevent="postLoan(take_loan)">
          <div class="modal-body">
            <div class="row gap-2">
              <div class="col-md-12">
                <div class="input-group input-group-sm">
                  <input
                    type="number"
                    min="0"
                    step="any"
                    class="form-control"
                    placeholder="summa"
                    required
                    v-model="take_loan.money"
                  />
                  <div class="input-group-text">so'm</div>
                  <div class="input-group-append">
                    <select
                      class="form-select form-select-sm"
                      required
                      v-model="take_loan.type"
                    >
                      <option value="naqd">naqd</option>
                      <option value="plastik">plastik</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline-primary">
              <i class="far fa-circle-check" />
            </button>
            <button class="btn btn-outline-danger" data-dismiss="modal">
              <i class="far fa-circle-xmark" />
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import {
  catchError,
  customers,
  loans,
  success,
  takeLoan,
} from "@/components/Api/api";
export default {
  name: "Nasiyalar",
  emits: ["setloading"],
  data() {
    return {
      template: "active",
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
    this.getCustomers();
  },
  methods: {
    getCustomers(search) {
      customers(this.customer_search, 0, 25)
        .then((Response) => {
          this.customers_page = 0;
          this.customers_pages = Response.data.pages;
          this.customers = Response.data.data;
          search ? false : this.getLoansActive(0, 25);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getLoansActive(page, limit) {
      this.$emit("setloading", true);
      let customer_id = this.customer ? this.customer.id : 0;
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
      let customer_id = this.customer ? this.customer.id : 0;
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
    postLoan(loan) {
      this.$emit("setloading", true);
      takeLoan(loan)
        .then((Response) => {
          success(0).then(() => {
            this.take_loan = {
              id: null,
              money: null,
              type: "naqd",
            };
            this.getLoansActive(0, 25);
          });
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    scrollCustomers() {
      let div = document.querySelector(".scroll-customers");
      if (div.scrollTop + div.clientHeight >= div.scrollHeight) {
        if (this.customers_page < this.customers_pages - 1) {
          customers("", this.customers_page + 1, 25)
            .then((Response) => {
              this.customers_page = Response.data.current_page;
              this.customers = this.customers.concat(Response.data.data);
            })
            .catch((error) => {
              this.$emit("setloading", false);
              catchError(error);
            });
        }
      }
    },
  },
};
</script>
