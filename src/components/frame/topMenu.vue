<template>
  <ul class="nav navbar">
    <li v-for="(menu,index) in topMenu" :id="menu.id" :class="{checked: menu.id === currentRootPath}" @click="checkPath">
      <a v-if="menu.url == undefined">
        <span class="menu-text">{{menu.name}}</span>
      </a>
      <router-link v-else :to="menu.url">
        <span class="menu-text">{{menu.name}}</span>
      </router-link>
      <ul class="submenu" v-if="menu.url==undefined">
        <li v-for="sub in menu.sub_menus">
          <router-link :to="sub.url">{{sub.name}}</router-link>
        </li>
      </ul>
    </li>
  </ul>
</template>

<script>
export default {
  name: "top-menu",
  props: {
    topMenu: {
      type: Array
    }
  },
  data() {
    return {
      currentRootPath: ''
    };
  },
  // watch: {
  //   '$route.path' () {
  //     console.log(this.$route.path.split('/')[1])
  //   }
  // },
  created () {
    this.$nextTick(() => {
      this.checkPath()
    })
  },
  methods: {
    checkPath () {
      let rootPath = this.$route.path.split('/')[1]
      if (rootPath === '') {
        rootPath = 'inbound'
      }
      this.currentRootPath = rootPath
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

</style>
