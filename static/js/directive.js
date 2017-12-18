/**
 * Created by wupeng on 2017/9/14.
 */
import Vue from 'vue'

const drag = Vue.directive('drag',{
  inserted: function (el) {
    let shelf = el
    shelf.onmousedown = function (ev) {
      var disX = ev.clientX - shelf.offsetLeft
      var disY = ev.clientY - shelf.offsetTop

      document.onmousemove = function (ev) {
        var l = ev.clientX - disX
        var t = ev.clientY - disY
        shelf.style.left = l + 'px'
        shelf.style.top = t + 'px'
      }
      document.onmouseup = function () {
        document.onmousemove = null
        document.onmouseup = null
      }
    }
  }
})

export {drag}
