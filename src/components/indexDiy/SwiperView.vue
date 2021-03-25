<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>布局管理</el-breadcrumb-item>
      <el-breadcrumb-item>轮播图</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-carousel :interval="4000" type="card" height="300px">
        <el-carousel-item v-for="item in swiperData" :key="item.goods_id">
          <el-image :src="item.image_src" fit="scale-down"></el-image>
        </el-carousel-item>
      </el-carousel>
    </el-card>
    <el-card>
      <div slot="header" class="clearfix">
        <span>轮播图设置</span>
        <el-button
          style="float: right; margin-left: 5px"
          type="warning"
          @click="toPictureBed"
          >在线图床</el-button
        >
        <el-button
          style="float: right"
          type="primary"
          @click="addDialogVisable = true"
          >添加轮播项</el-button
        >
      </div>
      <el-table :data="swiperData" stripe border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column
          prop="goods_name"
          label="商品名称"
          width="120px"
        ></el-table-column>
        <el-table-column
          prop="goods_id"
          label="商品编号"
          width="200px"
        ></el-table-column>
        <el-table-column
          prop="open_type"
          label="类型"
          width="120px"
        ></el-table-column>
        <el-table-column
          prop="navigator_url"
          label="商品路径"
        ></el-table-column>
        <el-table-column label="操作" width="120px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.$index, scope.row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeByID(scope.$index)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 轮播图信息修改 -->
    <el-dialog
      title="轮播图信息修改"
      :visible.sync="editDialogVisable"
      width="45%"
      @close="clearEditFrom"
    >
      <el-card class="box-card">
        <el-form
          :model="editSwiperInfo"
          :rules="editFromRulers"
          ref="editFromRef"
          label-width="100px"
        >
          <el-form-item label="商品编号" prop="goods_id">
            <el-input
              v-model="editSwiperInfo.goods_id"
              @change="changeUrl"
              type="number"
            ></el-input>
          </el-form-item>
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="editSwiperInfo.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品链接">
            <el-input
              v-model="editSwiperInfo.navigator_url"
              disabled
            ></el-input>
          </el-form-item>
            <el-form-item label="轮播图链接" prop="image_src">
          <el-input v-model="editSwiperInfo.image_src"></el-input>
        </el-form-item>
      </el-form>
      <el-alert
        title="↓↓ 图片预览 ↓↓"
        type="success"
        :closable="false"
        center=""
      >
      </el-alert>
      <el-image
        :src="editSwiperInfo.image_src"
        class="addimg"
        v-show="editSwiperInfo.image_src"
      ></el-image>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisable = false">取 消</el-button>
        <el-button type="primary" @click="saveEditInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!--  添加新的轮播项 -->
    <el-dialog
      title="添加轮播项"
      :visible.sync="addDialogVisable"
      width="45%"
      @close="clearFromInfo"
    >
      <!--添加轮播项表单-->
      <el-form
        :model="addFrom"
        :rules="addFromRulers"
        ref="addFromRef"
        label-width="100px"
      >
        <el-form-item label="商品编号" prop="goods_id">
          <el-tooltip
            class="item"
            effect="dark"
            :content="
              addFrom.goods_name ? '已获取该商品数据' : '该商品不存在！'
            "
            placement="top"
          >
            <el-input
              v-model="addFrom.goods_id"
              @input="searchGoodsInfo"
              type="number"
            ></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="addFrom.goods_name" disabled></el-input>
        </el-form-item>
        <el-form-item label="商品链接" prop="navigator_url">
          <el-input v-model="addFrom.navigator_url" disabled></el-input>
        </el-form-item>
        <el-form-item label="轮播图链接" prop="image_src">
          <el-input v-model="addFrom.image_src"></el-input>
        </el-form-item>
      </el-form>
      <el-alert
        title="↓↓ 图片预览 ↓↓"
        type="success"
        :closable="false"
        center=""
      >
      </el-alert>
      <el-image
        :src="addFrom.image_src"
        class="addimg"
        v-show="addFrom.image_src"
      ></el-image>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisable = false">取 消</el-button>
        <el-button type="primary" @click="saveAddSwiperForm" :disabled="!addFrom.goods_name">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      swiperData: [],
      editDialogVisable: false,
      editSwiperInfo: {},
      editFromRulers: {
        goods_id: [
          { required: true, message: '请输入商品编号', trigger: 'blur' }
        ],
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        image_src: [
          { required: true, message: '请输入有效轮播图链接', trigger: 'blur' }
        ]
      },
      //   保存修改的元素索引
      index: 0,
      addDialogVisable: false,
      addFrom: {
        goods_id: '',
        goods_name: '',
        image_src: '',
        open_type: 'navigate',
        navigator_url: ''
      },
      addFromRulers: {
        goods_id: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        navigator_url: [
          { required: true, message: '请输入商品链接', trigger: 'blur' }
        ],
        image_src: [
          { required: true, message: '请输入有效轮播图链接', trigger: 'blur' }
        ]
      },
      timer: -1
    }
  },
  methods: {
    async getSwiperData () {
      const { data: res } = await this.$http.get('/home/swiper ')
      if (res.meta.status !== 200) {
        return this.$message.error('获取轮播图数据失败！')
      }
      this.swiperData = res.data.swiper
    },
    clearEditFrom () {
      this.$refs.editFromRef.resetFields()
      this.editSwiperInfo = {}
    //   this.editDialogVisable = false
    },
    // showEditDialog(scope.$index,scope.row) 为固定顺序参数 同时传递两个参数（行索引，行数据）
    showEditDialog (index, swieprItem) {
      this.index = index
      // 这里借助JSON做一次对象深复制 也可以借助lodash 或者其他方法
      const newObj = JSON.parse(JSON.stringify(swieprItem))
      this.editSwiperInfo = newObj
      this.editDialogVisable = true
    },
    async saveEditInfo () {
      // 进行预验证
      this.$refs.editFromRef.validate(async (vaild) => {
        if (!vaild) return this.$message.error('修改信息失败！')
        //  发起修改用户信息请求
        const { editSwiperInfo, index } = this
        const { data: res } = await this.$http.post('/home/swiper/update', {
          swiperInfo: editSwiperInfo,
          index
        })
        if (res.meta.status !== 200) {
          return this.$notify.error('修改信息失败！')
        }
        // 关闭对话框
        this.editDialogVisable = false
        // 刷新数据列表
        this.getSwiperData()
        this.$notify.success('修改信息添加成功！')
      })
    },
    changeUrl () {
      this.editSwiperInfo.navigator_url = this.navigatorUrl
    },
    async removeByID (index) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该项, 是否继续?',
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
      const { data: res } = await this.$http.post('/home/swiper/delete', {
        index
      })
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败！')
      }
      this.$message.success('删除成功!')
      this.getSwiperData()
    },
    clearFromInfo () {
      // 清除表单数据
      this.$refs.addFromRef.resetFields()
      //   this.addForm = {}
    },
    async saveAddSwiperForm () {
      this.$refs.addFromRef.validate(async (vaild) => {
        if (!vaild) return this.$message.error('添加失败！')
        //  发起修改用户信息请求
        const { addFrom } = this
        const { data: res } = await this.$http.post('/home/swiper/add', {
          newItem: addFrom
        })
        if (res.meta.status !== 201) {
          return this.$notify.error('添加失败！')
        }
        // 关闭对话框
        this.addDialogVisable = false
        // 刷新数据列表
        this.getSwiperData()
        this.$notify.success('添加成功！')
      })
    },
    // 在线查找商品数据
    async searchGoodsInfo () {
      // 设置定时器 防抖
      clearTimeout(this.timer)
      this.timer = setTimeout(async () => {
        const { data: res } = await this.$http.get(
          `/goods/detail?goods_id=${this.addFrom.goods_id}`
        )
        if (res.meta.status !== 200) {
          this.$refs.addFromRef.resetFields()
          return this.$message.error('该商品不存在！')
        }
        const { goods_name: goodsName } = res.data
        this.addFrom.goods_name = goodsName
        this.addFrom.navigator_url = this.addNavigatorUrl
      }, 1000)
    },
    toPictureBed () {
      //  原直接跳转方式
      //   window.location.href = 'http://localhost:5000/api/private/v1/home/uploadHome''

      // 新窗口打开图床页面
      window.open('http://localhost:5000/api/private/v1/home/uploadHome')
    }
  },
  mounted () {
    this.getSwiperData()
  },
  computed: {
    navigatorUrl: function () {
      return `/pages/goods_detail/main?goods_id=${this.editSwiperInfo.goods_id}`
    },
    addNavigatorUrl: function () {
      return `/pages/goods_detail/main?goods_id=${this.addFrom.goods_id}`
    }
  }
}
</script>

<style scoped lang="less">
.box-card {
  margin-bottom: 10px;
}
.clearfix {
  margin-bottom: 10px;
}
.addimg {
  width: 100%;
  margin-top: 5px;
}
</style>
