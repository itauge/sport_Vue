<template>
  <!--  引入container佈局-->
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="../assets/logo.png" alt/>
        <span>Sport platform</span>
      </div>
      <el-button type="info" @click="logout">Logout</el-button>
    </el-header>
    <!--    主體-->
    <el-container>
      <!--      側邊欄-->
      <el-aside :width="isCollapse?'64px':'200px'">
        <div class="toggle-buton" @click="toggleCollapase">|||</div>

        <el-menu
            background-color="#545c64"
            text-color="#fff" :collapse="isCollapse" :router="true" :default-active="activePath" >
          <!--一級菜單-->
          <el-submenu :index="item.path" v-for="item in menuList" :key="item.id" >
            <template slot="title">
              <i :class="iconsObject[item.id]"></i>
              <span>{{item.title}}</span>
            </template>
            <!--二級菜單-->
            <el-menu-item :index="it.path+''" v-for="it in item.subMenuList" :key="it.id"  @click="saveNavState(it.path)">
              <template slot="title">
                <i :class="iconsObject[it.id]"></i>
                <span>{{it.title}}</span>
              </template>
            </el-menu-item>

          </el-submenu>

        </el-menu>

      </el-aside>
      <!--      主題内容-->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import axios from "axios";

export default {
  name: "Home",
  data(){
    return {
      //菜單列表
      menuList:[],
      //伸缩
      isCollapse:false,
      iconsObject:{
        '100':'iconfont icon-management',
        '200':'iconfont icon-sports',
        '101':'iconfont icon-liebiao',
        '102':'iconfont icon-password',
        '103':'iconfont icon-sports',
        '104':'iconfont icon-shangpin',
        '201':'iconfont icon-book',
        '202':'iconfont icon-qialuli',
        '203':'iconfont icon-food',
      },
      activePath:'/welcome',//默认路径
    }
  },
  created() {
    //查詢menuList
    this.getMenuList();
    this.activePath = sessionStorage.getItem("activePath");//取出session裏的path 動態修改activePath
  },
  methods: {
    //退出
    logout() {
      window.sessionStorage.clear();//消除session
      this.$router.push("/login")
    },
    //獲取導航菜單
    async getMenuList(){
      const {data:res} = await this.$http.get("menu");
      console.log(res);
      if (res.flag != 200) return this.$message.error("獲取列表失敗");
      this.menuList = res.menus;
    },
    //控制伸縮
    toggleCollapase(){
      this.isCollapse = !this.isCollapse;
    },
    //保存路徑
    saveNavState(activePath){
      window.sessionStorage.setItem("activePath",activePath);//存放在session
      this.activePath = activePath;
    }

  }
}
</script>

<style scoped>
/*佈局器樣式*/
.home-container {
  height: 100%;
}

.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between; /*左右貼邊*/
  padding-left: 0%;
  align-items: center;
  color: #fff;
  font-size: 20px;
}

div {
  display: flex;
  align-items: center;
}

span {
  margin-left: 15px;
}

.el-aside {
  background-color: #333744;


}
.el-menu{
  border-right: none;
}

.el-main {
  background-color: #eaedf1;
}

img {
  width: 55px;
  height: 55px;
}

/*按鈕樣式*/
.toggle-buton{
  background-color: #63a35c ;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;/*顯示小手*/
  justify-content: center;
}

</style>