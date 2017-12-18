<template>
  <div>
  	<div class="p-t-b-24">
  		<div class="row p-l-r-15">
  			<h2 class="col-md-12">{{$t("transport.title")}}</h2>
  		</div>
  	</div>
  	<div class="p-l-r-15 m-t-20">
      <div class="search-wrapper">
        <div class="wrapper">
          <label>{{$t("stock.table.warehouse")}}：</label>
          <el-select v-model="warehouseId" :placeholder="$t('placeholder.warehouse')" @change="query()" >
            <el-option v-for="item in warehouses" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div class="wrapper">
          <label>{{$t("stock.table.status")}}：</label>
          <el-select v-model="status" :placeholder="$t('placeholder.status')" @change="query()" >
            <el-option v-for="item in statuslist" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="table-responsive">
          <table class="table table-hover table-bordered table-striped">
              <thead>
                  <tr class="border">
                  	<th>{{$t("stock.table.warehouse")}}</th>
                    <th>{{$t("inbound.table.orderID")}}</th>
                    <th>Shipment ID</th>
                    <th>Reference ID</th>
                    <th>{{$t("outbound.channels")}}</th>
                    <th>SKU</th>
                    <th>{{$t("inbound.unitsPerCase")}}</th>
                    <th>{{$t("inbound.numberOfCases")}}</th>
                    <th>{{$t("inbound.qty")}}</th>
                    <th>{{$t("transport.awb")}}</th>
                    <th width="10%">{{$t("plan.table.status")}}</th>
                  </tr>
              </thead>
              <tbody>
                  <tr class="border" v-for="(item, index) in list">
                      <td>{{warehouseMap[item.warehouseId].name}}</td>
                      <td>{{item.id}}</td>
                      <td>{{item.refNumber}}</td>
                      <td></td>
                      <td>快递/卡车</td>
                      <td><p v-for="item2 in item.details" class="tb-dashed">{{item2.sku}}</p></td>
                      <td><p v-for="item2 in item.details" class="tb-dashed">{{item2.unitsPerCase}}</p></td>
                      <td><p v-for="item2 in item.details" class="tb-dashed">{{item2.numberOfCases}}</p></td>
                      <td><p v-for="item2 in item.details" class="tb-dashed">{{item2.qty}}</p></td>
                      <td>
                        <p v-for="item3 in item.trackingNumbers">
                       <a href="javascript:void(0)" @click="getTracking(item3)">{{item3}}</a>
                        </p></td>
                      <td>{{item.status!=null?$tc("outbound."+item.status):""}}
                          <a href="javascript:void(0)" @click="popStatus(item)" >{{$tc("inbound.detail")}}</a>
                      </td>
                  </tr>
              </tbody>
          </table>
      </div>
  	</div>

      <!-- 弹窗2 -->
      <div id="popContainer2" class="block" style="padding:10px;display:none;">
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>{{$tc('inbound.time')}}</th>
                    <th>{{$tc('inbound.details')}}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item,index) in records">
                    <td>{{item.time}}</td>
                    <td>
                        {{$tc("outbound."+item.status)}}                        
                    </td>
                </tr>
            </tbody>
        </table>
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
      warehouseMap: {},
      warehouseId: "",
      status: "",
      timeZone: "",
      records: [],
      list: [],
      statuslist: [
        { id: "", name: this.$tc("main.all") },
        { id: "CONFIRMED", name: this.$tc("outbound.CONFIRMED") },
        { id: "DONE", name: this.$tc("outbound.DONE") },
        { id: "ERROR", name: this.$tc("outbound.ERROR") }
      ],
      totalPage: 1,
      pageSize: 50,
      total: 0,
      currentPage: 1,
      pageSizes: [5, 10, 20, 50, 100]
    };
  },
  created() {
    let _this = this;
    this.queryWarehouse();
    this.query();
  },
  methods: {
    getTracking(trackingNo) {
      var url =
        "https://www.fedex.com/apps/fedextrack/index.html?tracknumbers=" +
        trackingNo;
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
            _this.warehouseId = data[0].id;
            _this.timeZone = data[0].timeZone;
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
      var formData = {
        warehouseId: _this.warehouseId,
        timeZone: _this.timeZone,
        page: _this.currentPage,
        pageSize: _this.pageSize,
        status: _this.status,
        type: "FBA_TRANSPORT_OUTBOUND"
      };
      return formData;
    },
    query() {
      var _this = this;
      _this.timeZone = _this.warehouseMap[_this.warehouseId].timeZone;
      $.ajax({
        url: jsRoutes.controllers.fba.FbaInboundController
          .query()
          .absoluteURL(global.routeSecure),
        type: "get",
        data: _this.queryForm(),
        complete: function() {
          $.unblockUI;
        },
        contentType: "application/json",
        xhrFields: {
          withCredentials: true
        },
        success: function(data) {
          if (data.success) {
            _this.list = data.data.list;
            _this.total = data.data.total;
          }
        }
      });
    },
    popStatus(item) {
      layer.open({
        type: 1,
        title: "Order status",
        zIndex: 1001,
        area: ["600px", "460px"],
        shadeClose: true,
        content: $("#popContainer2")
      });
      var _this = this;
      var timeZone = _this.warehouseMap[_this.warehouseId].timeZone;
      _this.records = [];
      $.ajax({
        url: jsRoutes.controllers.fba.FbaInboundController
          .queryRecord(item.id, timeZone)
          .absoluteURL(global.routeSecure),
        type: "get",
        complete: function() {
          $.unblockUI;
        },
        xhrFields: {
          withCredentials: true
        },
        success: function(data) {
          if (data.success) {
            _this.records = data.data.list;
          }
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
