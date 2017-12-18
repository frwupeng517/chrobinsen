<template>
	<div>
		<div class="p-t-b-24">
			<div class="row p-l-r-15">
				<h2 class="col-md-12">{{$t("stock.title")}}</h2>
			</div>
		</div>
    <div class="search-wrapper p-l-r-15">
        <div class="wrapper">
          <label>{{$t("stock.table.warehouse")}}：</label>
          <el-select v-model="warehouseId" :placeholder="$t('placeholder.warehouse')" @change="queryCondition()" >
            <el-option v-for="item in warehouses" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
          <label>{{$t("stock.table.inventoryType")}}：</label>
          <el-select v-model="inventoryType" :placeholder="$t('placeholder.inventoryType')" @change="queryCondition()" >
            <el-option v-for="item in inventoryTypes" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div class="wrapper">
          <div class="search-group">
            <div class="search-input">
            <input type="text" v-model="sku" class="form-control form-control-input" :placeholder="$t('placeholder.sku')">
            <span class="glyphicon glyphicon-search" aria-hidden="true"></span>
          </div>
          <a href="#" role="button" class="btn btn-000 search-btn" @click="queryCondition">{{$t("button.search")}}</a>
        </div>
      </div>
	  	</div>
	  	<div class="p-l-r-15 m-t-20 row">
			<div class="table-responsive col-sm-8">
				<table class="table table-hover table-striped">
				  <thead>
				      <tr>
				      	<th v-show="inventoryType !== 'FBA_RETURN'"><input v-model="checkAll" type="checkbox" @click="checkStockAll"></th>
	                  	<th>{{$t("stock.table.sku")}}</th>
	                  	<th>{{$t("stock.table.name")}}</th>
	                  	<th>{{$t("stock.table.warehouse")}}</th>
	                  	<th>{{$t("stock.table.inventoryType")}}</th>
	                  	<th v-show="inventoryType !== 'FBA_RETURN'">{{$t("stock.table.inventory")}}</th>
                      <th v-show="inventoryType !== 'FBA_RETURN'">{{$t("stock.table.lock_inventory")}}</th>
	                  	<th v-show="inventoryType !== 'FBA_RETURN'">{{$t("stock.table.cartonNum")}}</th>
	                  	<th v-show="inventoryType !== 'FBA_RETURN'">{{$t("stock.table.num")}}</th>
	                  	<th>{{$t("stock.table.total")}}</th>
	                  	<th v-show="inventoryType === 'FBA_RETURN'">{{$t("stock.table.lock_number")}}</th>
				      </tr>
				  </thead>
				  <tbody>
				      <tr v-for="(item, index) in inventory">
				      	  <td v-show="inventoryType !== 'FBA_RETURN'"><input v-model="item.check" type="checkbox" name="isOpen" @click="checkStock(item)"></td>
				          <td>{{item.sku}}</td>
				          <td>{{item.skuName}}</td>
				          <td>{{item.warehouseName}}</td>
				          <td>{{item.type}}</td>
				          <td v-show="inventoryType !== 'FBA_RETURN'"><p>{{item.cartonCount}}<i>{{$t('stock.case')}}</i></p></td>
                  <td v-show="inventoryType !== 'FBA_RETURN'"><p>{{item.lockCount}}</p></td>
				          <td v-show="inventoryType !== 'FBA_RETURN'"><button type="button" class="btn btn-sm btn-def" @click="showButton(item.id)">{{$t('stock.table.caseDetail')}}</button></td>
				          <td v-show="inventoryType !== 'FBA_RETURN'">{{item.unitsPerCase}}</p></td>
				          <td>{{item.skuCount}}</td>
				          <td v-show="inventoryType === 'FBA_RETURN'">{{item.lockCount}}</td>
				      </tr>
				  </tbody>
				</table>
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
	  		<div class="table-responsive col-sm-4">
		  		<div class="table-responsive">
	              <table class="table table-hover table-striped">
	                  <thead>
		                  <tr>
		                  	<th width="20%">{{$t("layer.sku")}}</th>
		                  	<th width="20%">{{$t("stock.table.name")}}</th>
		                  	<th width="20%" v-show="inventoryType === 'FBA_RETURN'">{{$t("layer.newsku")}}</th>
		                  	<th width="20%" v-show="inventoryType === 'FBA_RETURN'">{{$t("stock.table.number")}}</th>
		                  	<th width="20%" v-show="inventoryType !== 'FBA_RETURN'">{{$t("layer.carton")}}</th>
		                  	<th width="20%" v-show="inventoryType !== 'FBA_RETURN'">{{$t("stock.table.num")}}</th>
		                  	<th width="20%" v-show="inventoryType !== 'FBA_RETURN'">{{$t("stock.table.total")}}</th>
		                  </tr>
	                  </thead>
	                  <tbody>
		                  <tr v-for="(item, index) in skuArr">
		                      <td>{{item.sku}}</td>
		                      <td>{{item.skuName}}</td>
		                      <td v-show="inventoryType === 'FBA_RETURN'">
                            <p class="fadein" v-for="item2 in item.attr">
                                 <input v-model="item2.newSku" type="input" class="form-control" style="width:80%;min-width: 40px;" :placeholder="$t('placeholder.sku')" />
                            </p>
		                      </td>
		                      <td v-show="inventoryType === 'FBA_RETURN'">
		                      	<p class="fadein" v-for="item2 in item.attr">
                                 <input v-model="item2.number" type="number" step="1" min="1" class="form-control" style="width:80%;min-width: 40px;" :placeholder="$t('placeholder.num')" @input="stocksChange(item)">
                            </p>
		                      </td>
		                      <td v-show="inventoryType !== 'FBA_RETURN'">
		                      	<p class="fadein" v-for="item2 in item.attr">
                                 <input v-model="item2.inputQty" type="number" step="1" min="1" class="form-control" style="width:80%;min-width: 40px;" :placeholder="$t('placeholder.num')" @input="stocksChange(item)">
                            </p>
		                      </td>
		                      <td v-show="inventoryType !== 'FBA_RETURN'">
		                      	<p class="fadein" v-for="item2 in item.attr" style="line-height: 34px;">{{item2.unitsPerCase}}</p>
		                      </td>
		                      <td v-show="inventoryType !== 'FBA_RETURN'">{{item.totalCount}}</td>
		                  </tr>
	                  </tbody>
	              </table>
	              <div>
                  <input v-show="false" type="file" id="uploadFile" name="uploadFile" accept=".xlsx,.xls" value="uploadFile" @change="getUploadFileName">
	              	<a v-show="inventoryType !== 'FBA_RETURN'" role="button" class="btn btn-def" @click="readyCreateOutboundPlan()" >{{$t('button.createShippingPlan')}}</a>
	              	<a v-show="inventoryType === 'FBA_RETURN'" role="button" class="btn btn-def" @click="createOutboundPlanByTemplate()" >{{$t('button.createShippingPlanFromFile')}}</a>
	              	<!-- <a  role="button" class="btn btn-def" @click="createOutboundOrder()" >{{$t('button.createShippingOrder')}}</a> -->
	              </div>
	            </div>
          </div>
			</div>

            <div id="caseLayer" class="block" style="padding:10px;display:none;">
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th>{{$tc('stock.table.cartonNum')}}</th>
                            <th>{{$tc('stock.length')}} (in)</th>
                            <th>{{$tc('stock.width')}} (in)</th>
                            <th>{{$tc('stock.height')}} (in)</th>
                            <th>{{$tc('stock.weight')}} (lbs)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in cartons">
                            <td>
                                {{item.cartonCode}} <span v-show="item.lock">({{$t('stock.lock')}})</span>
                            </td>
                            <td>{{item.length}}</td>
                            <td>{{item.width}}</td>
                            <td>{{item.height}}</td>
                            <td>{{item.weight}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
      
        <!-- 弹窗 -->
	  		<div id="popover">
	  			<div class="form-group row">
	  			    <label class="col-sm-3" style="padding-top: 7px;">SHIPMENT ID：</label>
	  			    <div class="col-sm-9"><input type="text" class="form-control" v-model.trim="outboundOrderFormData.shipmentId" ></div>
	  			</div>
	  			<div class="form-group row">
	  			    <label class="col-sm-3" style="padding-top: 7px;">Address：</label>
	  			    <div class="col-sm-9"><input type="text" class="form-control" v-model.trim="outboundOrderFormData.address"></div>
	  			</div>
	  			<div class="form-group row">
	  			    <label class="col-sm-3" style="padding-top: 7px;">City：</label>
	  			    <div class="col-sm-9"><input type="text" class="form-control" v-model.trim="outboundOrderFormData.city"></div>
	  			</div>
	  			<div class="form-group row">
	  			    <label class="col-sm-3" style="padding-top: 7px;">State：</label>
	  			    <div class="col-sm-9"><input type="text" class="form-control" v-model.trim="outboundOrderFormData.state"></div>
	  			</div>
	  			<div class="form-group row">
	  			    <label class="col-sm-3" style="padding-top: 7px;">Country：</label>
	  			    <div class="col-sm-9"><input type="text" class="form-control" v-model.trim="outboundOrderFormData.country"></div>
	  			</div>
	  			<div class="form-group row">
	  			    <label class="col-sm-3" style="padding-top: 7px;">Postal code：</label>
	  			    <div class="col-sm-9"><input type="text" class="form-control" v-model.trim="outboundOrderFormData.postalCode"></div>
	  			</div>
	  			<div class="form-group row">
	  			    <label class="col-sm-3" style="padding-top: 7px;">User name：</label>
	  			    <div class="col-sm-9"><input type="text" class="form-control" v-model.trim="outboundOrderFormData.userName"></div>
	  			</div>
	  			
	  			<div class="form-group row">
	  			    <label class="col-sm-3" style="padding-top: 7px;">Phone：</label>
	  			    <div class="col-sm-9"><input type="text" class="form-control" v-model.trim="outboundOrderFormData.phone"></div>
	  			</div>
				<div class="form-group row">
	  			    <label class="col-sm-3" style="padding-top: 7px;">LogisticProduct：</label>
	  			    <div class="col-sm-9">
						  <el-select v-model="outboundOrderFormData.logisticProductId" :placeholder="$t('placeholder.logistic')" >
							<el-option v-for="item in logisticProduct" :key="item.id" :label="item.name" :value="item.id">
							</el-option>
						</el-select>
					</div>
	  			</div>
	  			<div class="form-group row">
	  			    <label class="col-sm-3" style="padding-top: 7px;">{{$t("layer.cartonLabel")}}：</label>
	  			    <div class="col-sm-9"><input type="file" id="uploadFile" name="uploadFile" accept=".pdf" value="uploadFile" @change="getUploadFileName"></div>
	  			</div>
	  		</div>
        <!-- 模板导入弹窗 -->
        <div  id="planForTemplate">
            <div class="form-group row">
                <label class="col-sm-3" style="padding-top: 7px;">Product label：</label>
                <div class="col-sm-9">
                    <input type="file" class="form-control" title="pdf file" id="fileLabelTemplatePdf" name="fileLabelTemplatePdf"  accept=".pdf" value="fileLabelTemplatePdf" @change="getUploadFileNameTemplatePdf">
                </div>
              </div>
              <div class="form-group row">
                <label class="col-sm-3" style="padding-top: 7px;">Excel Template：</label>
                <div class="col-sm-6">
                    <input type="file" class="form-control" title="excel file" id="fileLabelTemplateExcel" name="fileLabelTemplateExcel"  accept=".xls,.xlsx" value="fileLabelTemplateExcel" @change="getUploadFileNameTemplateExcel">
                </div>
                <a class="col-sm-3" title="Download Excel template file" href="../../../static/template/change_label.xlsx" >template</a>
            </div>
        </div>
        <!-- 上传产品标 -->
        <div id="planForInput">
	  			<div class="form-group row">
              <label class="col-sm-3" style="padding-top: 7px;">Product labelling：</label>
              <div class="col-sm-9">
                  <input type="file" class="form-control" title="pdf file" id="fileLabelInput" name="fileLabelInput"  accept=".pdf" value="fileLabelInput" @change="getUploadFileNameInput">
              </div>
          </div>
	  		</div>
	</div>
</template>

<script>
export default {
  props: {},
  components: {},
  data() {
    return {
      warehouses: [],
      warehouseId: "",
      timeZone: "",
      warehouseMap: {},
      sku: "",
      checkAll: false,
      currentPage: 1,
      total: 0,
      pageSize: 50,
      pageSizes: [5, 10, 20, 50, 100],
      inventory: [],
      cartons: [],
      skuArr: [],
      logisticProduct: [{}],
      inventoryType: "FBA",
      inventoryTypes: [
        {id:"FBA",name: "补货库存"},
        {id:"FBA_RETURN",name: "退货库存"}
      ],
      uploadFile: "",
      fileLabelTemplatePdf: "",
      fileLabelTemplateExcel: "",
      outboundOrderFormData: {
        shipmentId: "",
        address: "",
        city: "",
        state: "",
        country: "",
        postalCode: "",
        logisticProductId: "",
        userName: "",
        phone: ""
      },
      fileLabelInput: ""
    };
  },
  computed: {},
  created: function() {
    this.queryWarehouse();
    this.query();
  },
  watch: {
    inventory: {
      handler(oldVal, newVal) {},
      deep: true
    }
  },
  updated: function() {
    this.$nextTick(function() {});
  },
  methods: {
    getUploadFileNameInput: function(event) {
      let fileName = $(event.target)
        .val()
        .split("\\");
      this.fileLabelInput = fileName[fileName.length - 1];
    },
    getUploadFileNameTemplatePdf: function(event) {
      let fileName = $(event.target)
        .val()
        .split("\\");
      this.fileLabelTemplatePdf = fileName[fileName.length - 1];
    },
    getUploadFileNameTemplateExcel: function(event) {
      let fileName = $(event.target)
        .val()
        .split("\\");
      this.fileLabelTemplateExcel = fileName[fileName.length - 1];
    },
    getUploadFileName: function(event) {
      let fileName = $(event.target)
        .val()
        .split("\\");
      this.uploadFile = fileName[fileName.length - 1];
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
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.query();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.query();
    },
    showButton(id) {
      //加载数据
      var formCartons = {
        inventoryId: id
      };
      this.queryCartons(formCartons);
      layer.open({
        type: 1,
        //shift: 1,
        title: this.$t("stock.table.cartonNum"),
        shadeClose: true,
        shade: 0.8,
        maxmin: true,
        area: ["400px", "300px"],
        content: $("#caseLayer")
      });
    },
    queryCondition() {
      this.query();
    },
    //查询箱id
    queryCartons(formCartons) {
      let _this = this;
      let url = jsRoutes.controllers.fba.FbaInventoryController.querySkuCartonNumbers();
      $.ajax({
        url: url.absoluteURL(global.routeSecure),
        type: url.type,
        contentType: "application/json",
        data: JSON.stringify(formCartons),
        async: false,
        xhrFields: {
          withCredentials: true
        },
        success: function(data) {
          if (data.success) {
            _this.cartons = data.data;
          } else {
            _this.cartons = [];
          }
        }
      });
    },
    //查询sku信息
    query() {
      let _this = this;
      let url = jsRoutes.controllers.fba.FbaInventoryController.query();
      $.ajax({
        url: url.absoluteURL(global.routeSecure),
        type: url.type,
        contentType: "application/json",
        data: JSON.stringify(_this.queryForm()),
        async: false,
        xhrFields: {
          withCredentials: true
        },
        success: function(data) {
          if (data.success) {
            _this.inventory = data.data.list;
            _this.total = data.data.total;
            $.each(_this.inventory, function(i, e) {
              e.check = false;
              e.skuCount = Number(e.cartonCount) * Number(e.unitsPerCase);
            });
          } else {
            _this.inventory = [];
          }
        }
      });
    },
    queryForm() {
      var _this = this;
      var timeZone = _this.warehouseMap[_this.warehouseId].timeZone;
      var formData = {
        warehouseId: _this.warehouseId,
        inventoryType: _this.inventoryType,
        timeZone: timeZone,
        page: _this.currentPage,
        pageSize: _this.pageSize,
        sku: _this.sku,
        isFba: true
      };
      return formData;
    },

    //点击check
    checkStock(item) {
      var _this = this;
      if (this.checkAll == true) {
        this.checkAll = false;
      }
      item.check = !item.check;
      this.querySelectedList();
    },
    querySelectedList() {
      var _this = this;
      var maps = {};
      $.each(this.inventory, function(i, e) {
        if (e.check) {
          if (maps[e.warehouseId]) {
            maps[e.warehouseId].push(e);
          } else {
            maps[e.warehouseId] = new Array(e);
          }
        }
      });
      for (var key in maps) {
        var array = maps[key];
        var skumap = {};
        $.each(array, function(i, e) {
          if (skumap[e.sku]) {
            skumap[e.sku].push(e);
          } else {
            skumap[e.sku] = new Array(e);
          }
        });
        maps[key] = skumap;
      }
      //组装展示对象
      _this.skuArr = [];
      for (var key in maps) {
        var skuObj = maps[key];
        for (var sku in skuObj) {
          var obj = {};
          obj.sku = sku;
          obj.skuName = skuObj[sku][0].skuName;
          obj.attr = skuObj[sku];
          var t = 0;
          $.each(skuObj[sku], function(i, e) {
            e.inputQty = e.cartonCount - e.lockCount;
            t += e.unitsPerCase * e.inputQty;
            e.number = e.skuCount - e.lockCount;
          });
          obj.totalCount = t;
          _this.skuArr.push(obj);
        }
      }
    },
    //计算总数
    stocksChange(item) {
      var total = 0;
      for (var i = 0; i < item.attr.length; i++) {
        var e = item.attr[i];
        total += e.unitsPerCase * e.inputQty;
      }
      item.totalCount = total;
    },
    //点击checkAll
    checkStockAll() {
      var _this = this;
      this.checkAll = !this.checkAll;
      for (var i = 0; i < this.inventory.length; i++) {
        this.inventory[i].check = this.checkAll;
      }
      this.querySelectedList();
    },
    readyCreateOutboundPlan(){
      let _this = this;
      if(_this.inventoryType === "FBA_RETURN"){
        //vilidate
        if (this.skuArr == null || this.skuArr.length == 0) {
          layer.alert("Please check the sku.");
          return;
        }

        var values = [];
        var stockOut = false;
        var stockSku = false;
        $.each(this.skuArr, function(i, e) {
          $.each(e.attr, function(i2, e2) {
            if ((Number(e2.number) + e2.lockCount) > e2.skuCount || e2.number <= 0) {
              stockOut = true;
              return false;
            }
            if(!e2.newSku || e2.newSku.length === 0){
              stockSku = true;
              return false;
            }
            values.push({
              id: e2.id,
              warehouseId: e2.warehouseId,
              sku: e2.sku,
              newSku: e2.newSku,
              numberOfCases: e2.type ==="FBA_RETURN" ? e2.cartonCount : e2.inputQty,
              unitsPerCase: e2.unitsPerCase,
              qty: e2.skuCount,
              number: e2.number,
              type: e2.type
            });
          });
        });
        if (stockOut) {
          layer.alert(this.$tc("stock.low_stocks"));
          return false;
        }
        if (stockSku) {
          layer.alert(this.$tc("stock.newSku"));
          return false;
        }
        layer.open({
          type: 1,
          title: this.$t("button.createShippingOrder"),
          area: ["600px", "180px"],
          zIndex: 100,
          btn: [this.$t("button.ok"), this.$t("button.cancel")],
          content: $("#planForInput"),
          yes: function(index, layero) {
            var formData = new FormData();
            if (!$("#fileLabelInput").val()) {
              layer.msg(_this.$t("layer.selectFile"));
                return false;
            }
            var imgFiles = $("#fileLabelInput")[0].files;
            for (var i = 0; i < imgFiles.length; i++) {
              formData.append("fileLabelInput", imgFiles[i]);
            }
            
            formData.append("values",JSON.stringify(values));
            $.ajax({
              url: jsRoutes.controllers.outboundplan.OutboundPlanController.outboundPlanCreateOfReturn().absoluteURL(global.routeSecure),
              type: "post",
              data: formData,
              cache: false,
              contentType: false,
              processData: false,
              xhrFields: {
                withCredentials: true
              },
              success: function(data) {
                $.unblockUI;
                if (data.success) {
                  _this.data = data.data;
                  layer.msg(data.message);
                  layer.close(index);
                  _this.$router.push({ path: "label/return-plan" });
                }else{
                  layer.msg(data.message);
                }
              }
            });
          }
        });
      }else{
        _this.createOutboundPlan();
      }
    },
    createOutboundPlanByTemplate(){
      let _this = this;
      layer.open({
          type: 1,
          title: this.$t("button.createShippingOrder"),
          area: ["500px", "250px"],
          zIndex: 100,
          btn: [this.$t("button.ok"), this.$t("button.cancel")],
          content: $("#planForTemplate"),
          yes: function(index, layero) {
            var formData = new FormData();
            if (!$("#fileLabelTemplatePdf").val()) {
              layer.msg(_this.$t("layer.selectFile"));
                return false;
            }
            var imgFiles = $("#fileLabelTemplatePdf")[0].files;
            for (var i = 0; i < imgFiles.length; i++) {
              formData.append("pdf", imgFiles[i]);
            }
            if (!$("#fileLabelTemplateExcel").val()) {
              layer.msg(_this.$t("layer.selectFile"));
                return false;
            }
            var imgFiles = $("#fileLabelTemplateExcel")[0].files;
            for (var i = 0; i < imgFiles.length; i++) {
              formData.append("excel", imgFiles[i]);
            }
            formData.append("values", _this.warehouseId);
            
            $.ajax({
              url: jsRoutes.controllers.outboundplan.OutboundPlanController.outboundPlanCreateOfReturnByTemplate().absoluteURL(global.routeSecure),
              type: "post",
              data: formData,
              cache: false,
              contentType: false,
              processData: false,
              xhrFields: {
                withCredentials: true
              },
              success: function(data) {
                $.unblockUI;
                if (data.success) {
                  _this.data = data.data;
                  layer.msg(data.message);
                  layer.close(index);
                  _this.$router.push({ path: "/label/return-plan" });
                }else{
                  layer.msg(data.message);
                }
              }
            });
          }
        });
    },
    createOutboundPlan() {
      let _this = this;
      if (this.skuArr == null || this.skuArr.length == 0) {
        layer.alert("Please check the sku.");
        return;
      }
      var values = [];
      var stockOut = false;
      $.each(this.skuArr, function(i, e) {
        $.each(e.attr, function(i2, e2) {
          if (e2.cartonCount - e2.lockCount < e2.inputQty || e2.inputQty <= 0) {
            stockOut = true;
            return false;
          }
          values.push({
            id: e2.id,
            warehouseId: e2.warehouseId,
            sku: e2.sku,
            newSku: e2.newSku,
            numberOfCases: e2.inputQty,
            unitsPerCase: e2.unitsPerCase,
            qty: e2.skuCount,
            number: e2.number,
            type: e2.type
          });
        });
      });
      if (stockOut) {
        layer.alert(this.$tc("stock.low_stocks"));
        return false;
      }

      $.ajax({
        url: jsRoutes.controllers.outboundplan.OutboundPlanController
          .outboundPlanCreate()
          .absoluteURL(global.routeSecure),
        type: "post",
        data: JSON.stringify(values),
        contentType: "application/json",
        xhrFields: {
          withCredentials: true
        },
        success: function(data) {
          $.unblockUI;
          if (data.success) {
            _this.data = data.data;
            layer.msg(data.message);
            _this.$router.push({ path: "/replenishment/plan" });
          }
        }
      });
    },
    createOutboundOrder() {
      let _this = this;
      if (this.skuArr == null || this.skuArr.length == 0) {
        layer.alert("Please check the sku.");
        return;
      }
      var formData = [];
      var stockOut = false;
      $.each(this.skuArr, function(i, e) {
        $.each(e.attr, function(i2, e2) {
          if (e2.cartonCount - e2.lockCount < e2.inputQty || e2.inputQty <= 0) {
            stockOut = true;
            return false;
          }
          formData.push({
            id: e2.id,
            warehouseId: e2.warehouseId,
            sku: e2.sku,
            numberOfCases: e2.inputQty,
            unitsPerCase: e2.unitsPerCase,
            qty: e2.skuCount
          });
        });
      });
      if (stockOut) {
        layer.alert(this.$tc("stock.low_stocks"));
        return false;
      }
      //console.log(formData);
      _this.addOrder(formData);
    },
    addOrder(orderData){
      let _this = this;
      if(orderData && orderData.length > 0){
        let _warehouseId = orderData[0].warehouseId;//???
         _this.queryLogisticsProducts(_warehouseId);

         layer.open({
          type: 1,
          title: this.$t("button.createShippingOrder"),
          area: ["600px", "540px"],
          zIndex: 100,
          btn: [this.$t("button.ok"), this.$t("button.cancel")],
          content: $("#popover"),
          yes: function(index, layero) {
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
            if (
              !_this.outboundOrderFormData.userName ||
              _this.outboundOrderFormData.userName.length == 0
            ) {
              layer.msg("'userName' Is required");
              return false;
            }
            if (
              !_this.outboundOrderFormData.phone ||
              _this.outboundOrderFormData.phone.length == 0
            ) {
              layer.msg("'phone' Is required");
              return false;
            }
            if (
              !_this.outboundOrderFormData.logisticProductId ||
              _this.outboundOrderFormData.logisticProductId.length == 0
            ) {
              layer.msg(_this.$t("placeholder.logistic"));
              return false;
            }

            if (!$("#uploadFile").val()) {
              layer.msg("请选择文件");
              return false;
            }
            var imgFiles = $("#uploadFile")[0].files;
            var formData = new FormData();
            for (var i = 0; i < imgFiles.length; i++) {
              formData.append("uploadFile", imgFiles[i]);
            }

            formData.append("shipmentId", _this.outboundOrderFormData.shipmentId);
            formData.append("address", _this.outboundOrderFormData.address);
            formData.append("city", _this.outboundOrderFormData.city);
            formData.append("state", _this.outboundOrderFormData.state);
            formData.append("country", _this.outboundOrderFormData.country);
            formData.append("postalCode", _this.outboundOrderFormData.postalCode);
            formData.append("phone", _this.outboundOrderFormData.phone);
            formData.append("userName", _this.outboundOrderFormData.userName);
            formData.append("orderData", JSON.stringify(orderData));
            
            formData.append("warehouseId", _warehouseId);

            formData.append(
              "logisticProductId",
              _this.outboundOrderFormData.logisticProductId
            );
            for (let _logistic of _this.logisticProduct) {
              if (
                _logistic.id === _this.outboundOrderFormData.logisticProductId
              ) {
                formData.append("logisticProductCode", _logistic.code);
                formData.append("logisticProductName", _logistic.name);
                formData.append("orgOp", _logistic.operationOrgId);
                break;
              }
            }

            let url = jsRoutes.controllers.outboundplan.OutboundPlanController.outboundOrderCreate();
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
                    _this.query();
                    return true;
                  });
                } else {
                  layer.alert(data.message);
                  return false;
                }
              }
            });
          }
        });
      }else{

      }
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
    }
  }
};
</script>

<style lang="scss" scoped>
.fadein + .fadein {
  animation: opacityChange 0.5s;
}
@keyframes opacityChange {
  0% {
    opacity: 0;
  }
  99% {
    opacity: 0;
  }
  100% {
    left: 1;
  }
}
#Plan {
  padding: 20px;
  display: none;
}
//标题  搜索
.dropdown {
  display: inline-block;
  margin-right: 15px;
}
.search-input {
  position: relative;
  display: inline-block;
  .form-control-input {
    width: 200px;
    padding-left: 30px;
    border-color: #d9d9d9;
  }
  .form-control {
    height: 34px;
    font-size: 12px;
    display: inline-block;
    &:focus{
      border-color: #e8bf57;
    }
  }
  .glyphicon {
    position: absolute;
    left: 10px;
    top: 10px;
    color: #aaa;
    font-size: 12px;
  }
}
.search-group {
  font-size: 0;
  .search-input .form-control {
    border-bottom-right-radius: 0;
    border-top-right-radius: 0;
  }
  .search-btn {
    display: inline-block;
    height: 34px;
    color: #fff !important;
    vertical-align: top;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
}
.table tbody tr td .btn-sm {
  min-width: auto;
}
.m-r-30 {
  margin-right: 30px;
}
#planForInput {
  display: none;
  padding: 20px;
  .form-group {
    margin-bottom: 15px;
  }
}
#planForTemplate {
  display: none;
  padding: 5px;
  .form-group {
    margin-bottom: 5px;
  }
}
#popover {
  display: none;
  padding: 20px;
  .form-group {
    margin-bottom: 15px;
  }
}
//tabel
</style>