<template>
  <div class="inventory-invoice">
  	<div class="p-t-b-24">
  		<div class="row p-l-r-15">
  			<h2 class="col-md-5">{{$t("inventoryInvoice.title")}}</h2>
  			<div class="col-md-7 text-right">
  				<button @click="print(1)" class="btn btn-orange">{{$t('button.export_one')}}</button>
          <button @click="print(2)" class="btn btn-fff">{{$t('button.export_all')}}</button>
  			</div>
  		</div>
  	</div>
  	<div class="p-l-r-15 m-t-20">
        <div class="search-wrapper">
          <div class="wrapper">
            <label>{{$t("inventoryInvoice.table.warehouse")}}：</label>
            <el-select v-model="fromData.warehouseId" :placeholder="$t('placeholder.warehouse')" @change="query()" >
            <el-option v-for="item in warehouses" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
            </el-select>
          </div>
          <div class="wrapper">
              <!-- <input v-model="fromData.sku" type="text" class="form-control" name="sku" :placeholder="$t('placeholder.sku')"> -->
              <el-input v-model="fromData.sku" name="sku" :placeholder="$t('placeholder.sku')"></el-input>
          </div>

            <div class="wrapper">
            <el-date-picker v-model="fromData.startDate" type="date" :placeholder="$t('placeholder.select_startDate')">
            </el-date-picker>
          </div>
          <div class="wrapper">
            <el-date-picker v-model="fromData.endDate" type="date" :placeholder="$t('placeholder.select_endDate')">
            </el-date-picker>
          </div>
          <button type="button" @click="search()" class="btn btn-000 search-btn">{{$t('button.search')}}</button>
          <form id="theform" target="_blank"></form>
      </div>
      <div class="table-responsive">
          <table class="table table-hover table-bordered table-striped">
              <thead>
                  <tr class="border">
                  	<th>{{$t("inventoryInvoice.table.warehouse")}}</th>
                    <th>{{$t("inventoryInvoice.table.businessCode")}}</th>
                    <th>SKU</th>
                    <th>{{$t("inventoryInvoice.table.skuName")}}</th>
                  	<th>{{$t("inventoryInvoice.table.type")}}</th>
                    <th>{{$t("inventoryInvoice.table.qty")}}</th>
                    <th>{{$t("inventoryInvoice.table.banlanceQty")}}</th>
                    <th>{{$t("inventoryInvoice.table.createDate")}}</th>
                  </tr>
              </thead>
              <tbody>
                  <tr class="border" v-for="(item, index) in list">
                      <td>{{warehouseMap[item.warehouseId].name}}</td>
                      <td>{{item.businessCode}}</td>
                      <td>{{item.sku}}</td>
                      <td>{{item.skuName}}</td>
                      <td>{{$tc("inbound."+item.type)}}</td>
                      <td>{{item.qty}}</td>
                      <td>{{item.banlanceQty}}</td>
                      <td>{{item.createAt}}</td>
                  </tr>
              </tbody>
          </table>
      </div>
  	</div>
   
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      layout="jumper, prev, pager, next, total, sizes"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
export default {
  props: {},
  components: {},
  data() {
    return {
      fromData: {
        warehouseId: "",
        timeZone: "",
        export: 0,
        startDate: "",
        endDate: "",
        status: "",
        sku: ""
      },
      ids: [],
      warehouses: [],
      warehouseMap: {},
      list: [],
      totalPage: 1,
      pageSize: 50,
      total: 0,
      currentPage: 1,
      pageSizes: [5, 10, 20, 50, 100]
    };
  },
  created: function() {
    this.queryWarehouse();

    let _this = this;
    this.query();
  },
  methods: {
    printCarton: function() {
      if (this.ids.length == 0) {
        layer.alert(this.$t("layer.selectOrder"), {
          icon: 5,
          title: this.$t("layer.tips"),
          btn: this.$t("button.ok")
        });
        return;
      }
      
      var url = jsRoutes.controllers.order.OrderController
        .printCartonLabel(this.ids, "100X100")
        .absoluteURL(global.routeSecure);
      window.open(url);
    },

    queryWarehouse() {
      let _this = this;
      let url = jsRoutes.controllers.photon.PhotonApiController.queryWarehouseByOrgOp();
      $.ajax({
        url: url.absoluteURL(global.routeSecure),
        type: url.type,
        async: false,
        xhrFields: {
          withCredentials: true
        },
        success: function(data) {
          if (data && data.length > 0) {
            _this.warehouses = data;
            var theWarehouse = _this.warehouses[0];
            _this.fromData.warehouseId = theWarehouse.id;
            _this.fromData.timeZone = theWarehouse.timeZone;
            $.each(_this.warehouses, function(i, e) {
              _this.warehouseMap[e.id] = e;
            });
          } else {
            _this.warehouses = [];
          }
        }
      });
    },

    handleSizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.query();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.query();
    },
    queryForm() {
      var _this = this;
      var timeZone = _this.warehouseMap[_this.fromData.warehouseId].timeZone;
      var formData = {
        warehouseId: _this.fromData.warehouseId,
        warehouseName: _this.warehouseMap[_this.fromData.warehouseId].name,
        timeZone: timeZone,
        export: _this.fromData.export,
        currentPage: _this.currentPage,
        pageSize: _this.pageSize,
        startDate: _this.formatDate(_this.fromData.startDate, "yyyy-MM-dd"),
        endDate: _this.formatDate(_this.fromData.endDate, "yyyy-MM-dd"),
        skus: _this.fromData.sku,
        type: 'FBA,FBA_RETURN'
      };
      return formData;
    },
    search(){
        this.currentPage = 1;
        this.fromData.export = 0;        
        this.query();
    },
    print(val){
        
        this.fromData.export = val;
        var form = this.queryForm();
        var html = '';
        for(var a in form){
            html += '<input type="hidden" name="'+a+'" value="'+form[a]+'" />'
        }
        $("#theform").html(html);
        $("#theform").attr("action", jsRoutes.controllers.inventory.InventoryrInvoiceController
          .queryInvoice()
          .absoluteURL(global.routeSecure));
        $("#theform")[0].submit();
    },
    query() {
      var _this = this;
      this.list = [];
      $.ajax({
        url: jsRoutes.controllers.inventory.InventoryrInvoiceController
          .queryInvoice()
          .absoluteURL(global.routeSecure),
        type: "get",
        data: _this.queryForm(),
        complete: function() {
          $.unblockUI;
        },
        xhrFields: {
          withCredentials: true
        },
        success: function(data) {
          if (data.success) {
            if (data.data.length > 0) {
              _this.list = data.data;
              _this.total = data.data[0].total;
            }
          } else {
            layer.msg(data.messages);
          }
        }
      });
    },
    formatDate(date, fmt) {
      if (!date) {
        return '';
      }
      var o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours() % 12 == 0 ? 12 : date.getHours() % 12, //小时
        "H+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
      };
      var week = {
        "0": "/u65e5",
        "1": "/u4e00",
        "2": "/u4e8c",
        "3": "/u4e09",
        "4": "/u56db",
        "5": "/u4e94",
        "6": "/u516d"
      };
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
      }
      if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[date.getDay() + ""]);
      }
      for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
      }
      return fmt;
    }
  }
};
</script>

<style lang="scss">
#popover {
  display: none;
  padding: 20px;
  .form-group {
    margin-bottom: 15px;
  }
  li + li {
    padding-top: 4px;
  }
}

</style>