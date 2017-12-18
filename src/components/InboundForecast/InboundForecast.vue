<template>
  <div>
  	<div class="p-t-b-24">
  		<div class="row p-l-r-15">
  			<h2 class="col-md-5">{{$t("inbound.title")}}</h2>
  			<div class="col-md-7 text-right">
  				<button type="button" class="btn btn-orange" @click="addForecast">{{$t("button.addForecast")}}</button>
  				<!-- <a  role="button" class="btn btn-fff">{{$t("inbound.truckTransshipment")}}</a> -->
  				<!-- <a :href=products[1].templateUrl role="button" class="btn btn-fff" :title="$t('inbound.transshipmentTips')">{{$t("inbound.downloadTransshipment")}}</a> -->
  				<!-- <a :href=products[0].templateUrl role="button" class="btn btn-fff" :title="$t('inbound.replenishmentTips')">{{$t("inbound.downloadReplenishment")}}</a> -->
  				<!-- <a :href=products[2].templateUrl role="button" class="btn btn-fff" :title="$t('inbound.ReturnstorageTips')">{{$t("inbound.downloadReturnstorage")}}</a> -->
          <div class="btn-group inbound-btn__group">
            <button type="button" class="btn btn-fff dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              模板下载 <span class="caret"></span>
            </button>
            <ul class="dropdown-menu">
              <li>
                <a :href=products[1].templateUrl :title="$t('inbound.transshipmentTips')">{{$t("inbound.downloadTransshipment")}}</a>
              </li>
              <li>
                <a :href=products[0].templateUrl :title="$t('inbound.replenishmentTips')">{{$t("inbound.downloadReplenishment")}}</a>
              </li>
              <li>
                <a :href=products[2].templateUrl :title="$t('inbound.ReturnstorageTips')">{{$t("inbound.downloadReturnstorage")}}</a>
              </li>
            </ul>
          </div>
  			</div>
  		</div>
  	</div>
  	<div class="p-l-r-15 m-t-20">
      <div class="search-wrapper">
        <div class="wrapper">
          <label>{{$t("stock.table.warehouse")}}：</label>
          <el-select v-model="fromData.warehouseId" :placeholder="$t('placeholder.warehouse')" @change="query()" >
            <el-option v-for="item in warehouses" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div class="wrapper">
          <label>{{$t("stock.table.orderType")}}：</label>
          <el-select v-model="fromData.orderType" :placeholder="$t('placeholder.status')" @change="query()" >
            <el-option v-for="item in orderTypes" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div class="wrapper">
          <label>{{$t("stock.table.status")}}：</label>
          <el-select v-model="fromData.status" :placeholder="$t('placeholder.status')" @change="query()" >
            <el-option v-for="item in statuslist" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="table-responsive">
          <table class="table table-hover table-bordered table-striped">
              <thead>
                  <tr class="border">
                    <!-- <th>
                      <a class="new-checkbox" :class="{'checked': isCheckAll}" @click.prevent="toggleAll">
                      <input type="checkbox" class="original">
                      <span class="new"></span>
                      </a>
                    </th> -->
                  	<th>{{$t("inbound.table.warehouse")}}</th>
                    <th>{{$t("inbound.table.orderID")}}</th>
                  	<th>{{$t("inbound.table.type")}}</th>
                    <th>SKU</th>
                    <th>{{$t("inbound.unitsPerCase")}}</th>
                    <th>{{$t("inbound.numberOfCases")}}</th>
                    <th>{{$t("inbound.qty")}}</th>
                    <th>{{$t("plan.table.status")}}</th>
                    <th>{{$t("button.printCarton")}}</th>
                  </tr>
              </thead>
              <tbody>
                  <tr class="border" v-for="(item, index) in list">
                      <!-- <td>
                        <a class="new-checkbox" :class="{'checked': item.checked}" @click.prevent="toggleSelect(item)">
                          <input type="checkbox" class="original">
                          <span class="new"></span>
                        </a>
                      </td> -->
                      <td>{{warehouseMap[item.warehouseId].name}}</td>
                      <td>{{item.id}}</td>
                      <td>{{$tc("inbound."+item.type)}}</td>
                      <td><p v-for="item2 in item.details" class="tb-dashed">{{item2.sku}}</p></td>
                      <td><p v-for="item2 in item.details" class="tb-dashed">{{item2.unitsPerCase}}</p></td>
                      <td><p v-for="item2 in item.details" class="tb-dashed">{{item2.numberOfCases}}</p></td>
                      <td><p v-for="item2 in item.details" class="tb-dashed">{{item2.qty}}</p></td>
                      <td>{{item.status!=null?$tc("inbound."+item.status):""}}
                          <a href="javascript:void(0)" @click="popStatus(item)" >{{$tc("inbound.detail")}}</a>
                      </td>
                      <td><button type="button" v-show="(item.type=='REPLENISHMENT_INBOUND' || item.type=='FBA_REPLENISHMENT_INBOUND') && item.status!='NEW' && item.status!='REFUSE' " class="btn btn-def" @click="printCarton(item.id)">{{$t("button.printCarton")}}</button></td>
                  </tr>
              </tbody>
          </table>
      </div>
  	</div>
  	<!-- 弹窗 -->
  	<div id="popover" style="display: none;">
  		<div class="form-group row">
  		    <label class="col-sm-2" style="padding-top: 7px;">{{$t("stock.table.warehouse")}}：</label>
  		    <div class="col-sm-10">
      			<el-select v-model="fromData.warehouseId" :placeholder="$t('placeholder.warehouse')" @change="changeWarehouse()" >
                    <el-option v-for="item in warehouses" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
  		    </div>
  		</div>
  		<div class="form-group row">
  		    <label class="col-sm-2">{{$t("layer.wsAddress")}}：</label>
  		    <ul class="col-sm-10">
      			<li>{{$t("layer.country")}}：{{fromData.countryCode}}</li>
      			<li>{{$t("layer.province")}}：{{fromData.province}} </li>
      			<li>{{$t("layer.city")}}：{{fromData.city}} </li>
      			<li>{{$t("layer.address")}}：{{fromData.address}} </li>
      			<li>{{$t("layer.post")}}：{{fromData.postCode}} </li>
      			<li>{{$t("layer.tel")}}：{{fromData.mobile}}</li>
  		    </ul>
  		</div>
  		<div class="form-group row">
  		    <label class="col-sm-2">{{$t("layer.type")}}：</label>
  		    <div class="col-sm-10">
      			<label class="radio-inline">
      			    <input v-model="fromData.type" type="radio" value="transport" name="productType" @change="changeProduct()" />{{$t("layer.transport")}}
      			</label>
      			<label class="radio-inline">
      			    <input v-model="fromData.type" type="radio" value="replenishment" name="productType" @change="changeProduct()" />{{$t("layer.replenishment")}}
      			</label>
      			<label class="radio-inline">
      			    <input v-model="fromData.type" type="radio" value="returnstorage" name="productType" @change="changeProduct()" />{{$t("layer.returnstorage")}}
      			</label>
  		    </div>
  		</div>
      <div class="form-group row" v-if="fromData.type === 'transport' ">
        <label class="col-sm-2">渠道：</label>
        <div class="col-sm-10">
          <label class="radio-inline">
            <input v-model="fromData.channels" type="radio" value="express" name="channels">快递
          </label>
          <label class="radio-inline">
            <input v-model="fromData.channels" type="radio" value="truck" name="channels">卡车
          </label>
        </div>
      </div>
  		<div class="form-group row">
  		    <label class="col-sm-2">{{$t("layer.upload")}}：</label>
  		    <div class="col-sm-10">
      			<input type="file" id="uploadFile" name="uploadFile" accept=".xlsx,.xls" value="uploadFile" class="form-control" @change="getUploadFileName">
      			<p class=" m-t-10">
					<a :href="templateUrl" role="button" class="more-a">{{$t("layer.download")}}</a>
				</p>
  		    </div>
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
                        <span v-for="item2 in item.cartonCodes">{{item2}} <br /> </span>
                        {{item.status=="PROCESSING" ? $tc("inbound.stockIn") : $tc("inbound."+item.status)}}                        
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
      isCheckAll: false,
      fromData: {
        warehouseId: "",
        timeZone: "",
        countryCode: "",
        province: "",
        city: "",
        address: "",
        postCode: "",
        mobile: "",
        type: "",
        status: "",
        orderType: "FBA_REPLENISHMENT_INBOUND,FBA_TRANSPORT_INBOUND,FBA_RETURNSTORAGE_INBOUND"
      },
      ids: [],
      showLogistic: false,
      templateUrl: "",
      uploadFile: "",
      warehouses: [],
      orderTypes:[
        { id: "FBA_REPLENISHMENT_INBOUND,FBA_TRANSPORT_INBOUND,FBA_RETURNSTORAGE_INBOUND",name: this.$tc("main.all")},
        { id: "FBA_REPLENISHMENT_INBOUND",name: this.$tc("inbound.FBA_REPLENISHMENT_INBOUND")},
        { id: "FBA_TRANSPORT_INBOUND",name: this.$tc("inbound.FBA_TRANSPORT_INBOUND")},
        { id: "FBA_RETURNSTORAGE_INBOUND",name: this.$tc("inbound.FBA_RETURNSTORAGE_INBOUND")}
      ],
      statuslist: [
        { id: "", name: this.$tc("main.all") },
        { id: "NEW", name: this.$tc("inbound.NEW") },
        { id: "REFUSE", name: this.$tc("inbound.REFUSE") },
        { id: "CONFIRMED", name: this.$tc("inbound.CONFIRMED") },
        { id: "DONE", name: this.$tc("inbound.DONE") },
        { id: "ERROR", name: this.$tc("inbound.ERROR") }
        
      ],
      products: [
        {
          type: "replenishment",
          templateUrl: "../../../static/template/replenishment_inbound.xlsx"
        },
        {
          type: "transport",
          templateUrl: "../../../static/template/transport_inbound.xlsx"
        },
        {
          type: "returnstorage",
          templateUrl: "../../../static/template/return_storage.xlsx"
        }
      ],
      records: [],
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
    if (this.products && this.products.length > 0) {
      this.fromData.type = this.products[0].type;
      this.templateUrl = this.products[0].templateUrl;
    }
    let _this = this;
    this.query();
  },
  methods: {
    printCarton: function(orderId) {
      var url = jsRoutes.controllers.order.OrderController
        .printCartonLabel(orderId, "100X100")
        .absoluteURL(global.routeSecure);
      window.open(url);
    },
    // 单选
    toggleSelect(data) {
      console.log(data);
      if (data.checked == undefined) {
        this.$set(data, "checked", true);
        this.ids.push(data.id);
      } else {
        data.checked = !data.checked;
        if (data.checked) {
          this.ids.push(data.id);
        } else {
          this.ids.forEach((id, index) => {
            if (data.id === id) {
              this.ids.splice(index, 1);
            }
          });
        }
      }
    },
    // 全选/取消全选
    toggleAll() {
      if (this.isCheckAll == false) {
        if (this.list.length > 0) {
          this.list.forEach((data, index) => {
            if (typeof data.checked == "undefined" || data.checked == false) {
              this.$set(data, "checked", true);
              this.isCheckAll = true;
            }
          });
        }
      } else {
        if (this.list.length > 0) {
          this.list.forEach((data, index) => {
            data.checked = false;
            this.isCheckAll = false;
          });
        }
      }
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

            _this.fromData.countryCode = theWarehouse.countryCode;
            _this.fromData.province = theWarehouse.province;
            _this.fromData.city = theWarehouse.city;
            _this.fromData.address = theWarehouse.address;
            _this.fromData.postCode = theWarehouse.postCode;
            _this.fromData.mobile = theWarehouse.phone;
            $.each(_this.warehouses, function(i, e) {
              _this.warehouseMap[e.id] = e;
            });
          } else {
            _this.warehouses = [];
          }
        }
      });
    },
    getUploadFileName: function(event) {
      let fileName = $(event.target)
        .val()
        .split("\\");
      this.uploadFile = fileName[fileName.length - 1];
    },
    addForecast() {
      let _this = this;
      layer.open({
        type: 1,
        title: this.$t("button.addForecast"),
        area: ["600px", "460px"],
        zIndex: 1001,
        btn: [this.$t("button.ok"), this.$t("button.cancel")],
        content: $("#popover"),
        shadeClose: false,
        cancel: function() {},
        yes: function(index, layero) {
          if (_this.fromData.warehouseId === "") {
            layer.msg(_this.$t("placeholder.warehouse"));
            return false;
          }

          if (!$("#uploadFile").val()) {
            layer.msg(_this.$t("layer.selectFile"));
            return false;
          }

          var imgFiles = $("#uploadFile")[0].files;
          var formData = new FormData();
          for (var i = 0; i < imgFiles.length; i++) {
            formData.append("uploadFile", imgFiles[i]);
          }

          formData.append("warehouseId", _this.fromData.warehouseId);
          formData.append("countryCode", _this.fromData.countryCode);
          formData.append("province", _this.fromData.province);
          formData.append("city", _this.fromData.city);
          formData.append("address", _this.fromData.address);
          formData.append("postCode", _this.fromData.postCode);
          formData.append("mobile", _this.fromData.mobile);
          formData.append("type", _this.fromData.type);
          formData.append("isFba", "true");
          if (_this.warehouses) {
            formData.append(
              "orgOp",
              _this.warehouseMap[_this.fromData.warehouseId].orgOp
            );
          }

          var url = jsRoutes.controllers.fba.FbaInboundController.createFbaOrder();
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
              // console.log(data);
              if (data.success) {
                layer.msg(_this.$t("layer.succ"), function() {
                  _this.fromData.countryCode = "";
                  _this.fromData.province = "";
                  _this.fromData.city = "";
                  _this.fromData.address = "";
                  _this.fromData.postCode = "";
                  _this.fromData.mobile = "";
                  _this.uploadFile = "";
                  layer.closeAll();
                  _this.query();
                  return true;
                });
              } else {
                layer.alert(data.message.replace(/\n+/g, "</br>"));
                return false;
              }
            }
          });
        },
        btn2: function(index, layero) {
          layer.close(index);
        }
      });
    },
    changeWarehouse() {
      let _this = this;
      let _fromData = _this.fromData;
      if (_this.fromData.warehouseId && _fromData.warehouseId !== "") {
        _fromData.countryCode =
          _this.warehouseMap[_fromData.warehouseId].countryCode;
        _fromData.province = _this.warehouseMap[_fromData.warehouseId].province;
        _fromData.city = _this.warehouseMap[_this.fromData.warehouseId].city;
        _fromData.address = _this.warehouseMap[_fromData.warehouseId].address;
        _fromData.postCode = _this.warehouseMap[_fromData.warehouseId].postCode;
        _fromData.mobile = _this.warehouseMap[_fromData.warehouseId].phone;
        _fromData.timeZone = _this.warehouseMap[_fromData.warehouseId].timeZone;
      }
    },
    changeProduct() {
      let _this = this;
      for (let _product of _this.products) {
        if (_product.type === _this.fromData.type) {
          _this.templateUrl = _product.templateUrl;
          break;
        }
      }
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
        timeZone: timeZone,
        status: _this.fromData.status,
        page: _this.currentPage,
        pageSize: _this.pageSize,
        type: _this.fromData.orderType
      };
      return formData;
    },
    query() {
      var _this = this;
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
        zIndex: 2000,
        area: ["600px", "460px"],
        shadeClose: true,
        content: $("#popContainer2")
      });
      var _this = this;
      var timeZone = _this.fromData.timeZone;
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
a.btn {
  line-height: 17px;
  color: #646464;
}
.inbound-btn__group{
  display: inline-block;
  .dropdown-menu{
    right: 0;
    left: auto;
    min-width: 130px;
    a:hover{
      text-decoration: underline;
      cursor: pointer;
      background-color: #f2f2f2;
    }
  }
}
</style>