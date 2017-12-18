<template>
    <div class="return-plan">
        <div class="p-t-b-24">
			<div class="row p-l-r-15">
				<h2 class="col-md-4">{{$t('plan.titleReturnOrder')}}</h2>
			</div>
		</div>
        <div class="p-l-r-15 m-t-20">
            <div class="search-wrapper">
                <div class="wrapper">
                    <label>{{$t("inventoryInvoice.table.warehouse")}}：</label>
                    <el-select v-model="warehouseId" :placeholder="$t('placeholder.warehouse')" @change="query()" >
                        <el-option v-for="item in warehouses" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <div class="table-responsive">
                <table class="table table-hover table-bordered table-striped">
                    <thead>
                        <tr class="border">
                            <th>{{$t("stock.table.warehouse")}}</th>
                            <th>Order ID</th>
                            <th>Shipment ID</th>
                            <th>FNSKU</th>
                            <th>New SKU</th>
                            <th>{{$t("plan.table.totalQty")}}</th> 
                            <th>{{$t("transport.awb")}}</th>
                            <th width="10%">{{$t("plan.table.status")}}</th>
                            <!-- <th>{{$t("plan.table.operating")}}</th> -->
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="border" v-for="(item, index) in list">
                            <td>{{warehouseMap[item.warehouseId].name}}</td>

                            <td>
                                <p class="tb-dashed">{{item.id}}</p>
                            </td>
                            <td><p class="tb-dashed">{{item.refNumber}}</p></td>
                            <td>
                                <p class="tb-dashed" v-for="(item2, index2) in item.details">{{item2.sku}}<br/></p>
                            </td>
                            <td>
                                <p class="tb-dashed" v-for="(item2, index2) in item.details">{{item2.fnsku}}<br/></p>
                            </td>
                            <td>
                                <p class="tb-dashed" v-for="(item2, index2) in item.details">{{item2.qty}}<br/></p>
                            </td>
                            <td>
                            <p v-for="item3 in item.trackingNumbers"> <a href="javascript:void(0)" @click="getTracking(item3)">{{item3}}</a></p>
                          </td>
                          <td>{{item.status!=null?$tc("outbound."+item.status):""}}
                              <a href="javascript:void(0)" @click="popStatus(item)" >{{$tc("inbound.detail")}}</a>
                          </td>
                            <!-- <td><p class="plan-btn-group">
                                <a href="#" role="button"  class="btn btn-def btn-sm">{{$t("plan.cancel")}}</a>
                                </p>
                            </td> -->
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
                        {{ $tc("outbound."+item.status)}}                        
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
    data () {
        return {
            list: [],
            warehouses: [],
            warehouseId: "",
            warehouseMap: {},
            status: "",
            timeZone: "",
            totalPage: 1,
            pageSize: 50,
            total: 0,
            currentPage: 1,
            pageSizes: [5, 10, 20, 50, 100],
            records: []
        }
    },
    created() {
        let _this = this;
        this.queryWarehouse();
        this.query();
    },
    methods: {
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
                type: "FBA_RETURNSTORAGE_OUTBOUND"
            };
            return formData;
        },
        queryWarehouse() {
            let _this = this;
            let url = jsRoutes.controllers.photon.PhotonApiController.queryWarehouseByOrgOp();
            $.ajax({
                url: url.absoluteURL(global.routeSecure),
                type: 'GET',
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
        queryForm() {
            var _this = this;
            var formData = {
                warehouseId: _this.warehouseId,
                timeZone: _this.timeZone,
                page: _this.currentPage,
                pageSize: _this.pageSize,
                status: _this.status,
                type: "FBA_RETURNSTORAGE_OUTBOUND"
            };
            return formData;
        },
        getTracking(trackingNo) {
        var url =
            "https://www.fedex.com/apps/fedextrack/index.html?tracknumbers=" +
            trackingNo;
        window.open(url);
        },
        popStatus(item) {
            layer.open({
                type: 1,
                title: "Order status",
                zIndex: 100,
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
}
</script>

<style lang="scss" scoped>

</style>


