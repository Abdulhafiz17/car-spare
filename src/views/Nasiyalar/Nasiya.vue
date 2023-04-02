<template>
  <h3>Nasiya</h3>
  <div class="row">
    <div class="col-md-4">
      <button
        class="btn btn-sm btn-block btn-outline-success"
        data-toggle="modal"
        data-target="#pay"
        v-if="!loan?.Loans.status"
      >
        <i class="fa fa-coins" /> Ushbu nasiya uchun pul olish
      </button>
    </div>
    <div class="col-md-4 my-1">
      <h5 v-if="loan?.Loans.residual">
        <span>Ushbu nasiya qoldig'i</span>
        <br />
        {{ _.format(loan?.Loans.residual) + " so'm" }}
      </h5>
    </div>
    <div class="col-md-4">
      <button
        class="btn btn-sm btn-block btn-outline-primary"
        data-toggle="modal"
        data-target="#order"
        @click="order_id = loan.Loans.order_id"
      >
        <i class="fa fa-info-circle" /> Nasiya buyurtmasi
      </button>
    </div>
  </div>
  <hr />

  <div class="responsive-y" style="max-height: 80vh">
    <table class="table table-sm table-hover">
      <thead>
        <tr>
          <th>Summa</th>
          <th>Hodim</th>
          <th>Sana</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in incomes" :key="item">
          <td>
            {{ _.format(item.Incomes.money) + " so'm " + item.Incomes.type }}
          </td>
          <td>{{ item.name }}</td>
          <td>{{ item.Incomes.time.replace("T", " ").substring(0, 16) }}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="3">
            <Pagination
              :page="page"
              :pages="pages"
              :limit="limit"
              @get="getIncomes"
            />
          </td>
        </tr>
      </tfoot>
    </table>
  </div>

  <div class="modal fade" id="order">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <Order
            :order_id="order_id"
            :branch-id="loan?.Loans?.branch_id"
            :order_template="'header'"
            @setloading="setloading"
          />
        </div>
        <div class="modal-body">
          <Order
            :order_id="order_id"
            :branch-id="loan?.Loans?.branch_id"
            :order_template="'body'"
            @setloading="setloading"
          />
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline-danger" data-dismiss="modal">
            <i class="far fa-circle-xmark" />
          </button>
        </div>
      </div>
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
                      <option value="click">click</option>
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
  incomes,
  loan,
  success,
  takeLoan,
} from "@/components/Api/api";
import Pagination from "../../components/Pagination/Pagination.vue";
import Order from "../../components/Template/Order.vue";
export default {
  name: "Nasiya",
  emits: ["setloading"],
  components: { Pagination, Order },
  data() {
    return {
      _: Intl.NumberFormat(),
      branch_id: localStorage.getItem("branch_id"),
      loan: null,
      page: 0,
      pages: 1,
      limit: 25,
      incomes: [],
      order_id: null,
      take_loan: {
        id: this.$route.params.id,
        money: null,
        type: "naqd",
      },
    };
  },
  created() {
    this.getLoan();
  },
  methods: {
    setloading(loading) {
      this.$emit("setloading", loading);
    },
    getLoan() {
      loan(0, this.$route.params.id)
        .then((Response) => {
          this.loan = Response.data;
          this.getIncomes(0, 25);
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
    getIncomes(page, limit) {
      this.$emit("setloading", true);
      incomes(this.$route.params.id, "loan", this.branch_id, page, limit)
        .then((Response) => {
          this.page = Response.data.current_page;
          this.pages = Response.data.pages;
          this.limit = Response.data.limit;
          this.incomes = Response.data.data;
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
          success(1).then(() => {
            this.take_loan = {
              id: this.$route.params.id,
              money: null,
              type: "naqd",
            };
            this.getLoan();
          });
        })
        .catch((error) => {
          this.$emit("setloading", false);
          catchError(error);
        });
    },
  },
};
</script>
