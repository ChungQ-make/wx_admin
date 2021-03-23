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
    <!-- 审核列表 -->
    <el-card class="box-card">
      <el-table :data="auditList" border style="width: 100%">
        <el-table-column type="index" label="#" fixed></el-table-column>
        <el-table-column label="商品名称" width="140" fixed>
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
        </el-table-column>
        <el-table-column prop="seller_id" label="商家账号" width="270">
        </el-table-column>
        <el-table-column prop="telNumber" label="联系方式" width="120">
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button
              type="success"
              size="mini"
              @click="isAllow(scope.row.goods_id, true)"
              >通过</el-button
            >
            <el-button
              type="danger"
              size="mini"
              @click="isAllow(scope.row.goods_id, false)"
              >驳回</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!--分页区域-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[6, 10, 14, 20]"
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
        <!-- <div slot="header" class="clearfix">
          <span>图片展示</span>
        </div> -->
        <el-carousel :interval="4000" type="card" height="300px">
          <el-carousel-item v-for="(item, index) in imgArr" :key="index">
            <!-- <h3 class="medium">{{ item }}</h3> -->
            <!-- <img :src="item" alt=""> -->
            <el-image
              :src="item"
              fit="scale-down"
            ></el-image>
          </el-carousel-item>
        </el-carousel>
      </el-card>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      auditList: [],
      queryInfo: {
        // 当前页数
        pagenum: 1,
        // 每页显示多少数据
        pagesize: 6
      },
      total: 0,
      //   存储展示的商品图链接片数据
      imgArr: [],
      imgShowVisable: false
    }
  },
  methods: {
    async getAuditData () {
      const { data: res } = await this.$http.get('/goods/audit', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品审核列表失败！')
      }
      this.auditList = res.data.auditList
      this.total = res.data.total
    },
    // 监听pagesize改变的事件
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getAuditData()
    },
    // 监听页码值改变的事件
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getAuditData()
    },
    // 商品是否审核通过事件
    async isAllow (goodsID, flag) {
      //   console.log('goodsID ------->' + goodsID)
      //   console.log('flag --------->' + flag)
      const { data: res } = await this.$http.post('/goods/audit', {
        goods_id: goodsID,
        flag
      })
      if (res.meta.status !== 200) {
        return this.$message.error('操作失败！')
      }
      this.getAuditData()
    },
    // 展示商品图片窗口
    showImg (imgArr) {
      this.imgArr = imgArr
      this.imgShowVisable = true
    },
    clearImgShowVisable () {
      this.imgArr = []
      this.imgShowVisable = false
    }
  },
  mounted () {
    this.getAuditData()
  }
}
</script>

<style scoped lang="less">
.box-card {
  margin-top: 10px;
}
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
