<template>
  <div class="login_container">
    <div class="login_box">
      <div class="title">Admin Login</div>
      <div class="item">
        <el-form
          :model="loginForm"
          :rules="rules"
          ref="loginFormRef"
          label-width="80px"
          class="logn_form"
        >
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              clearable
              prefix-icon="el-icon-user"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              show-password
              clearable
              prefix-icon="el-icon-lock"
               @keyup.enter.native="login"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="btn">
        <div class="index">
          <el-button type="success" round @click="login">Login</el-button>
          <el-button type="info" round @click="reset">Reset</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur'
          }
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '长度在 6 到 15 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    //   重置表单数据
    reset () {
      //   this.loginForm = {
      //     username: '',
      //     password: ''
      //   }
      this.$refs.loginFormRef.resetFields()
    },
    // 登陆操作
    async login () {
      // 预校验
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.post('/admin/login', this.loginForm)
        if (res.meta.status !== 200) {
          return this.$message.error('登陆失败！')
        }
        this.$message.success(`登陆成功! 欢迎回来  ${res.data.username} ~~`)
        window.sessionStorage.setItem('userName', res.data.username)
        window.sessionStorage.setItem('token', res.data.token)
        // 2. 通过编程式导航跳转到后台主页，路由地址是 /home
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #4a90e2;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .login_box {
    width: 450px;
    height: 300px;
    padding: 10px;
    box-sizing: border-box;
    background: rgba(255, 255, 255, 0.5);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.18);
    display: flex;
    flex-direction: column;
    .title {
      font-size: 30px;
      font-weight: 600;
      text-align: center;
      color: #fff;
      margin-top: 20px;
      margin-bottom: 20px;
    }
    .item {
      .logn_form {
        width: 350px;
      }
    }
    .btn {
      display: flex;
      justify-content: center;
      .index {
        display: flex;
        justify-content: space-between;
        width: 55%;
        // margin-left: 50px;
      }
    }
  }
}
</style>
