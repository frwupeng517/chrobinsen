module.exports = {
    main: {
        company: "深圳星邮供应链管理有限公司",
        logout: "注销",
        toTop: "返回顶部",
        selectOrg: '请选择运营组织',
        all: "全部"
    },
    button: {
        search: "搜索",
        ok: "确认",
        cancel: "取消",
        submit: "提交",
        reset: "清空",
        createShippingPlan: '生成出货计划',
        createShippingPlanFromFile: "模板导入",
        downloadPackingList: "下载装箱单",
        createShippingOrder: "生成出货订单",
        addForecast: "添加预报",
        printCarton: "下载箱标",
        export_one: "导出当前页",
        export_all: "导出全部"
    },
    placeholder: {
        timeZone: "请选择时区",
        org: "请选择组织",
        sku: "请输入SKU",
        num: "请输入数量",
        warehouse: "请选择仓库",
        logisticProduct: "物流产品",
        logistic: "请选择物流产品",
        selectCountry: "请选择国家",
        selectState: "请选择省份",
        select_startDate: "请选择开始时间",
        select_endDate: "请选择结束时间",
        status: "请选择状态",
        currency: "请选择货币种类",
        category: "请选择申报产品类别",
        selectSku: "请选择SKU",
        inventoryType: "请选择库存类型",
        orderType: "请选择订单类型"
    },
    layer: {
        noBusiness: '普通订单管理',
        sku: 'SKU',
        newsku: '新SKU',
        carton: '箱数',
        wsAddress: "仓库地址",
        country: "国家",
        province: "省份",
        city: "城市",
        address: "地址",
        post: "邮编",
        tel: "仓库电话",
        type: "类型",
        transport: "转运",
        replenishment: "补货",
        returnstorage: "退货",
        upload: "上传文件",
        download: "下载预览模板",
        cartonLabel: "箱标PDF",
        selectFile: '请选择文件',
        tips: '提示',
        toggle: '确定切换语言吗?',
        selectOrder: '请选择订单',
        succ: '成功 !'
    },
    stock: {
        title: "FBA库存",
        table: {
            sku: "SKU",
            name: "名称",
            warehouse: "仓库",
            inventory: "库存",
            lock_inventory: "已计划出库库存",
            cartonNum: "箱号",
            num: "个/箱",
            total: "总数量",
            caseDetail: "箱号详情",
            status: "订单状态",
            inventoryType: "库存类型",
            orderType: "订单类型",
            number: "数量",
            lock_number: "已计划出库数量"
        },
        lock: "已计划出库",
        low_stocks: "库存不足",
        newSku: "新SKU是必填项",
        length: "长",
        width: "宽",
        height: "高",
        weight: "重",
        case: "箱",
        inventoryType: {
            FBA: "补货库存",
            FBA_RETURN: "退货库存"
        }
    },
    inventoryInvoice: {
        title: "FBA进销存",
        table: {
            sku: "SKU",
            skuName: "名称",
            warehouse: "仓库",
            type: "类型",
            businessCode: "订单号",
            qty: "数量",
            banlanceQty: "结存数量",
            createDate: "创建时间",
        },
    },
    plan: {
        title: "FBA补货计划",
        cancel: "取消",
        table: {
            sku: "SKU",
            qty: "数量",
            amazon: "亚马逊仓库",
            operating: "操作",
            trackingNum: "快递单号",
            status: "状态",
            unitsOfCase: "每箱个数",
            totalQty: "总数"
        },
        titleReturn: "FBA退货计划",
        titleReturnOrder: "FBA退货订单",
        createOutboundOrder: "生成退货订单",
    },
    order: {
        title: "FBA补货订单"
    },
    inbound: {
        title: "FBA入库预报",
        table: {
            orderID: "订单号",
            type: "类型",
            receivable: "应收",
            warehouse: "仓库"
        },
        truckTransshipment: "卡车转运模板",
        downloadTransshipment: "转运预报模板",
        transshipmentTips: "此模板适用入仓前已有FBA标签的货物",
        downloadReplenishment: "补货预报模板",
        replenishmentTips: "此模板适用入仓前没有FBA标签的货物",
        downloadReturnstorage: "退货预报模板",
        ReturnstorageTips: "此模板适用于入仓后需要退货的货物",
        REPLENISHMENT_INBOUND: "补货入库",
        TRANSPORT_INBOUND: "转运入库",
        REPLENISHMENT_OUTBOUND: "补货出库",
        TRANSPORT_OUTBOUND: "转运出库",
        FBA_REPLENISHMENT_INBOUND: "补货入库",
        FBA_TRANSPORT_INBOUND: "转运入库",
        FBA_RETURNSTORAGE_INBOUND: "退货入库",
        FBA_REPLENISHMENT_OUTBOUND: "补货出库",
        FBA_TRANSPORT_OUTBOUND: "转运出库",

        refNumber: "客户订单号",
        unitsPerCase: "每箱(板)数量",
        numberOfCases: "箱(板)数",
        qty: "数量",
        PENDING: "待入库",
        PROCESSING: "处理中",
        COMPLETED: "已入库",
        CANCELLED: "已取消",
        PENDING_APPROVAL: "待审核",
        REFUSE: "审核未通过",
        NEW: "待审核", //待审核
        CONFIRMED: "待入库", // 已预报
        DONE: "已入库", // 已完成
        DELETED: "已取消", // 已取消
        ERROR: "错误",
        WARNING: "警告",

        detail: "明细",
        time: "时间",
        details: "详情",
        stockIn: "已入库"
    },
    outbound: {
        PENDING: "待出库",
        COMPLETED: "已出库",
        CANCELLED: "已取消",
        PENDING_APPROVAL: "待审核",
        REFUSE: "审核未通过",
        NEW: "待审核", //待审核
        CONFIRMED: "待出库", // 已预报
        DONE: "已出库", // 已完成
        DELETED: "已取消", // 已取消
        ERROR: "错误",
        WARNING: "警告",
        channels: "渠道"
    },
    transport: {
        title: "FBA转运出库",
        awb: "运单号"
    },
    label: {
        title: "FBA退货换标",
        orderInfo: "订单信息",
        priority: "出库优先级",
        common: "普通",
        urgent: "加急",
        customerOrderId: "客户订单号",
        country: "国家",
        state: "省份",
        city: "城市",
        address: "详细地址",
        postalCode: "邮编",
        recipients: "收件人",
        phone: "联系电话",
        email: "电子邮箱",
        declaredInfo: "申报信息",
        purchase: "是否购买保险",
        yes: "是",
        no: "否",
        currency: "货币种类",
        category: "申报产品类别",
        insurance: "保险金额",
        logisticAddress: "物流面单地址",
        logisticProduct: "物流产品",
        packingList: "装箱单",
        ptag: "产品标签",
        labelFormat: "请使用商品标签格式",
        pdetail: "申报商品详情",
        operate: "操作",
        goods: {
            gift: "礼物",
            document: "文件",
            sample: "商品样本",
            others: "其它"
        }
    },
    profile: {
        registerInfo: '注册信息',
        passwordModify: '修改密码',
        name: '姓名',
        phone: '电话',
        address: '地址',
        oldpwd: '原 密 码',
        newpwd: '修改密码',
        chkpwd: '确认密码'
    }
}