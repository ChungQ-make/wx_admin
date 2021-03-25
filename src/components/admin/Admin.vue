<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>账号管理</el-breadcrumb-item>
      <el-breadcrumb-item>账号列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区-->
    <el-card class="box-card">
      <!--搜索用户区-->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入用户名搜索"
            class="input-with-select"
            v-model="queryInfo.query"
            clearable
            @clear="getAdminList"
          >
            <el-button
              icon="el-icon-search"
              slot="append"
              @click="getAdminList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button
            type="primary"
            v-on:click="addDialogVisable = true"
            v-show="userInfo.status === 0"
            >添加账号</el-button
          >
        </el-col>
      </el-row>
      <!--用户列表区-->
      <el-table :data="adminList" stripe border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="账号"></el-table-column>
        <el-table-column label="密码">
          <template slot-scope="scope">
            <a
              href="#"
              @click.stop.prevent="showPassword(scope.row.username)"
              v-show="userInfo.status === 0"
            >
              <i class="el-icon-view"></i>
            </a>
            <span class="password">{{
              (userInfo.status === 0) & showUser === scope.row.username
                ? scope.row.password
                : "**********"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="性别">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.gender === -1" type="info"> 保密 </el-tag>
            <el-tag v-else-if="scope.row.gender === 0"> 女 </el-tag>
            <el-tag v-else type="warning"> 男 </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="role" label="角色"></el-table-column>
        <el-table-column label="创建时间" width="150px">
          <template slot-scope="scope">
            {{ scope.row.created_time | dateFormate }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="140">
          <template slot-scope="scope">
            <el-tag :type="state[scope.row.status].type">{{
              state[scope.row.status].text
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row)"
              v-show="
                (userInfo.status === 0) |
                  (scope.row.username === userInfo.username)
              "
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeByID(scope.row.username)"
              v-show="
                (userInfo.status === 0) &&
                (scope.row.status !== 0) |
                (scope.row.username !== 'admin' & scope.row.username !== userInfo.username )
              "
            ></el-button>
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
    <!-- 添加新的管理员 -->
    <el-dialog
      title="添加管理员"
      :visible.sync="addDialogVisable"
      width="35%"
      @close="clearFromInfo"
    >
      <!--添加轮播项表单-->
      <el-form
        :model="addFrom"
        :rules="addFromRulers"
        ref="addFromRef"
        label-width="100px"
      >
        <el-form-item label="账号" prop="username">
          <el-input
            v-model="addFrom.username"
            clearable
            @input="checkInfo"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="addFrom.password"
            type="password"
            show-password
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-input v-model="addFrom.role"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="addFrom.gender">
            <el-radio :label="-1">保密</el-radio>
            <el-radio :label="0">女</el-radio>
            <el-radio :label="1">男</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="权限分配">
          <el-radio-group
            v-model="addFrom.status"
            v-for="item in state"
            :key="item.status"
          >
            <el-radio :label="item.status">{{ item.text }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisable = false">取 消</el-button>
        <el-button
          type="primary"
          @click="saveAddForm"
          :disabled="!addFrom.username"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 修改窗口 -->
     <el-dialog
      title="修改管理员信息"
      :visible.sync="editShowVisable"
      width="35%"
      @close="clearEditFromInfo"
    >
      <!--添加轮播项表单-->
      <el-form
        :model="editForm"
        :rules="editFormRulers"
        ref="editFromRef"
        label-width="100px"
      >
        <el-form-item label="账号">
          <el-input
            v-model="editForm.username"
            clearable
            @input="checkInfo"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="editForm.password"
            type="password"
            show-password
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="角色" v-show="userInfo.status === 0">
          <el-input v-model="editForm.role"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="editForm.gender">
            <el-radio :label="-1">保密</el-radio>
            <el-radio :label="0">女</el-radio>
            <el-radio :label="1">男</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="权限分配" v-show="userInfo.status === 0">
          <el-radio-group
            v-model="editForm.status"
            v-for="item in state"
            :key="item.status"
          >
            <el-radio :label="item.status">{{ item.text }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisable = false">取 消</el-button>
        <el-button
          type="primary"
          @click="saveEditForm"
          :disabled="!editForm.username"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      userInfo: {},
      addDialogVisable: false,
      queryInfo: {
        // 搜索关键字
        query: '',
        // 当前页数
        pagenum: 1,
        // 每页显示多少数据
        pagesize: 6
      },
      adminList: [],
      total: 0,
      //   保存需要显示密码的用户名
      showUser: '',
      //   存放状态数据和样式
      state: [
        // 0 全部权限（超级管理员）
        // 1 不能创建新账号 更改状态
        // 2 不可以登录
        { type: 'warning', text: '超级管理员', status: 0 },
        { type: 'success', text: '管理员', status: 1 },
        { type: 'danger', text: '禁止登录', status: 2 }
      ],
      addFromRulers: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '用户长度在3~10个字符之间' },
          {
            pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/,
            message: '不允许输入空格等特殊符号'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          // { min: 6, max: 10, message: '密码长度在6~10个字符之间' },
          {
            pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,10}$/,
            message: '密码（长度6~10之间）必须包含字母数字且不能有空格'
          }
        ]
      },
      addFrom: {
        username: '',
        password: '',
        role: '',
        status: 1,
        gender: -1
      },
      timer: -1,
      editShowVisable: false,
      editForm: {},
      editFormRulers: {
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          // { min: 6, max: 10, message: '密码长度在6~10个字符之间' },
          {
            pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,10}$/,
            message: '密码（长度6~10之间）必须包含字母数字且不能有空格'
          }
        ]
      }
    }
  },
  methods: {
    async getOnlineUser () {
      const username = window.sessionStorage.getItem('userName')
      const { data: res } = await this.$http.get(
        `/admin/detail?username=${username}`
      )
      if (res.meta.status !== 200) {
        return this.$notify.error('获取当前用户信息失败！')
      }
      this.userInfo = res.data
      //   this.userInfo.status = 1
    },
    async getAdminList () {
      const { data: res } = await this.$http.get('/admin/list', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败！')
      }
      this.adminList = res.data.adminList
      this.total = res.data.total
    },
    // 监听pagesize改变的事件
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getAdminList()
    },
    // 监听页码值改变的事件
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getAdminList()
    },
    clearFromInfo () {
      // 清除表单数据
      this.$refs.addFromRef.resetFields()
    },
    async saveAddForm () {
      this.$refs.addFromRef.validate(async (vaild) => {
        if (!vaild) return this.$message.error('添加失败！')
        const { addFrom } = this
        const { data: res } = await this.$http.post('/admin/add', { addFrom })
        if (res.meta.status !== 201) {
          return this.$notify.error('添加失败！')
        }
        // 关闭对话框
        this.addDialogVisable = false
        // 刷新数据列表
        this.getAdminList()
        this.$notify.success('添加成功！')
      })
    },
    async checkInfo () {
      // 设置定时器 防抖
      clearTimeout(this.timer)
      this.timer = setTimeout(async () => {
        const { data: res } = await this.$http.get(
          `/admin/detail?username=${this.addFrom.username}`
        )
        if (res.meta.status === 200) {
          this.$message.warning('该账号已经注册！')
          this.addFrom.username = ''
        }
      }, 1000)
    },
    // 控制超级管理员查看密码时的状态变更
    showPassword (username) {
      if (this.showUser === username) {
        this.showUser = ''
      } else {
        this.showUser = username
      }
    },
    async removeByID (username) {
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
      const { data: res } = await this.$http.post('/admin/delete', {
        username
      })
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败！')
      }
      this.$message.success('删除成功!')
      this.getAdminList()
    },
    showEditDialog (info) {
      this.editForm = info
      this.editShowVisable = true
    },
    clearEditFromInfo () {
      this.$refs.editFromRef.resetFields()
      this.editForm = {}
    },
    async saveEditForm () {
      // 进行预验证
      this.$refs.editFromRef.validate(async (vaild) => {
        if (!vaild) return this.$message.error('修改信息失败！')
        //  发起修改用户信息请求
        const { editForm } = this
        const { data: res } = await this.$http.post('/admin/update', {
          editForm
        })
        if (res.meta.status !== 200) {
          return this.$notify.error('修改信息失败！')
        }
        // 刷新数据列表
        this.getAdminList()
        this.$notify.success('修改信息添加成功！')
        if (this.userInfo.username === editForm.username) {
          window.sessionStorage.clear()
          this.$router.push('/login')
          this.$message.info('当前账户信息发生改变，请重新登录！')
        }
        // 关闭对话框
        this.editShowVisable = false
      })
    }
  },
  mounted () {
    this.getOnlineUser()
    this.getAdminList()
  }
}
</script>

<style scoped lang="less">
.password {
  margin-left: 10px;
}
.el-icon-view {
  font-size: 16px;
}
.el-radio {
  margin-left: 10px;
}
</style>
