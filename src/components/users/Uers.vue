<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区-->
    <el-card class="box-card">
      <!--搜索用户区-->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="输入用户名或openid查找"
            class="input-with-select"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
             @keyup.enter.native="getUserList"
          >
            <el-button
              icon="el-icon-search"
              slot="append"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!--用户列表区-->
      <el-table :data="userList" stripe border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="" align="center" width="75">
          <template slot-scope="scope">
            <div class="block"><el-avatar :size="50" :src="scope.row.avatarUrl"></el-avatar></div>
          </template>
        </el-table-column>
        <el-table-column
          prop="nickName"
          label="用户名"
          width="120px"
        ></el-table-column>
        <el-table-column prop="openid" label="openid"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column
          prop="money"
          label="余额（￥）"
          width="100px"
        ></el-table-column>
        <el-table-column label="创建时间" width="150px">
          <template slot-scope="scope">
            {{ scope.row.created_time | dateFormate }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100px">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 0" type="success"
              >正常状态</el-tag
            >
            <el-tag v-else-if="scope.row.status === 1" type="danger">禁止售卖</el-tag>
            <el-tag  v-else type="warning">禁止登录</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
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
              @click="removeByID(scope.row.openid)"
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
        :page-sizes="[6, 8, 12, 16]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!--修改用户对话框-->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editDialogVisible"
      width="35%"
      @close="clearEditFromInfo"
    >
      <el-form
        :model="editForm"
        :rules="editFromRulers"
        ref="editFromRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="nickName">
          <el-input v-model="editForm.nickName"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="editForm.gender">
            <el-radio :label="0">女</el-radio>
            <el-radio :label="1">男</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="余额">
          <el-input v-model="editForm.money" disabled></el-input>
        </el-form-item>
        <el-form-item label="在线充值">
          <el-input-number
            v-model="topUps"
            controls-position="right"
            :step="100"
            :min="0"
            :max="2000"
          ></el-input-number>
          &nbsp;&nbsp;&nbsp;&nbsp;<span style="color: green" v-show="topUps > 0"
            >+ ￥{{ topUps }}.0</span
          >
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 状态更改 -->
    <el-dialog
      title="更改用户状态"
      :visible.sync="stateDialogVisible"
      width="35%"
      @close="clearsStateVisible"
    >
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>用户状态</span>
        </div>
        <el-radio-group v-model="stateform.status">
          <el-tooltip
            class="item"
            effect="dark"
            content="正常状态"
            placement="top"
          >
            <el-radio :label="0">正常状态</el-radio>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="禁止出售任何商品"
            placement="top"
          >
            <el-radio :label="1">禁止售卖</el-radio>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="用户禁止登录"
            placement="top"
          >
            <el-radio :label="2">禁止登录</el-radio>
          </el-tooltip>
        </el-radio-group>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button @click="stateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserState">确 定</el-button>
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
        pagesize: 6
      },
      total: 0,
      userList: [],
      // 修改用户的对话框显示与隐藏
      editDialogVisible: false,
      // 修改时查询到的用户信息的对象
      editForm: {},
      editFromRulers: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {
            pattern: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/,
            message: '请输入正确的邮箱格式'
          }
        ],
        nickName: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ]
      },
      topUps: 0,
      stateDialogVisible: false,
      stateform: {
        status: 0,
        openid: ''
      }
    }
  },
  methods: {
    //   获取所有用户数据
    async getUserList () {
      const { data: res } = await this.$http.get('/users', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败！')
      }
      //   console.log(res.data)
      this.userList = res.data.userList
      this.total = res.data.total
    },
    // 监听pagesize改变的事件
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听页码值改变的事件
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 展示编辑用户的对话框
    async showEditDialog (userInfo) {
    //   const { data: res } = await this.$http.post('users/userInfo', { openid })
    //   //   console.log(res)
    //   if (res.meta.status !== 200) {
    //     return this.$message.error('获取用户信息失败！')
    //   }
    //   this.editForm = res.data
      // 这里借助JSON做一次对象深复制 也可以借助lodash 或者其他方法
      const newObj = JSON.parse(JSON.stringify(userInfo))
      this.editForm = newObj
      this.editDialogVisible = true
    },
    //  清除修改表单的对话框(目的是重置修改表单的验证结果)
    clearEditFromInfo () {
      this.topUps = 0
      this.$refs.editFromRef.resetFields()
    },
    // 提交修改的表单数据
    editUserInfo () {
      // 进行预验证
      this.$refs.editFromRef.validate(async (vaild) => {
        if (!vaild) return this.$message.error('修改用户信息失败！')
        //  发起修改用户信息请求
        const { editForm } = this
        editForm.money += this.topUps
        const { data: res } = await this.$http.post('/users/editUser', {
          editForm
        })
        if (res.meta.status !== 200) {
          return this.$message.error('更新用户信息失败！')
        }
        // 关闭对话框
        this.editDialogVisible = false
        // 刷新数据列表
        this.getUserList()
        this.$refs.editFromRef.resetFields()
        this.$message.success('更新用户信息成功！')
      })
    },
    //  删除用户操作
    async removeByID (openid) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
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
      const { data: res } = await this.$http.post('users/delete', { openid })
      if (res.meta.status !== 200) {
        return this.$message.error('删除用户失败！')
      }
      this.$message.success('删除用户成功')
      this.getUserList()
    },
    showStateVisable (user) {
      const { status, openid } = user
      this.stateform = {
        status,
        openid
      }
      this.stateDialogVisible = true
    },
    clearsStateVisible () {
      this.stateform = {
        status: 0,
        openid: ''
      }
    },
    async editUserState () {
      const { data: res } = await this.$http.post('/users/state', this.stateform)
      if (res.meta.status !== 200) {
        return this.$message.error('更新用户状态失败！')
      }
      // 关闭对话框
      this.stateDialogVisible = false
      // 刷新数据列表
      this.getUserList()
      this.$message.success('更新用户状态成功！')
    }
  },
  mounted () {
    this.getUserList()
  }
}
</script>

<style lang="less" scoped>
</style>
