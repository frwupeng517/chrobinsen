<template>
    <div class="return-plan">
        <div class="p-t-b-24">
			<div class="row p-l-r-15">
				<h2 class="col-md-4">{{$t('plan.titleReturn')}}</h2>
			</div>
		</div>
        <div class="p-l-r-15 m-t-20">
            <div class="search-wrapper">
                <div class="wrapper">
                    <label>{{$t("inventoryInvoice.table.warehouse")}}：</label>
                    <el-select v-model="warehouseId" :placeholder="$t('placeholder.warehouse')" @change="query()" >
                        <el-option 
                        v-for="item in warehouses" 
                        :key="item.id" 
                        :label="item.name" 
                        :value="item.id">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <div class="table-responsive">
                <table class="table table-hover table-bordered table-striped">
                    <thead>
                        <tr class="border">
                            <th  width="15%">{{$t("stock.table.warehouse")}}</th>
                            <th width="20%">FNSKU</th>
                            <th width="20%">New SKU</th>
                            <th width="10%">{{$t("plan.table.totalQty")}}</th> 
                            <th width="25%">{{$t("plan.table.operating")}}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="border" v-for="(item, index) in planData" >
                            <td>{{item.warehouseName}}</td>
                            <td>
                                <p v-for="(item, index) in item.items" class="tb-dashed">{{item.sku}}</p>
                            </td>
                            <td><p v-for="(item, index) in item.items" class="tb-dashed">{{item.newSku}}</p></td>
                            <td><p v-for="(item, index) in item.items" class="tb-dashed">{{item.number}}</p></td>
                            <td><p class="plan-btn-group">
                                <a href="#" v-show="false" role="button"  class="btn btn-def btn-sm" @click.stop.prevent="cancelPlan(item.outboundPlanCode)">{{$t("plan.cancel")}}</a>
                                <a href="#" v-show="item.status!=='WAIT'" role="button" class="btn btn-def btn-sm" @click.stop.prevent="downloadPackingList(item.outboundPlanCode)">{{$t("button.downloadPackingList")}}</a>
                                <a href="#" v-show="item.status!=='WAIT'" role="button" class="btn btn-def btn-sm" @click.stop.prevent="createOrder(item)">{{$t('plan.createOutboundOrder')}}</a>
                                </p>
                            </td>
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
        <!-- 生成退货订单 -弹窗 -->
        <form action="" method="get" target="_blank" id="myform">
      	</form>
        <div id="order-wrapper" style="display: none;">
            <div class="form-group clearfix">
                <div class="col-md-3">
                    <label>Shipment ID:</label>
                </div>
                <div class="col-md-9">
                    <input type="text" class="form-control" v-model.trim="outboundOrderFormData.shipmentId">
                </div>
            </div>
            <div class="form-group clearfix">
                <div class="col-md-3">
                    <label>Amazon Code:</label>
                </div>
                <div class="col-md-9">
                    <el-select  
                    v-model="selectedCode"  
                    clearable 
                    filterable 
                    placeholder="Please choose Amazon Code" 
                    @change="getAddress">
                        <el-option 
                        v-for="(code, index) in codes" 
                        :key="index" 
                        :label="code" 
                        :value="code">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <div class="form-group clearfix">
                <div class="col-md-3">
                    <label>Country:</label>
                </div>
                <div class="col-md-9">
                    <input type="text" class="form-control" v-model.trim="outboundOrderFormData.country">
                </div>
            </div>
            <div class="form-group clearfix">
                <div class="col-md-3">
                    <label>State:</label>
                </div>
                <div class="col-md-9">
                    <input type="text" class="form-control" v-model.trim="outboundOrderFormData.state">
                </div>
            </div>
            <div class="form-group clearfix">
                <div class="col-md-3">
                    <label>City:</label>
                </div>
                <div class="col-md-9">
                    <input type="text" class="form-control" v-model.trim="outboundOrderFormData.city">
                </div>
            </div>
            <div class="form-group clearfix">
                <div class="col-md-3">
                    <label>Address:</label>
                </div>
                <div class="col-md-9">
                    <input type="text" class="form-control" v-model.trim="outboundOrderFormData.address">
                </div>
            </div>
            <div class="form-group clearfix">
                <div class="col-md-3">
                    <label>Postal Code:</label>
                </div>
                <div class="col-md-9">
                    <input type="text" class="form-control" v-model.trim="outboundOrderFormData.postalCode">
                </div>
            </div>
            <div class="form-group clearfix">
                <div class="col-md-3">
                    <label>Box standard PDF:</label>
                </div>
                <div class="col-md-9">
                    <input type="file" id="uploadFile" name="uploadFile" accept=".pdf" value="uploadFile" @change="getUploadFileName" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            list: [],
            warehouses: [],
            codes: [],
            warehouseId: "",
            warehouseMap: {},
            selectedCode: '',
            timeZone: "",
            totalPage: 1,
            pageSize: 50,
            total: 0,
            currentPage: 1,
            pageSizes: [5, 10, 20, 50, 100],
            status: "NEW,WAIT",
            planData: [],
            uploadFile: "",
            outboundOrderFormData: {
                shipmentId: "",
                address: "",
                city: "",
                state: "",
                country: "",
                postalCode: "",
                userName: "",
                phone: ""
            },
        }
    },
    created () {
        this.queryWarehouse();
        this.queryOutboundPlan();
        this._queryWarehouseAddress();
    },
    methods: {
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
                    _this.warehouseId = _this.warehouses[0].id;
                    _this.timeZone = _this.warehouses[0].timeZone;
                    $.each(_this.warehouses, function(i, e) {
                    _this.warehouseMap[e.id] = e;
                    });
                } else {
                    _this.warehouses = [];
                }
                }
            });
         },
         queryOutboundPlan() {
            let _this = this;
            $.ajax({
                url: jsRoutes.controllers.outboundplan.OutboundPlanController
                .queryOutboundPlan()
                .absoluteURL(global.routeSecure),
                type: "get",
                data: {
                    warehouseId: _this.warehouseId,
                    status: _this.status,
                    page: _this.currentPage,
                    pageSize: _this.pageSize,
                    type: 'FBA_RETURN'
                },
                contentType: "application/json",
                xhrFields: {
                withCredentials: true
                },
                success: function(data) {
                 console.info(data);
                if (data.success) {
                    if (data.data.length > 0) {
                    _this.planData = data.data;
                    _this.total = data.data[0].total;
                    } else {
                    _this.planData = [];
                    }
                } else {
                    layer.msg(data.message);
                }
                }
            });
        },
        cancelPlan(planCode) {
            let _this = this;
            let url = jsRoutes.controllers.outboundplan.OutboundPlanController.cancelPlan();
            $.ajax({
                url: url.absoluteURL(global.routeSecure),
                type: url.type,
                data: {
                    planCode: planCode
                },
                xhrFields: {
                withCredentials: true
                },
                success: function(data) {
                if (data.success) {
                    layer.msg(_this.$t("layer.succ"));
                    _this.queryOutboundPlan();
                } else {
                    layer.msg(data.message);
                }
                }
            });
        },
        downloadPackingList(data) {
            let _this = this;
            var planData = _this.planData;
            var url = jsRoutes.controllers.outboundplan.OutboundPlanController
                .downloadPackingList(data)
                .absoluteURL(global.routeSecure);
            $("#myform").attr("action", url);
            $("#myform").html("");
            var fhtml = "";
            $.each(planData, function(key, val) {
                fhtml +=
                '<input type="hidden" name="' + key + '" value="' + val + '" />';
            });
            $("#myform").html(fhtml);
            $("#myform")[0].submit();
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
                type: "FBA_REPLENISHMENT_OUTBOUND"
            };
            return formData;
        },
        // 打开生成退货订单弹窗
        createOrder (item) {
            let _this = this;
            layer.open({
                type: 1,
                title: '生成退货订单(Generate a return order)',
                area: ["600px", "650px"],
                zIndex: 100,
                closeBtn: 0,
                btn: [this.$t("button.ok"), this.$t("button.cancel")],
                content: $("#order-wrapper"),
                  yes: function(index, layero) {
                    if (!item.outboundPlanCode || item.outboundPlanCode === "") {
                        layer.msg(
                        "系统出货计划ID为空，无法出货！(System 'Plan ID' is empty,can not creating outbound order!)"
                        );
                        return false;
                    }
                    if (
                        !_this.outboundOrderFormData.shipmentId ||
                        _this.outboundOrderFormData.shipmentId.length == 0
                    ) {
                        layer.msg("'FBA SHIPMENT ID' Is required");
                        return false;
                    }
                    if (
                        !_this.outboundOrderFormData.address ||
                        _this.outboundOrderFormData.address.length == 0
                    ) {
                        layer.msg("'Address' Is required");
                        return false;
                    }
                    if (
                        !_this.outboundOrderFormData.city ||
                        _this.outboundOrderFormData.city.length == 0
                    ) {
                        layer.msg("'City' Is required");
                        return false;
                    }
                    if (
                        !_this.outboundOrderFormData.state ||
                        _this.outboundOrderFormData.state.length == 0
                    ) {
                        layer.msg("'State' Is required");
                        return false;
                    }
                    if (
                        !_this.outboundOrderFormData.country ||
                        _this.outboundOrderFormData.country.length == 0
                    ) {
                        layer.msg("'Country' Is required");
                        return false;
                    }
                    if (
                        !_this.outboundOrderFormData.postalCode ||
                        _this.outboundOrderFormData.postalCode.length == 0
                    ) {
                        layer.msg("'Postal code' Is required");
                        return false;
                    }
                    if (!$("#uploadFile").val()) {
                        layer.msg(_this.$t('layer.selectFile'));
                        return false;
                    }

                    _this.outboundOrderFormData.userName = "Amazon warehouse";
                    _this.outboundOrderFormData.phone = _this.warehouseMap[item.warehouseId] ? _this.warehouseMap[item.warehouseId].phone : "";

                    var imgFiles = $("#uploadFile")[0].files;
                    var formData = new FormData();
                    for (var i = 0; i < imgFiles.length; i++) {
                        formData.append("uploadFile", imgFiles[i]);
                    }
                    formData.append("outboundPlanCode", item.outboundPlanCode);
                    formData.append("shipmentId", _this.outboundOrderFormData.shipmentId);
                    formData.append("address", _this.outboundOrderFormData.address);
                    formData.append("city", _this.outboundOrderFormData.city);
                    formData.append("state", _this.outboundOrderFormData.state);
                    formData.append("country", _this.outboundOrderFormData.country);
                    formData.append("postalCode", _this.outboundOrderFormData.postalCode);
                    formData.append("phone", _this.outboundOrderFormData.phone);
                    formData.append("userName", _this.outboundOrderFormData.userName);
                    formData.append("warehouseId", item.warehouseId);
                    formData.append("isFba", "true");     
                
                    let url = jsRoutes.controllers.outboundplan.OutboundPlanController.createOrderChangelabelPlan();
                    $.ajax({
                        url: url.absoluteURL(global.routeSecure),
                        method: url.type,
                        data: formData,
                        xhrFields: {
                        withCredentials: true
                        },
                        cache: false,
                        contentType: false,
                        processData: false,
                        success: function(data) {
                        if (data.success) {
                            layer.msg(_this.$t("layer.succ"), function() {
                            _this.outboundOrderFormData.shipmentId = "";
                            _this.outboundOrderFormData.address = "";
                            _this.outboundOrderFormData.city = "";
                            _this.outboundOrderFormData.state = "";
                            _this.outboundOrderFormData.country = "";
                            _this.outboundOrderFormData.postalCode = "";
                            _this.outboundOrderFormData.phone = "";
                            _this.outboundOrderFormData.userName = "";
                            layer.closeAll();
                            _this.queryOutboundPlan();
                            return true;
                            });
                        } else {
                            layer.alert(data.message);
                            return false;
                        }
                        }
                    });
                    },
                    btn2: function(index, layero) {
                    _this.outboundOrderFormData.shipmentId = "";
                    _this.outboundOrderFormData.address = "";
                    _this.outboundOrderFormData.city = "";
                    _this.outboundOrderFormData.state = "";
                    _this.outboundOrderFormData.country = "";
                    _this.outboundOrderFormData.postalCode = "";
                    _this.outboundOrderFormData.phone = "";
                    _this.outboundOrderFormData.userName = "";
                    }
                });
        },
        getUploadFileName: function(event) {
            let fileName = $(event.target)
                .val()
                .split("\\");
            this.uploadFile = fileName[fileName.length - 1];
        },
        // 获取code 后更新地址
        getAddress () {
            if (this.selectedCode) {
                let _this = this;
                $.ajax({
                    url: jsRoutes.controllers.fba.WarehouseAddressController
                    .queryWarehouseAddress(_this.selectedCode)
                    .absoluteURL(global.routeSecure),
                    type: "get",
                    //contentType: "application/json",
                    xhrFields: {
                    withCredentials: true
                    },
                    success: function(data) {

                    console.debug(data);
                    _this.outboundOrderFormData.country = 'US'
                    _this.outboundOrderFormData.state = data.data.state
                    _this.outboundOrderFormData.city = data.data.city
                    _this.outboundOrderFormData.address = data.data.address
                    _this.outboundOrderFormData.postalCode = data.data.postCode
                    }
                });
            }
        },
        _queryWarehouseAddress() {
            let _this = this;
            $.ajax({
                url: jsRoutes.controllers.fba.WarehouseAddressController
                .queryWarehouseCode()
                .absoluteURL(global.routeSecure),
                type: "get",
                //contentType: "application/json",
                xhrFields: {
                withCredentials: true
                },
                success: function(data) {

                console.log(data);
                _this.codes = data.data;
                //_this.countries.unshift({ code: "", name: "" });
                }
            });
        },
        handleSizeChange(val) {
            let _this = this;
            console.log(`每页 ${val} 条`);
            _this.pageSize = val;
            this.queryOutboundPlan();
        },
        handleCurrentChange(val) {
            let _this = this;
            console.log(`当前页: ${val}`);
            _this.currentPage = val;
            this.queryOutboundPlan();
        },
    }
}
</script>

<style lang="scss" scoped>
#order-wrapper {
  display: none;
  padding: 20px;
  .form-group {
    margin-bottom: 15px;
  }
  .el-select{
    width: 100%;
  }
  .el-input__inner{
    border-color: #d9d9d9;
  }
}
.plan-btn-group .btn {
  margin-top: 5px;
}
</style>


