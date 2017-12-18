import Vue from 'vue'
import Router from 'vue-router'
import MainPage from '@/components/frame/MainPage'
import Home from '@/components/InboundForecast/InboundForecast'
import TransshipmentOutbound from '@/components/TransshipmentOutbound/TransshipmentOutbound'
import stock from '@/components/stock/stock'
import InventoryInvoice from '@/components/stock/inventoryInvoice'
import Replenishment from '@/components/replenishment/replenishment'
import shippingPlan from '@/components/replenishment/shippingPlan'
import shippingOrder from '@/components/replenishment/shippingOrder'
import Label from '@/components/changeLabel/label'
import ReturnPlan from '@/components/changeLabel/plan'
import ReturnOrder from '@/components/changeLabel/order'
import Forbidden from '@/components/403'
import Profile from '@/components/profile'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: __dirname,
  routes: [
    {
      path: '/',
      component: MainPage,
      children: [
        { path: '/', name: '入库预报', component: Home },
        { path: 'label', name: '退货换标', component: Label,
          children: [
            { path: 'return-plan', name: '退货计划', component: ReturnPlan },
            { path: 'return-order', name: '退货订单', component: ReturnOrder }
          ]
        },
        { path: 'replenishment', name: '补货', component: Replenishment,
          children: [
            { path: 'plan', name: '补货计划', component: shippingPlan },
            { path: 'order', name: '补货订单', component: shippingOrder }
          ]
        },
        { path: 'outbound', name: '转运出库', component: TransshipmentOutbound},
        { path: 'stock', name: '库存', component: stock },
        { path: 'inventory-invoice', name: '进销存', component: InventoryInvoice },
        { path: '403', name: '403', component: Forbidden },
        { path: 'profile', name: '个人中心', component: Profile }
      ]
    }
  ]
})