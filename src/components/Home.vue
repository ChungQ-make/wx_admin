<template>
  <el-container class="home-container">
    <el-header class="header">
      <div class="title">微信二手交易平台后台管理系统</div>
      <div class="box">
        <div class="userInfo">当前用户：{{ username }}</div>
        <el-button type="info" @click="logout">退出</el-button>
      </div>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="tooggleCollapse">|||</div>
        <el-menu
          background-color="#282b33"
          text-color="#fff"
          active-text-color="#ffd04b"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath"
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-user-solid"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item-group>
              <!-- <template slot="title">分组一</template> -->
              <el-menu-item index="/users" @click="saveNavState('/users')">
                <i class="el-icon-menu"></i>
                用户列表</el-menu-item
              >
              <!-- <el-menu-item index="1-2">选项2</el-menu-item> -->
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-s-goods"></i>
              <span>商品管理</span>
            </template>
            <el-menu-item-group>
              <!-- <template slot="title">分组一</template> -->
              <el-menu-item index="/audit" @click="saveNavState('/audit')">
                <i class="el-icon-menu"></i>商品审核</el-menu-item
              >
              <el-menu-item index="/goods" @click="saveNavState('/goods')">
                <i class="el-icon-menu"></i>商品列表</el-menu-item
              >
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-s-order"></i>
              <span>订单管理</span>
            </template>
            <el-menu-item-group>
              <!-- <template slot="title">分组一</template> -->
              <el-menu-item index="/orders" @click="saveNavState('/orders')">
                <i class="el-icon-menu"></i>订单列表</el-menu-item
              >
              <!-- <el-menu-item index="3-2">
                <i class="el-icon-menu"></i>选项2</el-menu-item
              > -->
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>分类管理</span>
            </template>
            <el-menu-item-group>
              <!-- <template slot="title">分组一</template> -->
              <el-menu-item index="/sorts" @click="saveNavState('/sorts')">
                <i class="el-icon-menu"></i>分类列表</el-menu-item
              >
              <!-- <el-menu-item index="4-2">
                <i class="el-icon-menu"></i>选项2</el-menu-item
              > -->
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-s-shop"></i>
              <span>布局管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/swiper" @click="saveNavState('/swiper')">
                <i class="el-icon-menu"></i>轮播图</el-menu-item
              >
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="6">
            <template slot="title">
              <i class="el-icon-s-tools"></i>
              <span>账户管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/admin" @click="saveNavState('/admin')">
                <i class="el-icon-menu"></i>账号列表</el-menu-item
              >
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      username: window.sessionStorage.getItem('userName'),
      isCollapse: false,
      // 被激活的链接地址
      activePath: ''
    }
  },
  methods: {
    // 推出事件
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
      this.$message.info('退出成功！')
    },
    tooggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  },
  mounted () {
    this.activePath = window.sessionStorage.getItem('activePath')
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .title {
      font-size: 20px;
      font-weight: 600;
      color: #fff;
      font-family: serif;
    }
    .box {
      display: flex;
      align-items: center;
      .userInfo {
        color: #fff;
        font-size: 16px;
        margin-right: 20px;
      }
    }
  }
}
.el-aside {
  background-color: #282b33;
  .el-menu {
    border-right: none;
  }
}
.el-header {
  background-color: #23262e;
}
.el-main {
  background-color: #ecf5ff;
}
.toggle-button {
  background-color: #4a4d5e;
  color: #aaacb4;
  font-size: 10px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.3em;
  cursor: pointer;
}
</style>
