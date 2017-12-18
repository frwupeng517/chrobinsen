<template>
<div class="blank-content">
    <div class="blank-403">
        <div class="img">
            <img width="472" height="215" src="http://starpost-public-read.oss-cn-shenzhen.aliyuncs.com/403.png">
        </div>
        <h1 class="number">403</h1>
        <h2 class="sorry">对不起，您暂时没有权限访问该页面，请联系管理员！</h2>
        <h3 class="back"><a href="##" @click="loginout()">返回登录页>></a></h3>
    </div>
</div>
</template>
<script>
export default {
  methods: {
    loginout: function() {
      var r = jsRoutes.controllers.oauth.OAuthController.corsLogout(
        window.location.origin
      );
      window.location.href = r.absoluteURL(global.routeSecure);
    }
  }
};
</script>
<style scoped>
.blank-content {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background-color: #e8edfe;
  width: 100vw;
  height: 100vh;
}
.img {
  text-align: center;
}
.number {
  margin: 80px 0 30px 0;
  text-align: center;
  font-size: 155px;
  color: #525d83;
}
.sorry {
  margin-bottom: 30px;
  text-align: center;
  font-size: 23px;
  font-weight: 500;
  color: #6d748e;
  font-family: Microsoft Yahei, Arial, Helvetica, sans-serif;
}
.back {
  text-align: center;
  font-size: 19px;
  font-weight: 500;
  font-family: Microsoft Yahei, Arial, Helvetica, sans-serif;
}
.back a {
  color: #7491ff;
}
</style>