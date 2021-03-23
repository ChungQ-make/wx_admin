<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-col :span="8">
        <el-input
          placeholder="输入订单编号、商品名称或买家名称查找"
          class="input-with-select"
          v-model="queryInfo.query"
          clearable
          @keyup.enter.native="getOrderList"
          @clear="getOrderList"
        >
          <el-button
            icon="el-icon-search"
            slot="append"
            @click="getOrderList"
          ></el-button>
        </el-input>
      </el-col>
      <!-- 表格信息区 -->
      <el-table :data="orderList" border style="width: 100%">
        <el-table-column type="index" label="#" fixed></el-table-column>
        <el-table-column label="订单编号" width="150" fixed prop="order_id">
        </el-table-column>
        <el-table-column label="商品名称" width="140">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              :content="scope.row.goods_id + ''"
              placement="top"
            >
              <el-tag>{{ scope.row.goods_name }}</el-tag>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="goods_price" label="单价（￥）" width="120">
        </el-table-column>
        <el-table-column prop="totalNum" label="购买数量" width="120">
        </el-table-column>
        <el-table-column prop="totalPrice" label="总价（￥）" width="120">
        </el-table-column>
        <el-table-column label="商家名称" width="120">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              :content="scope.row.seller_id"
              placement="top"
            >
              <el-tag type="success">{{ scope.row.seller_name }}</el-tag>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="购买人" width="120">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              :content="scope.row.buyer_id"
              placement="top"
            >
              <el-tag type="warning">{{ scope.row.buyer_name }}</el-tag>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="telNumber" label="联系方式" width="120">
        </el-table-column>
        <el-table-column label="收货地址" width="140" prop="address">
        </el-table-column>
        <el-table-column label="创建时间" width="140">
          <template slot-scope="scope">
            {{ scope.row.created_time | dateFormate }}
          </template>
        </el-table-column>
        <el-table-column label="商品状态" width="140">
          <template slot-scope="scope">
            <el-tag :type="state[scope.row.status].type">{{
              state[scope.row.status].text
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeByID(scope.row.order_id)"
            ></el-button>
            <el-tooltip
              effect="dark"
              content="更改状态"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="showStateVisable(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--分页区域-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[8, 12, 16, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 订单修改 -->
    <el-dialog
      title="订单修改"
      :visible.sync="editDialogVisable"
      width="50%"
      @close="clearEditFrom"
    >
      <el-card class="box-card">
        <el-form
          :model="editOrderInfo"
          :rules="editOrderFromRulers"
          ref="editOrderFromRef"
          label-width="100px"
        >
          <el-form-item label="收货地址" prop="address">
            <el-input v-model="editOrderInfo.address"></el-input>
          </el-form-item>
          <el-form-item label="邮政编码" prop="postalCode">
              <el-input v-model="editOrderInfo.postalCode"></el-input>
          </el-form-item>
          <el-form-item label="联系方式" prop="telNumber">
    <el-input v-model="editOrderInfo.telNumber"></el-input>
          </el-form-item>
          <el-form-item label="订单描述" prop="description">
            <el-input
              v-model="editOrderInfo.description"
              type="textarea"
              :rows="6"
            ></el-input>
          </el-form-item>
        </el-form>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisable = false">取 消</el-button>
        <el-button type="primary" @click="saveEditOrderInfo">确 定</el-button>
      </span>
    </el-dialog>
        <!-- 状态更改 -->
    <el-dialog
      title="更改订单状态"
      :visible.sync="stateDialogVisible"
      width="50%"
      @close="clearsStateVisible"
    >
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>订单状态（请谨慎操作）</span>
        </div>
        <el-radio-group
          v-model="stateform.status"
          v-for="item in state"
          :key="item.status"
        >
          <el-radio :label="item.status">{{ item.text }}</el-radio>
        </el-radio-group>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button @click="stateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editOrderState">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import citydata from '../../plugins/citydata'
export default {
  data () {
    return {
      stateDialogVisible: false,
      queryInfo: {
        // 搜索关键字
        query: '',
        // 当前页数
        pagenum: 1,
        // 每页显示多少数据
        pagesize: 8
      },
      orderList: [],
      total: 0,
      //   存放状态数据和样式
      state: [
        // 0 已支付(待发货)
        // 1 待收货
        // 2 交易完成
        // 3 退货申请中
        // 4 退货处理中
        // 5 退货完成
        { type: '', text: '待发货', status: 0 },
        { type: 'warning', text: '待收货', status: 1 },
        { type: 'success', text: '已收货', status: 2 },
        { type: 'danger', text: '退货申请中', status: 3 },
        { type: 'warning', text: '退货处理中', status: 4 },
        { type: 'info', text: '退货完成', status: 5 }
      ],
      editDialogVisable: false,
      editOrderInfo: {},
      editOrderFromRulers: {
        address: [
          {
            required: true,
            message: '请输入收货地址',
            trigger: 'blur'
          }
        ],
        postalCode: [
          {
            required: true,
            message: '请输入邮政编码',
            trigger: 'blur'
          }
        ],
        telNumber: [
          { required: true, message: '请输入手机号', trigger: 'blur' }/* ,
          {
            pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/,
            message: '请输入正确的手机号格式'
          } */
        ]
      },
      stateform: {
        status: 0,
        order_id: ''
      }
    }
  },
  methods: {
    async getOrderList () {
      const { data: res } = await this.$http.get('/order/list', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取订单列表失败！')
      }
      this.orderList = res.data.orderList
      this.total = res.data.total
    },
    // 监听pagesize改变的事件
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    // 监听页码值改变的事件
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    showEditDialog (orderInfo) {
      this.editOrderInfo = orderInfo
      this.editDialogVisable = true
    },
    clearEditFrom () {
    //   this.$refs.editOrderFromRef.resetFields()
      this.editOrderInfo = {}
    },
    // 保存修改数据
    async saveEditOrderInfo () {
      // 进行预验证
      this.$refs.editOrderFromRef.validate(async (vaild) => {
        if (!vaild) return this.$message.error('修改订单信息失败！')
        //  发起修改用户信息请求
        const { editOrderInfo } = this
        const { data: res } = await this.$http.post('/order/update', {
          editOrderInfo
        })
        if (res.meta.status !== 200) {
          return this.$message.error('更新订单信息失败！')
        }
        // 关闭对话框
        this.editDialogVisable = false
        // 刷新数据列表
        this.getOrderList()
        this.$message.success('更新订单信息成功！')
      })
    },
    // 删除订单
    async removeByID (orderID) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该订单, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
          // 确认返回 字符串confirm
        }
      ).catch((err) => err)
      // 取消返回字符串 cancel
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.post('/order/delete', {
        order_id: orderID
      })
      if (res.meta.status !== 200) {
        return this.$message.error('删除商品失败！')
      }
      this.$message.success('删除商品成功')
      this.getOrderList()
    },
    showStateVisable (orderInfo) {
      const { status, order_id: orderID } = orderInfo
      this.stateform = {
        status,
        order_id: orderID
      }
      this.stateDialogVisible = true
    },
    async editOrderState () {
      const confirmResult = await this.$confirm(
        '此操作将改变此订单状态, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
          // 确认返回 字符串confirm
        }
      ).catch((err) => err)
      // 取消返回字符串 cancel
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消更改')
      }
      const { data: res } = await this.$http.post(
        '/order/state',
        this.stateform
      )
      if (res.meta.status !== 200) {
        return this.$message.error('更新订单状态失败！')
      }
      // 关闭对话框
      this.stateDialogVisible = false
      // 刷新数据列表
      this.getOrderList()
      this.$message.success('更新订单状态成功！')
    },
    clearsStateVisible () {
      this.stateform = {
        status: 0,
        order_id: ''
      }
    }
  },
  mounted () {
    this.getOrderList()
  }
}
</script>

<style scoped lang="less">
.box-card {
  margin-top: 10px;
}
.input-with-select{
    margin-bottom: 10px;
}
.el-radio {
  margin-left: 15px;
}
</style>
