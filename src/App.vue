<template>
  <div id="app">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

 <script type="text/ecmascript-6">
import * as Auth from "./components/util/auth";
export default {
  created() {},
  components: {
    Auth
  }
};
</script>
<style>
#app {
  overflow: hidden;
}
</style>
