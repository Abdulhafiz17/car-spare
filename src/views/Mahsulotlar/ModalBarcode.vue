<template>
  <div class="modal fade" id="barcodeProduct">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-body d-flex justify-content-center">
          <div id="barcode">
            <div id="barcode-body"></div>
            <div id="barcode-footer"></div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline-primary" @click="printBarcode()">
            <i class="fa fa-print" />
          </button>
          <button class="btn btn-outline-danger" data-dismiss="modal">
            <i class="far fa-circle-xmark" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ModalBarcode",
  props: ["product_barcode"],
  emits: ["setloading"],
  computed: {
    product() {
      return this.$props.product_barcode;
    },
  },
  methods: {
    createBarcode() {},
    printBarcode() {},
  },
};
</script>

<style scoped>
#barcode {
  width: 6cm;
  height: 4cm;
  border: 1px solid rgb(0, 0, 0, 0.5);
}

#barcode #barcode-body {
  height: 2.5cm;
  border-bottom: 1px solid rgb(0, 0, 0, 0.5);
}

#barcode #barcode-footer {
  height: 1.5cm;
  border-top: 1px solid rgb(0, 0, 0, 0.5);
}
</style>
