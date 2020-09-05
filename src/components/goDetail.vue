<template>
  <div @click="handleclikc">
    <slot></slot>
  </div>
</template>

<script>
import { reactive, toRefs, onMounted } from "@vue/composition-api";
export default {
  props: ["sid"],
  setup(props, content) {
    // const stats = reactive({});

    const handleclikc = () => {
      content.root.$router.push({ name: "detail", params: { id: props.sid } });
    };
    return {
      // ...toRefs(stats),
      handleclikc
    };
  }
};
</script>

<style scoped lang="less">
</style>