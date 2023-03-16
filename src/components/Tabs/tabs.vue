<template>
  <div class="tab-buttons">
    <button
      v-for="(item, index) in tabs"
      :key="item"
      class="btn"
      :class="item == active_tab ? 'active' : ''"
      @click="
        active_tab = null;
        active_slot = null;
      "
      @click.passive="setTab(index)"
      :text="item"
      :name="[slots[index]]"
    >
      <span>{{ item }}</span>
    </button>
  </div>
  <div class="tab-slots">
    <div v-for="item in slots" :key="item">
      <slot :name="item" v-if="item == active_slot" />
    </div>
  </div>
</template>

<script>
export default {
  name: "tabs",
  props: ["tab_buttons", "tab_slots"],
  data() {
    return {
      active_tab: this.$props.tab_buttons[0],
      active_slot: this.$props.tab_slots[0],
    };
  },
  computed: {
    tabs() {
      return this.$props.tab_buttons;
    },
    slots() {
      return this.$props.tab_slots;
    },
  },
  methods: {
    setTab(index) {
      this.active_tab = this.tabs[index];
      this.active_slot = this.slots[index];
    },
  },
};
</script>

<style scoped>
.tab-buttons {
  display: flex;
  margin: 3px 0;
  padding: 3px;
  border-radius: 4px;
  background: whitesmoke;
  /* box-shadow: 0 0 50px 50px inset rgb(0, 0, 0, 0.3); */
}

.dark .tab-buttons {
  background: rgb(35, 38, 45);
}

button {
  position: relative;
  flex: 1 1 0;
  padding: 2px 5px;
  border: none;
  color: black;
}

button::before {
  content: "";
  position: absolute;
  top: 0;
  left: 50%;
  right: 50%;
  height: 100%;
  border-radius: 4px;
  background: rgb(13, 110, 253);
  transition: 0.3s all;
}

button.active::before {
  left: 0;
  right: 0;
}

button::after {
  content: attr(text);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

button.active::after {
  color: whitesmoke;
}

.tab-slots {
  padding-top: 4px;
}
</style>
