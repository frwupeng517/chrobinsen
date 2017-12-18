<template>
	<div>
		<div class="p-t-b-24">
			<div class="row p-l-r-15">
				<h2 class="col-md-12">{{$t("plan.title")}}</h2>
			</div>
		</div>
	  	<div class="p-l-r-15 m-t-20">
          <div class="search-wrapper">
            <div class="wrapper">
              <label>{{$t("inventoryInvoice.table.warehouse")}}：</label>
              <el-select v-model="fromData.warehouseId" :placeholder="$t('placeholder.warehouse')" @change="queryOutboundPlan()" >
                <el-option v-for="item in warehouses" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="table-responsive">
              <table class="table table-hover table-bordered table-striped">
                  <thead>
	                  <tr class="border">
	                  	<th  width="15%">{{$t("stock.table.warehouse")}}</th>
	                  	<th width="20%">{{$t("plan.table.sku")}}</th>
	                  	<th width="15%">{{$t("inbound.numberOfCases")}}</th>
						          <th width="15%">{{$t("plan.table.unitsOfCase")}}</th>
						          <th width="10%">{{$t("plan.table.totalQty")}}</th> 
	                  	<th width="25%">{{$t("plan.table.operating")}}</th>
	                  </tr>
                  </thead>
                  <tbody>
	                  <tr class="border" v-for="(item, index) in planData">
	                  	  <td>{{item.warehouseName}}</td>
	                      <td>
                          <p v-for="(item, index) in item.items" class="tb-dashed">{{item.sku}}</p>
                        </td>
	                      <td><p v-for="(item, index) in item.items" class="tb-dashed">{{item.numberOfCases}}</p></td>
                        <td><p v-for="(item, index) in item.items" class="tb-dashed">{{item.unitsPerCase}}</p></td>
                        <td><p v-for="(item, index) in item.items" class="tb-dashed">{{item.qty}}</p></td>
	                      <td><p class="plan-btn-group">
	                      	<a href="#" role="button" v-show="item.status=='NEW'" class="btn btn-def btn-sm" @click.stop.prevent="cancelPlan(item.outboundPlanCode)">{{$t("plan.cancel")}}</a>
	                      	<a href="#" role="button" class="btn btn-def btn-sm" @click.stop.prevent="downloadPackingList(item.outboundPlanCode)">{{$t("button.downloadPackingList")}}</a>
	                      	<a href="#" role="button" v-show="item.status!='DONE'" class="btn btn-def btn-sm" @click.stop.prevent="addOder(item)">{{$t("button.createShippingOrder")}}</a>
	                      	</p>
	                      </td>
	                  </tr>
                  </tbody>
              </table>
          </div>
		  <form action="" method="get" target="_blank" id="myform">
      	</form>
	  	</div>
	  		<!-- 弹窗 -->
	  		<div id="popover">
	  			<div class="form-group row">
	  			    <label class="col-sm-3" style="padding-top: 7px;">SHIPMENT ID：</label>
	  			    <div class="col-sm-9"><input type="text" class="form-control" v-model.trim="outboundOrderFormData.shipmentId" ></div>
	  			</div>
          <div class="form-group row">
	  			    <label class="col-sm-3" style="padding-top: 7px;">Amazon Code：</label>
	  			    <div class="col-sm-9">
                <el-select  v-model="selectedCode"  clearable filterable placeholder="请选择Amazon Code" @change="getAddress">
                  <el-option v-for="(code, index) in codes" :key="index" :label="code" :value="code">
                  </el-option>
                </el-select>
              </div>
	  			</div>
	  			<div class="form-group row">
	  			    <label class="col-sm-3" style="padding-top: 7px;">Country：</label>
	  			    <div class="col-sm-9">
                <input type="text" class="form-control" v-model.trim="outboundOrderFormData.country">
              </div>
	  			</div>
	  			<div class="form-group row">
	  			    <label class="col-sm-3" style="padding-top: 7px;">State：</label>
	  			    <div class="col-sm-9">
                <input type="text" class="form-control" v-model.trim="outboundOrderFormData.state">
              </div>
	  			</div>
	  			<div class="form-group row">
	  			    <label class="col-sm-3" style="padding-top: 7px;">City：</label>
	  			    <div class="col-sm-9"><input type="text" class="form-control" v-model.trim="outboundOrderFormData.city"></div>
	  			</div>
	  			<div class="form-group row">
	  			    <label class="col-sm-3" style="padding-top: 7px;">Address：</label>
	  			    <div class="col-sm-9"><input type="text" class="form-control" v-model.trim="outboundOrderFormData.address"></div>
	  			</div>
	  			<div class="form-group row">
	  			    <label class="col-sm-3" style="padding-top: 7px;">Postal code：</label>
	  			    <div class="col-sm-9"><input type="text" class="form-control" v-model.trim="outboundOrderFormData.postalCode"></div>
	  			</div>
	  			<!-- <div class="form-group row">
	  			    <label class="col-sm-3" style="padding-top: 7px;">User name：</label>
	  			    <div class="col-sm-9"><input type="text" class="form-control" v-model.trim="outboundOrderFormData.userName"></div>
	  			</div>
	  			
	  			<div class="form-group row">
	  			    <label class="col-sm-3" style="padding-top: 7px;">Phone：</label>
	  			    <div class="col-sm-9"><input type="text" class="form-control" v-model.trim="outboundOrderFormData.phone"></div>
	  			</div> -->
	  			<div class="form-group row">
	  			    <label class="col-sm-3" style="padding-top: 7px;">{{$t("layer.cartonLabel")}}：</label>
	  			    <div class="col-sm-9"><input type="file" id="uploadFile" name="uploadFile" accept=".pdf" value="uploadFile" @change="getUploadFileName"></div>
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
  created() {
    this.queryWarehouse();
    this.loadCountry();
    this.queryOutboundPlan();
    this._initWarehouse();
    this._queryWarehouseAddress();
  },
  components: {},
  data() {
    return {
      planData: [],
      logisticProduct: [{}],
      selectedCode: '',
      datas: [
        {code: '10086', warehouse: {state: 'hubei', city: 'wuhan', address: 'zhongbeilu no.1', postalCode: '518526'}},
        {code: '10010', warehouse: {state: 'guangdong', city: 'shenzhen', address: 'banxuegang da dao', postalCode: '518520'}},
        {code: '10000', warehouse: {state: 'sichuan', city: 'chengdu', address: 'leshan lu', postalCode: '52500'}}
      ],
      codes: [],
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
      countries: [],
      provinces: [],
      pdfFile: "",
      uploadFile: "",
      status: "NEW",
      pageSize: 5,
      total: 0,
      currentPage: 1,
      pageSizes: [5, 10, 20, 50, 100],
      fromData: {
        warehouseId: "",
        timeZone: "",
        export: 0,
        startDate: "",
        endDate: "",
        status: ""
      },
      warehouseMap: {},
      warehouses: []
    };
  },
  methods: {
    _queryWarehouseAddress () {
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
          _this.codes = data.data;
          //_this.countries.unshift({ code: "", name: "" });
        }
      });
    },
      // 获取Amazon code 集合
    _initWarehouse () {
      if (this.datas) {
        this.datas.forEach((data, index) => {
          this.codes.push(data.code)
        })
      }
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

          _this.outboundOrderFormData.country = 'US'
          _this.outboundOrderFormData.state = data.data.state
          _this.outboundOrderFormData.city = data.data.city
          _this.outboundOrderFormData.address = data.data.address
          _this.outboundOrderFormData.postalCode = data.data.postCode
        }
      });
      }
    },
    loadCountry() {
      let _this = this;
      $.ajax({
        url: jsRoutes.controllers.base.BaseController
          .showCoruntry()
          .absoluteURL(global.routeSecure),
        type: "get",
        //contentType: "application/json",
        xhrFields: {
          withCredentials: true
        },
        success: function(data) {
          _this.countries = data;
          _this.countries.unshift({ code: "", name: "" });
        }
      });
    },
    remoteProvince(query) {
      var _this = this;
      if (query !== "") {
        //如何搜索条件在列表里，就不远程查询
        var existList = this.provinces.filter(item => {
          return item.name == query;
        });
        if (existList.length == 0) {
          this.showProvinces(query);
        }
      }
    },
    changeCountry() {
      var _this = this;
      var cid = _this.outboundOrderFormData.country;
      _this.outboundOrderFormData.state = "";
      this.showProvinces("");
      // cid == '' ? this.validate.country = true : this.validate.country = false
    },
    showProvinces(query) {
      var _this = this;
      var cid = _this.outboundOrderFormData.country;
      if (!cid) {
        return;
      }
      $.ajax({
        url: jsRoutes.controllers.base.BaseController
          .showProvinces(cid)
          .absoluteURL(global.routeSecure),
        type: "get",
        data: {
          query: query
        },
        //contentType: "application/json",
        xhrFields: {
          withCredentials: true
        },
        success: function(data) {
          _this.provinces = data;
          _this.provinces.unshift({ id: "", name: "" });
        }
      });
    },
    addOder(item) {
      let _this = this;
      _this.queryLogisticsProducts(item.warehouseId);
      layer.open({
        type: 1,
        title: this.$t("button.createShippingOrder"),
        area: ["600px", "650px"],
        zIndex: 100,
        closeBtn: 0,
        btn: [this.$t("button.ok"), this.$t("button.cancel")],
        content: $("#popover"),
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
    
          let url = jsRoutes.controllers.order.OrderController.createOutBoundOrderByPlan();
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
    queryLogisticsProducts(warehouseId) {
      //查询物流产品
      let _this = this;
      $.ajax({
        type: "get",
        xhrFields: {
          withCredentials: true
        },
        url: jsRoutes.controllers.photon.PhotonApiController
          .queryLogisticsProducts(warehouseId)
          .absoluteURL(global.routeSecure),
        data: {},
        success: function(data) {
          $.unblockUI();
          if (data.success) {
            _this.logisticProduct = data.data;
          } else {
            layer.alert(data.message, { icon: 5 });
          }
        }
      });
    },
    handleSizeChange(val) {
      let _this = this;
      //console.log(`每页 ${val} 条`);
      _this.pageSize = val;
      this.queryOutboundPlan();
    },
    handleCurrentChange(val) {
      let _this = this;
      //console.log(`当前页: ${val}`);
      _this.currentPage = val;
      this.queryOutboundPlan();
    },
    queryOutboundPlan() {
      let _this = this;
      $.ajax({
        url: jsRoutes.controllers.outboundplan.OutboundPlanController
          .queryOutboundPlan()
          .absoluteURL(global.routeSecure),
        type: "get",
        data: {
          warehouseId: _this.fromData.warehouseId,
          status: _this.status,
          page: _this.currentPage,
          pageSize: _this.pageSize,
          type: 'FBA'
        },
        contentType: "application/json",
        xhrFields: {
          withCredentials: true
        },
        success: function(data) {
          // console.info(data);
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
    }
  }
};
</script>
<style lang="scss" scoped>
#popover {
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