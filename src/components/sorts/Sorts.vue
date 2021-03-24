<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>分类管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-button type="primary" v-on:click="addDialogVisable = true"
            >添加新的分类</el-button
          >
        </el-col>
      </el-row>
      <el-table :data="sortList" stripe border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="" align="center" width="75">
          <template slot-scope="scope">
            <div class="block">
              <el-avatar
                :size="50"
                :src="scope.row.category_imgUrl"
                fit="cover"
              ></el-avatar>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="sort_name"
          label=" 分类名称"
          width="120px"
        ></el-table-column>
        <el-table-column
          prop="_id"
          label="编号"
          width="200px"
        ></el-table-column>
        <el-table-column prop="description" label="描述"></el-table-column>
        <el-table-column label="创建时间" width="150px">
          <template slot-scope="scope">
            {{ scope.row.created_time | dateFormate }}
          </template>
        </el-table-column>
        <el-table-column label="是否展示" width="150px">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.category_show"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="changeState(scope.row)"
            >
            </el-switch>
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
              @click="removeByID(scope.row._id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加新分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addDialogVisable"
      width="35%"
      @close="clearFromInfo"
    >
      <!--添加分类表单-->
      <el-form
        :model="addFrom"
        :rules="addFromRulers"
        ref="addFromRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="sort_name">
          <el-input v-model="addFrom.sort_name"></el-input>
        </el-form-item>
        <el-form-item label="分类描述">
          <el-input
            v-model="addFrom.description"
            type="textarea"
            :rows="6"
          ></el-input>
        </el-form-item>
        <el-form-item label="展示状态">
          <el-switch
            v-model="addFrom.category_show"
            active-color="#13ce66"
            inactive-color="#ff4949"
          >
          </el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisable = false">取 消</el-button>
        <el-button type="primary" @click="addSort">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分类信息修改 -->
    <el-dialog
      title="分类信息修改"
      :visible.sync="editDialogVisable"
      width="50%"
      @close="clearEditFrom"
    >
      <el-card class="box-card">
        <el-form
          :model="editSortInfo"
          :rules="editSortFromRulers"
          ref="editFromRef"
          label-width="100px"
        >
          <el-form-item label="分类名称" prop="sort_name">
            <el-input v-model="editSortInfo.sort_name"></el-input>
          </el-form-item>
          <el-form-item label="分类描述">
            <el-input
              v-model="editSortInfo.description"
              type="textarea"
              :rows="6"
            ></el-input>
          </el-form-item>
          <el-form-item label="展示状态">
            <el-switch
              v-model="editSortInfo.category_show"
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
            </el-switch>
          </el-form-item>
        </el-form>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisable = false">取 消</el-button>
        <el-button type="primary" @click="saveEditInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      sortList: [],
      addDialogVisable: false,
      addFrom: {
        sort_name: '',
        description: '',
        category_show: true
      },
      addFromRulers: {
        sort_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      editDialogVisable: false,
      editSortInfo: {},
      editSortFromRulers: {
        sort_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async getCategoryData () {
      const { data: res } = await this.$http.get('/sorts/sortlist')
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类列表失败！')
      }
      this.sortList = res.data
    },
    // 更改战时状态
    async changeState (sortInfo) {
      const { data: res } = await this.$http.post('/sorts/update', {
        sortInfo
      })
      if (res.meta.status !== 200) {
        sortInfo.category_show = !sortInfo.category_show
        return this.$message.error('更新分类状态失败！')
      }
      this.$message.success('更新分类状态成功！')
      this.getCategoryData()
    },
    clearFromInfo () {
      // 清除表单数据
      this.$refs.addFromRef.resetFields()
      //   this.addForm = {}
    },
    //  添加新分类
    addSort () {
      // 进行预校验
      this.$refs.addFromRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error('添加分类失败！')
        }
        const { data: res } = await this.$http.post('/sorts/add', {
          addFrom: this.addFrom
        })
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败！')
        }
        this.$message.success('添加分类成功！')
        // 隐藏对话框
        this.addDialogVisable = false
        // 刷新数据
        this.getCategoryData()
      })
    },
    // 删除分类
    async removeByID (_id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该分类, 是否继续?',
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
      const { data: res } = await this.$http.post('/sorts/delete', {
        _id
      })
      if (res.meta.status !== 200) {
        return this.$message.error('删除分类失败！')
      }
      this.$message.success('删除分类成功')
      this.getCategoryData()
    },
    showEditDialog (sortInfo) {
      const newObj = JSON.parse(JSON.stringify(sortInfo))
      this.editSortInfo = newObj
      this.editDialogVisable = true
    },
    clearEditFrom () {
      this.$refs.editFromRef.resetFields()
      this.editSortInfo = {}
    },
    // 保存修改数据
    async saveEditInfo () {
      // 进行预验证
      this.$refs.editFromRef.validate(async (vaild) => {
        if (!vaild) return this.$message.error('修改分类信息失败！')
        //  发起修改用户信息请求
        const { editSortInfo } = this
        const { data: res } = await this.$http.post('/sorts/update', {
          sortInfo: editSortInfo
        })
        if (res.meta.status !== 200) {
          return this.$message.error('更新分类信息失败！')
        }
        // 关闭对话框
        this.editDialogVisable = false
        // 刷新数据列表
        this.getCategoryData()
        this.$message.success('更新分类信息成功！')
      })
    }
  },
  mounted () {
    this.getCategoryData()
  }
}
</script>

<style scoped lang="less">
</style>
