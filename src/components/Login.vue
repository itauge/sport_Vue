<template>
  <div class="login_container">
    <!--login area-->
    <div class="login_box">
      <!--icon-->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt/>
      </div>
      <!--form area-->
      <el-form ref="loginFormRef" :rules="loginRules" :model="loginForm" class="login_form" label-width="0">
        <!--username-->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-log-in"></el-input>
        </el-form-item>
        <!--password-->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" prefix-icon="iconfont icon-password" type="password"></el-input>
        </el-form-item>
        <!--button-->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">Submit</el-button>
          <el-button type="info" @click="resetLoginForm">Reset</el-button>
        </el-form-item>


      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data(){
    return {
      //表單數據
      loginForm:{
        username:"admin",
        password:"123456"
      },
      //驗證對象
      loginRules:{
        username:[
          {required:true, message: 'Pls enter your username', trigger:'blur'},
          {min: 5,max: 12,message: 'Between 5 - 12 ',trigger: 'blur'}
        ],
        password:[
          {required:true, message: 'Pls enter your password', trigger:'blur'},
          {min: 5,max: 10,message: 'Between 5 - 10 ',trigger: 'blur'}
        ],

      }

    }
  },
  methods:{
    //重置内容
    resetLoginForm(){
      this.$refs.loginFormRef.resetFields()
    },
    //處理登錄
    login(){
      //1.驗證校驗規則
      this.$refs.loginFormRef.validate(async valid =>{
        if(!valid) return;//驗證失敗
        const{data:res} = await this.$http.post("login",this.loginForm);//訪問後臺
        if ( res.flag == "ok"){
          window.sessionStorage.setItem("user",res.user);//存儲user對象
          this.$message.success("操作成功")//信息提示
          this.$router.push({path:"/home"});//頁面路由跳轉
        }else {
          this.$message.error("操作失敗");//錯誤提示
        }

      })
    }


  }
}
</script>

<style scoped>
.login_container{
  /*根節點樣式*/
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
  .avatar_box {
    width: 130px;
    height: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 1px;
    box-shadow: 0 0 10px #ddd;
    left: 100%;
    transform: translate(110%,-40%);
    background-color: #dddddd;
  }
    img{
      width: 100%;
      height: 100%;
      border-radius: 20%;
    }
   .btns{
     display: flex;
     justify-content: flex-end;
   }
   .login_form{
     position: absolute;
     bottom: 0%;
     width: 100%;
     padding: 0 10px;
     box-sizing: border-box;
   }
</style>