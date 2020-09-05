<template>
  <div @click="handleclikc">
    <slot></slot>
  </div>
</template>

<script>
import { reactive, toRefs, onMounted } from "@vue/composition-api";
export default {
  props: ["sid", "bookId"],
  setup(props, content) {
    const handleclikc = () => {
      content.root.$router.push({
        name: "read",
        params: { bookId: props.bookId, id: props.sid }
      });
    };
    return {
      handleclikc
    };
  }
};
</script>

<style scoped lang="less">
</style>