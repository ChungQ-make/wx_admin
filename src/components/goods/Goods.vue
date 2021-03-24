<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品审核</el-breadcrumb-item>
    </el-breadcrumb>
    <el-alert
      title="点击商品名称标签查看该商品图片详情"
      type="warning"
      :closable="true"
      show-icon
    >
    </el-alert>
    <!--卡片视图区-->
    <el-card class="box-card">
      <!--搜索用户区-->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="输入商品编号、商家名称或商品名称查找"
            class="input-with-select"
            v-model="queryInfo.query"
            clearable
            @keyup.enter.native="getGoodsList"
            @clear="getGoodsList"
          >
            <el-button
              icon="el-icon-search"
              slot="append"
              @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="goodsList" border style="width: 100%">
        <el-table-column type="index" label="#" fixed></el-table-column>
        <el-table-column label="商品名称"  fixed>
          <template slot-scope="scope">
            <el-tag @click="showImg(scope.row.goods_imgUrl)">{{
              scope.row.goods_name
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="goods_id" label="商品编号" width="150">
        </el-table-column>
        <el-table-column prop="goods_price" label="单价（￥）" width="120">
        </el-table-column>
        <el-table-column prop="stocks" label="上架数量" width="120">
        </el-table-column>
        <el-table-column prop="seller" label="商家名称" width="120">
            <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              :content="scope.row.seller_id"
              placement="top"
            >
              <el-tag type="info">{{ scope.row.seller }}</el-tag>
            </el-tooltip>
            </template>
        </el-table-column>
        <!-- <el-table-column prop="seller_id" label="商家账号" width="270">
        </el-table-column> -->
        <el-table-column prop="telNumber" label="联系方式" >
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
              @click="removeByID(scope.row.goods_id)"
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
    <!-- 图片展示 -->
    <el-dialog
      title="图片展示"
      :visible.sync="imgShowVisable"
      width="60%"
      @close="clearImgShowVisable"
    >
      <el-card class="box-card">
        <el-carousel :interval="4000" type="card" height="300px">
          <el-carousel-item v-for="(item, index) in imgArr" :key="index">
            <el-image :src="item" fit="scale-down"></el-image>
          </el-carousel-item>
        </el-carousel>
      </el-card>
    </el-dialog>
    <!-- 修改 -->
    <el-dialog
      title="商品修改"
      :visible.sync="editDialogVisable"
      width="50%"
      @close="clearEditGoodFrom"
    >
      <el-card class="box-card">
        <el-form
          :model="editGoodsInfo"
          :rules="editGoodFromRulers"
          ref="editGoodFromRef"
          label-width="100px"
        >
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="editGoodsInfo.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input-number
              v-model="editGoodsInfo.goods_price"
              :precision="1"
              :step="0.1"
              :min="0"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="商品数量" prop="stocks">
            <el-input-number
              v-model="editGoodsInfo.stocks"
              :step="10"
              :min="0"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="商品描述" prop="description">
            <el-input
              v-model="editGoodsInfo.description"
              type="textarea"
              :rows="6"
            ></el-input>
          </el-form-item>
          <el-form-item label="商品类型" prop="goods_type">
            <el-select
              v-model="editGoodsInfo.goods_type"
              placeholder="请选择商品类型"
              ><el-option
                v-for="(item, index) in sortsList"
                :key="index"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="联系方式" prop="telNumber">
            <el-input v-model="editGoodsInfo.telNumber"></el-input>
          </el-form-item>
        </el-form>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisable = false">取 消</el-button>
        <el-button type="primary" @click="saveEditGoodInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 状态更改 -->
    <el-dialog
      title="更改商品状态"
      :visible.sync="stateDialogVisible"
      width="50%"
      @close="clearsStateVisible"
    >
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>商品状态</span>
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
        <el-button type="primary" @click="editGoodsState">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      queryInfo: {
        // 搜索关键字
        query: '',
        // 当前页数
        pagenum: 1,
        // 每页显示多少数据
        pagesize: 8
      },
      total: 0,
      goodsList: [],
      //   存放状态数据和样式
      state: [
        { type: 'success', text: '正常出售', status: 0 },
        { type: '', text: '暂时缺货', status: 1 },
        { type: '', text: '暂停出售', status: 2 },
        { type: 'danger', text: '禁止出售', status: 3 },
        { type: 'warning', text: '待审核', status: 4 },
        { type: 'info', text: '审核不通过', status: 5 }
      ],
      //   存储展示的商品图链接片数据
      imgArr: [],
      imgShowVisable: false,
      //   更改窗口显示
      editDialogVisable: false,
      editGoodsInfo: {},
      editGoodFromRulers: {
        goods_type: [
          {
            required: true,
            message: '请选择商品类型',
            trigger: 'blur'
          }
        ],
        goods_name: [
          {
            required: true,
            message: '请输入商品名称',
            trigger: 'blur'
          }
        ],
        goods_price: [
          {
            required: true,
            message: '请输入商品价格',
            trigger: 'blur'
          }
        ],
        telNumber: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          {
            pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/,
            message: '请输入正确的手机号格式'
          }
        ]
      },
      sortsList: [],
      stateform: {
        status: 0,
        goods_id: ''
      },
      stateDialogVisible: false
    }
  },
  methods: {
    // 监听pagesize改变的事件
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    // 监听页码值改变的事件
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    async getGoodsList () {
      const { data: res } = await this.$http.get('/goods/list', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品审核列表失败！')
      }
      this.goodsList = res.data.goodsList
      this.total = res.data.total
    },
    // 展示商品图片窗口
    showImg (imgArr) {
      this.imgArr = imgArr
      this.imgShowVisable = true
    },
    clearImgShowVisable () {
      this.imgArr = []
      this.imgShowVisable = false
    },
    async showEditDialog (goodsInfo) {
    //   const { data: res } = await this.$http.get(
    //     `/goods/detail?goods_id=${goodsID}`
    //   )
    //   if (res.meta.status !== 200) {
    //     return this.$message.error('获取商品信息失败！')
    //   }
    //   this.editGoodsInfo = res.data
      // 这里借助JSON做一次对象深复制 也可以借助lodash 或者其他方法
      const newObj = JSON.parse(JSON.stringify(goodsInfo))
      this.editGoodsInfo = newObj
      this.editDialogVisable = true
    },
    clearEditGoodFrom () {
      this.$refs.editGoodFromRef.resetFields()
      this.editGoodsInfo = {}
    },
    // 保存修改信息
    async saveEditGoodInfo () {
      // 进行预验证
      this.$refs.editGoodFromRef.validate(async (vaild) => {
        if (!vaild) return this.$message.error('修改商品信息失败！')
        //  发起修改用户信息请求
        const { editGoodsInfo } = this
        const { data: res } = await this.$http.post('/goods/update', {
          editGoodsInfo
        })
        if (res.meta.status !== 200) {
          return this.$message.error('更新商品信息失败！')
        }
        // 关闭对话框
        this.editDialogVisable = false
        // 刷新数据列表
        this.getGoodsList()
        this.$message.success('更新商品信息成功！')
      })
    },
    // 获取分类名单
    async getSortData () {
      const { data: res } = await this.$http.get('/sorts/list')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类数据失败！')
      }
      this.sortsList = res.data
    },
    // 删除指定商品
    async removeByID (goodsID) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该商品, 是否继续?',
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
      const { data: res } = await this.$http.post('/goods/delete', {
        goods_id: goodsID
      })
      if (res.meta.status !== 200) {
        return this.$message.error('删除商品失败！')
      }
      this.$message.success('删除商品成功')
      this.getGoodsList()
    },
    showStateVisable (goodsItem) {
      const { status, goods_id: goodsID } = goodsItem
      this.stateform = {
        status,
        goods_id: goodsID
      }
      this.stateDialogVisible = true
    },
    clearsStateVisible () {
      this.stateform = {
        status: 0,
        goods_id: ''
      }
    },
    // 商品状态更改
    async editGoodsState () {
      const { data: res } = await this.$http.post(
        '/goods/state',
        this.stateform
      )
      if (res.meta.status !== 200) {
        return this.$message.error('更新商品状态失败！')
      }
      // 关闭对话框
      this.stateDialogVisible = false
      // 刷新数据列表
      this.getGoodsList()
      this.$message.success('更新商品状态成功！')
    }
  },
  mounted () {
    this.getGoodsList()
    this.getSortData()
  }
}
</script>

<style scoped lang="less">
.box-card {
  margin-top: 10px;
}
.el-radio {
  margin-left: 15px;
}
</style>
