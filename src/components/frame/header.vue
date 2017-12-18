<template>
  <div class="header">
      <nav class="navbar navbar-default" :class="{'padding-logo': imgUrl !== ''}">
        <div class="container-fluid">
          <!-- 左侧 企业logo -->
          <div class="navbar-header">
            <button type="button" class="navbar-toggle menu-collapse" @click.prevent="toggleMenu">
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
            </button>
            <button type="button" class="navbar-toggle user-collapse" @click.prevent="toggleUser">
              <i class="fa fa-th-large" aria-hidden="true"></i>
            </button>
            <router-link class="navbar-brand" :to="'/'">
              <img :src="imgUrl" v-show="imgUrl !== ''">
              <!-- <img src="http://starpost-public-read.oss-cn-shenzhen.aliyuncs.com/chrobinsonec.png"> -->
            </router-link>
          </div>
          <!-- 中间 主菜单栏 -->
          <div class="navbar-menu">
            <top-menu :top-menu="menuJson"></top-menu>
          </div>
          <!-- 右侧 设置部分 -->
          <ul class="setup nav navbar-nav">
            <li>
              <a href="javascript:void(0)" @click="openUrl">{{$t("layer.noBusiness")}}</a>
            </li>
            <li class="dropdown">
              <a class="lang" href="" @click.stop.prevent="changeLangEvent">中文/EN</a>
            </li>
              <li class="dropdown">
              <!--切换组织   -->
              <a href="#" class="dropdown-toggle" data-toggle="dropdown">{{currentOrg.name}}</a>
              <ul class="dropdown-menu dropdown-caret orgination">
                <li v-for="org in profile.ownerOrgs">
                  <a @click="changeOrg(org.id)" href="javascript:void(0)">{{org.name}}</a>
                </li>
              </ul>
            </li>
            <li class="dropdown">
              <a href="#" class="dropdown-toggle" data-toggle="dropdown">{{profile.userName}}</a>
              <ul class="dropdown-menu dropdown-caret user-menu">
                <li>
                  <router-link to="/profile"><i class="fa fa-user" aria-hidden="true"></i>Profile</router-link>
                </li>
                <li>
                  <a @click.prevent="loginout()" href="#">
                    <span class="glyphicon glyphicon-off" aria-hidden="true"></span>{{$t("main.logout")}}</a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </nav>

      <!--弹层 选择运营组织-->
    <div id="chooseOperation" class="custom-box" v-show="init && currentOrg.name===''">
      <div class="custom-dialog">
        <div class="custom-content">
          <div class="custom-header">
            <p class="custom-logo"></p>
            <h4 class="custom-title">{{$t('main.selectOrg')}}</h4>
          </div>
          <div class="custom-body">
            <div class="form-group">
              <el-select v-model="selectedOrgId" filterable :placeholder="$t('main.selectOrg')">
                <el-option v-for="org in profile.ownerOrgs" :key="org.id" :label="org.name" :value="org.id">
                </el-option>
              </el-select>
            </div>
            <div class="button-group">
              <button type="button" class="btn btn-orange" @click.prevent="closeModel">{{$t('button.ok')}}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TopMenu from "./topMenu";
import $ from "jquery";
var param = null;
export default {
  data() {
    return {
      profile: {},
      currentOrg: { id: "", name: "" },
      currentTimezone: { id: "", name: "" },
      selectedOrgId: "",
      init: false,
      showNav: false,
      active: false,
      userName: "",
      imgUrl: "",
      menuJson: [],
      allMenuJson: []
    };
  },
  watch: {
    menuJson: {
      handler(val, oldVal) {
        this.$emit("get-json", val);
      }
    }
  },
  components: {
    TopMenu
  },
  created() {
    this.$nextTick(() => {
      this.getProfile()
      this._getUrl()
    })
    this.isUrl();
  },
  methods: {
    toggleMenu() {
      if ($('.setup').css('display') === 'block') {
        $('.setup').hide()
      }
      $('.navbar-menu').toggle()
    },
    toggleUser() {
      if ($('.navbar-menu').css('display') === 'block') {
        $('.navbar-menu').hide()
      }
      $('.setup').toggle()
    },
    // 根据罗宾逊和卖家成长的域名来获取对应的logo URL
     _getUrl () {
      const IMG = 'http://starpost-public-read.oss-cn-shenzhen.aliyuncs.com/'
      let url = window.location.hostname      
      // let str = 'https://chrobinsonec.starpost.cn/'
      // let url = 'chrobinsonec.starpost.cn'
      let company = url.split('.')[0]
      if (company === 'localhost') {
        return false
      }
      this.imgUrl = IMG + company + '.png'

     },
    getProfile() {
      let _this = this;
      $.ajax({
        type: "get",
        url: jsRoutes.controllers.oauth.OAuthController
          .profile()
          .absoluteURL(global.routeSecure),
        xhrFields: {
          withCredentials: true
        },
        success: function(data) {
          _this.allMenuJson = data.menus;
          let locale = _this.$i18n.locale;
          _this.profile = data;
          
          
          if (_this.profile.currentOrg !== null) {
            _this.currentOrg = _this.profile.currentOrg;
          }
          if (_this.profile.currentTimezone !== null) {
            _this.currentTimezone.id = _this.profile.currentTimezone;
            var options = _this.profile.timezoneOptions;
            for (var i = 0; i < options.length; i++) {
              if (options[i]._1 === _this.profile.currentTimezone) {
                _this.currentTimezone.name = options[i]._2;
                break;
              }
            }
          }
          
          if (data.menus &&
            _this.currentOrg &&
            _this.currentOrg.id &&
            _this.allMenuJson[locale][_this.currentOrg.id]) {
            for (let _menus of data.menus[locale][_this.currentOrg.id]) {
              if (_menus.id === "FBA") {
                _this.menuJson = _menus.sub_menus;
              }
            }
          }
          if (_this.currentOrg.id === "") {
            _this.init = true;
            return;
          }
          //console.log(_this.menuJson);
          //验证菜单
          if (_this.profile.currentOrg != null && data.menus == null) {
            _this.$router.push({ path: "/403" });
            return;
          } else if (data.menus == null) {
            _this.init = true;
            return;
          }
          if (_this.menuJson != null && _this.menuJson.length > 0) {
            _this.menuJson[0].active = true;
            _this.$router.push({ path: _this.menuJson[0].url });
          } else if (_this.menuJson.length == 0) {
            // layer.alert('请联系你的组织管理员分配权限', {icon: 5});
            _this.$router.push({ path: "/403" });
            return;
          }
          _this.init = true;
        }
      });
    },
    isUrl() {
        var host = window.location.hostname;
        if (host.indexOf(".cn?=") > -1) {
          param = host.split(".cn?=")[1];
        }
    },
    openUrl() {
      var host = window.location.hostname;
      host = host.split(".")[0];
      if (param == null) {
        if(host == 'fba'){
          window.open("https://fbs.starpost.cn?a=" + host);
        }else{
          window.open('https://'+host+'-fbs.starpost.cn?a=' + host);
        }
      } else {
        window.open("https://" + param + ".starpost.cn?a=" + host);
      }
    },
    // 前端界面切换中英文
    changeLangEvent() {
      let locale = this.$i18n.locale;
      locale === "zh"? (this.$i18n.locale = "en"): (this.$i18n.locale = "zh");
      this.getTopMenu(this.$i18n.locale);
      // this.getProfile()
    },
    closeModal() {
      this.currentOrg = this.selectedOrgId;
      this.isShowModel = true;
    },
    getTopMenu(locale) {

      //console.log(locale);
      let _this = this;
      for (let _menus of _this.allMenuJson[locale][_this.currentOrg.id]) {
        if (_menus.id === "FBA") {
          _this.menuJson = _menus.sub_menus;
        }
      }
      //console.log(_this.menuJson);
    },
    changeTimezone: function(timezone) {
      this.selectedTimezone = timezone;
      let _this = this;
      $.ajax({
        type: "POST",
        url: jsRoutes.controllers.oauth.OAuthController
          .changeTimezone(_this.selectedTimezone)
          .absoluteURL(global.routeSecure),
        xhrFields: {
          withCredentials: true
        },
        success: function(data) {
          _this.currentTimezone.id = data.currentTimezone;
          var options = _this.profile.timezoneOptions;
          for (var i = 0; i < options.length; i++) {
            if (options[i]._1 === data.currentTimezone) {
              _this.currentTimezone.name = options[i]._2;
              break;
            }
          }
          location.reload();
        }
      });
    },
    changeOrg: function(orgId) {
      this.selectedOrgId = orgId;
      let _this = this;
      $.ajax({
        type: "POST",
        url: jsRoutes.controllers.oauth.OAuthController
          .changeOrg(_this.selectedOrgId)
          .absoluteURL(global.routeSecure),
        xhrFields: {
          withCredentials: true
        },
        success: function(data) {
          _this.currentOrg = data.currentOrg;
          location.reload();
        }
      });
    },
    loginout: function() {
      var r = jsRoutes.controllers.oauth.OAuthController.corsLogout(
        window.location.origin
      );
      window.location.href = r.absoluteURL(global.routeSecure);
    },
    closeModel: function() {
      let _this = this;
      $.ajax({
        type: "POST",
        url: jsRoutes.controllers.oauth.OAuthController
          .changeOrg(_this.selectedOrgId)
          .absoluteURL(global.routeSecure),
        async: true,
        xhrFields: {
          withCredentials: true
        },
        success: function(data) {
          _this.currentOrg = data.currentOrg;
          this.isShowModal = false;
          window.location.reload();
        }
      });
    }
  }
};
</script>

<style lang="scss">
.header{
  .navbar{
    border: none !important;
    border-radius: 0 !important;
    margin-bottom: 0 !important;
  }
  .navbar-default{
    border-bottom: 2px solid #e7e7e7 !important;
  }
  .navbar-default .navbar-toggle:focus, 
  .navbar-default .navbar-toggle:hover{
    background-color: #fff;
  }
  // logo
  .navbar-header{
    @media (min-width: 768px) {
      min-height: 50px;
      display: flex;
      align-items: center;
    }
    @media (max-width: 767px) {
      padding-left: 15px;
      .navbar-toggle{
        float: left;
      }
      .user-collapse{
        float: right;
        padding: 5px 10px;
      }
      .navbar-brand{
        padding: 7px 15px;
      }
    }
    @media screen and (max-width: 1160px) {
      .menu-collapse{
        display: block !important;
      }
    }
    .navbar-brand{
      color: #fff;
      @media (min-width: 768px) {
        float: none;
        margin-left: 0;
        height: 100%;
        line-height: 100%;
        font-size: 100%;        
        padding: 0;
      }
    }
  }
  // 菜单栏
  .navbar-menu{
    @media (min-width: 1161px) {
      display: block !important;
      float: left;
      .nav{
        display: flex;
        flex-wrap: wrap;
        -webkit-flex-wrap:wrap;
        word-break: break-all;
      }
    }
    @media (min-width: 768px) and (max-width: 1160px) {
      display: none;
      margin-top: 50px;
      .nav li a{
        padding-left: 0;
      }
    }
    @media (max-width: 768px) {
      display: none;
    }
    .nav{
      li.checked a{
          background-color: #f8f8f8;
          .menu-text{
            color: orange;
          }
      }
      li a{
        height: 100%;
        line-height: 2;
      }
      .menu-text{
        font-size: 14px;
        font-weight: 700;
        color: #646464;
      }
      li{
        position: relative;
        &:hover{
          .submenu{
            display: block;
          }
        }
      }
      .submenu{
        display: none;
        position: absolute;
        border: 1px solid rgba(0,0,0,.15);
        background-color: #fff;
        background-clip: padding-box;
        border-radius: 4px;
        z-index: 300;
        li{
          a{
            display: block;
            padding: 5px 20px;
            height: 100%;
            line-height: 2;
            text-decoration: none;
            color: #646464;
            word-break: keep-all;
            white-space: nowrap;
            &:hover, &:focus{
              background-color: #f2f2f2;
            }
          }
        }
        @media screen and (max-width: 1160px) {
          position: static;
          display: block;
          border: none;
          border-radius: 0;
          z-index: 0;
        }
      }
    }
  }
  // 操作栏
  .setup{
    @media (max-width: 767px) {
      display: none;
    }
    @media (min-width: 768px) {
      display: block !important;
    }
    @media (min-width: 768px) and (max-width: 1160px){
      float: none;
      position: absolute;
      right: 15px;
      top: 0;
    }
    @media (min-width: 1161px){
      float: right;
    }
    li{
      a{
        font-size: 12px;
        font-weight: 700;
        .fa, .glyphicon{
          margin-right: 5px;
        }
      }
      .dropdown-menu>li>a{
        padding: 5px 20px;
        font-weight: 400;
        color: #646464;
        &:hover, &:focus{
          background-color: #f2f2f2;
        }
      }
      .dropdown-menu{
        min-width: 100px;
        max-height: 80vh;
        overflow: auto;
      }
    }
  }
}

#chooseOperation {
  background: rgba(0, 0, 0, 0.7);
  .custom-dialog {
    width: 500px;
    .custom-header h4 {
      text-align: left;
    }
    .custom-body {
      padding: 15px;
      .form-group .form-control {
        width: 100%;
      }
      .form-group .el-select{
        width: 100%;
      }
      .form-group .el-select .el-input__inner{
        height: 34px;
      }
      .button-group {
        padding: 0 15px;
        text-align: center;
        .btn {
          width: 100%;
          margin: 0;
          letter-spacing: 3px;
        }
      }
    }
  }
}
</style>
