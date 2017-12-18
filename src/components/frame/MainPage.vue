<template>
  <div class="main-content">
    <div class="main-page"  :class="{ 'bodyRight75':showNav == true }">
      <header>
        <gateway-header @get-json="getTopNavJson" @showNav-to="getShowNav"></gateway-header>
      </header>
      <gateway-main></gateway-main>
    </div>
    <footer>
      <div class="footer">
        {{$t("main.company")}}
      </div>
    </footer>
    <!--返回顶部按钮-->
    <div class="to-top" style="display: none;">
      <a href="#" :title="$t('main.toTop')" id="goBack" @click.prevent="backTop">{{$t("main.toTop")}}</a>
    </div>
  </div>
</template>

<script>
import gatewayHeader from "./header";
import gatewayMain from "./main";
import TopMenu from "./topMenu";
export default {
  data() {
    return {
      topNavJson: {},
      showNav: ""
    };
  },
  components: {
    gatewayHeader,
    gatewayMain,
    TopMenu
  },
  methods: {
    getTopNavJson(val) {
      this.topNavJson = val;
    },
    getShowNav(val) {
      this.showNav = val;
    }
  }
};
</script>

<style lang="scss" scoped>
//动画
.bodyRight75 {
  position: fixed;
  width: 100%;
  right: 75%;
  animation: right75 0.5s;
}
@keyframes right75 {
  from {
    right: 0;
  }
  to {
    right: 75%;
  }
}
.main-content {
  display: flex;
  flex-direction: column;
  .main-page {
    min-height: 93vh;
    min-height: calc(100vh - 60px);
    min-height: -webkit-calc(100vh - 60px);
    min-height: -moz-calc(100vh - 60px);
    padding-bottom: 100px;
  }
  footer {
    height: 60px;
    .footer {
      padding: 20px 0;
      background-color: #f3f3f3;
      border-top: 1px solid #ddd;
      font-size: 14px;
      color: #333;
      text-align: center;
    }
  }
}
</style>
