<template>
  <h3>Nasiyalar</h3>
  <div class="row">
    <div class="col-md-4"></div>
    <div class="col-md-4 my-1 text-center">
      Umumiy nasiya
      <strong>{{ $util.currency(sum_residual) + " so'm" }}</strong>
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
            <span>{{ $util.currency(item.sum_loan_price) + " so'm" }}</span>
          </div>
          <button
            class="btn btn-sm btn-info"
            data-toggle="modal"
            data-target="#loans"
            @click="
              customer = item;
              template1 = 'active';
              loans = [];
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
        <strong>{{
          $util.currency(customer?.sum_loan_price) + " so'm"
        }}</strong>
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
              loans = [];
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
              loans = [];
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
                <th>
                  <input
                    type="checkbox"
                    :checked="
                      template1 == 'active'
                        ? loans.length == loans_active.length
                        : loans.length == loans_closed.length
                    "
                    @change="
                      $event.target.checked
                        ? (loans =
                            template1 == 'active' ? loans_active : loans_closed)
                        : (loans = [])
                    "
                  />
                </th>
                <th>Nasiya summasi</th>
                <th v-if="template1 == 'active'">Qoldiq summa</th>
                <th>Olingan sana</th>
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
                <td><input type="checkbox" v-model="loans" :value="item" /></td>
                <td>
                  {{ $util.currency(item.Loans.money) + " so'm" }}
                </td>
                <td v-if="template1 == 'active'">
                  {{ $util.currency(item.Loans.residual) + " so'm" }}
                </td>
                <td>
                  {{ item.Loans.order.time.replace("T", " ").substring(0, 10) }}
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
                <td colspan="6">
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
      <div v-if="loans.length">
        <strong>{{ $util.currency(sum_price) }}</strong> so'm
      </div>
      <button
        v-if="loans.length"
        class="btn btn-outline-primary"
        data-dismiss="modal"
        data-toggle="modal"
        data-target="#pay"
      >
        <i class="far fa-circle-check"></i> Yakunlash
      </button>
      <button class="btn btn-outline-danger" data-dismiss="modal">
        <i class="far fa-circle-xmark"></i>
      </button>
    </template>
  </modal>

  <div class="modal fade" id="pay" data-backdrop="static">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h4>Nasiya uchun pul olish</h4>
          <span>
            <strong>{{ $util.currency(sum_price) }}</strong> so'm
          </span>
        </div>
        <form @submit.prevent="postLoan()">
          <div class="modal-body">
            <div class="row gap-1">
              <div class="col-12">
                <div class="input-group input-group-sm">
                  <input
                    type="number"
                    min="0"
                    step="any"
                    class="form-control"
                    placeholder="summa"
                    required
                    disabled
                    v-model="sum_price"
                  />
                  <div class="input-group-text">so'm</div>
                  <div class="input-group-append">
                    <select
                      class="form-select form-select-sm"
                      required
                      v-model="payment_type"
                    >
                      <option hidden value="">to'lov turi</option>
                      <option
                        v-for="item1 in payment_types"
                        :key="item1"
                        :value="item1"
                      >
                        {{ item1 }}
                      </option>
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
            <button
              type="button"
              class="btn btn-outline-danger"
              data-dismiss="modal"
              data-toggle="modal"
              data-target="#loans"
            >
              <i class="far fa-circle-xmark" />
            </button>
            <button
              v-show="false"
              data-dismiss="modal"
              close-payment-modal
            ></button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import {
  catchError,
  loans,
  loansCustomer,
  success,
  takeLoan,
} from "@/components/Api/api";
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
      loans: [],
      payment_types: ["naqd", "plastik", "click"],
      payment_type: "",
    };
  },
  computed: {
    sum_price() {
      let price = 0;
      this.loans.forEach((item) => {
        price += item.Loans.residual;
      });
      return price;
    },
    check() {
      let loan = 0,
        payment = 0;
      this.loans.forEach((item) => {
        loan += item.Loans.residual;
      });
      this.moneys.forEach((item) => {
        payment += item.money;
      });
      if (loan == payment) return true;
      else return false;
    },
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
    postLoan() {
      this.$emit("setloading", true);
      let sum = this.sum_price,
        data = [];
      this.loans.forEach((item, i) => {
        data.push({
          id: item.Loans.id,
          money: item.Loans.residual,
          type: this.payment_type,
        });
        sum = sum - item.Loans.residual;
        if (i == this.loans.length - 1) {
          takeLoan(data)
            .then((Response) => {
              success("close-payment-modal").then(() => {
                this.loans = [];
                this.payment_type = "";
                this.template = "active";
                this.getLoanCustomersActive();
              });
            })
            .catch((error) => {
              this.$emit("setloading", false);
              catchError(error);
            });
        }
      });
    },
  },
};
</script>
