<template>
  <div class="modal fade" id="returnProduct">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h4>
            {{
              product?.Trades?.product.category?.name +
              " - " +
              product?.Trades?.product?.product_type?.name +
              " - " +
              product?.Trades?.product?.product_type?.name2
            }}
          </h4>
        </div>
        <div class="modal-body">
          <div class="row text-left gap-2">
            <label class="col-md-12">
              Mahsulot miqdori
              <form
                @submit.prevent="putReturn(product_return)"
                id="form-return"
              >
                <div class="input-group input-group-sm">
                  <input
                    type="number"
                    min="0"
                    :max="product?.sum_quantity"
                    step="any"
                    class="form-control"
                    placeholder="miqdor"
                    required
                    v-model="product_return.quantity"
                  />
                  <div class="input-group-text">
                    {{ product?.Trades?.product?.olchov_birligi }}
                  </div>
                </div>
              </form>
            </label>
            <div class="col-md-12" v-if="loan?.total_loan_price">
              <div class="row">
                <div class="col-md-6">
                  <button
                    class="btn btn-sm btn-block"
                    :class="status ? 'btn-primary' : 'btn-outline-primary'"
                    @click="return_status = true"
                  >
                    Nasiyadan ayirish
                  </button>
                </div>
                <div class="col-md-6">
                  <button
                    class="btn btn-sm btn-block"
                    :class="status ? 'btn-outline-primary' : 'btn-primary'"
                    @click="return_status = false"
                  >
                    Faqat kassadan berish
                  </button>
                </div>
              </div>
            </div>
            <div class="col-md-12" v-if="loan?.total_loan_price">
              <span>
                Ushbu mijoz nasiyasi:
                <strong>
                  {{ $util.currency(loan.total_loan_price) + " so'm" }}
                </strong>
              </span>
            </div>
            <div class="col-md-12" v-if="status">
              <div class="p-2 border border-primary rounded">
                Joriy holatda quyida yozilgan summadan nasiya summasi ayiriladi
                !
              </div>
            </div>
            <div class="col-md-12">
              <div class="row">
                <label class="col-md-12">
                  Qaytarish summasi
                  <div class="input-group input-group-sm">
                    <input
                      type="number"
                      min="0"
                      step="any"
                      class="form-control"
                      placeholder="summa"
                      required
                      form="form-return"
                      v-model="product_return.price"
                    />
                    <div class="input-group-text">so'm</div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline-primary" form="form-return">
            <i class="far fa-circle-check" />
          </button>
          <button
            class="btn btn-outline-danger"
            data-dismiss="modal"
            close-return-product
          >
            <i class="far fa-circle-xmark" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { catchError, returnProduct, success } from "@/components/Api/api";
export default {
  name: "ModalReturnProduct",
  props: ["return_product", "return_status", "loan_residual"],
  emits: ["setloading", "clear"],
  data() {
    return {
      _: Intl.NumberFormat(),
      product_return: {
        trade_id: null,
        quantity: null,
        price: null,
      },
    };
  },
  computed: {
    product() {
      return this.$props.return_product;
    },
    status() {
      return this.$props.return_status;
    },
    loan() {
      return this.$props.loan_residual;
    },
  },
  watch: {
    product(product) {
      this.product_return.quantity = null;
      this.product_return.price = null;
    },
  },
  methods: {
    putReturn(product) {
      this.$emit("setloading", true);
      product.trade_id = this.product.Trades.id;
      returnProduct(product)
        .then((Response) => {
          success("close-return-product").then(() => {
            this.$emit("clear");
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
