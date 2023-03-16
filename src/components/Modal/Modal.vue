<template>
  <div class="modal fade" :id="modal_id">
    <div class="modal-dialog" :class="modal_size ? `modal-${modal_size}` : ``">
      <div class="modal-content">
        <div class="modal-header">
          <slot name="header" />
        </div>
        <div class="modal-body">
          <slot name="body" />
        </div>
        <div class="modal-footer">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "modal",
  props: {
    id: {
      type: String,
      required: true,
    },
    size: String,
  },
  data() {
    return {};
  },
  computed: {
    modal_id() {
      return this.$props.id;
    },
    modal_size() {
      return this.$props.size;
    },
  },
};
</script>
