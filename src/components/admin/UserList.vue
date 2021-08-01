<template>
  <div>
    <!--用戶列表主體-->
    <el-card>
      <!--Breadcrumbs-->
      <el-breadcrumb separator-class="el-icon-arrow-right" >
        <el-breadcrumb-item :to="{path:'/home'}">首頁</el-breadcrumb-item>
        <el-breadcrumb-item>權限管理</el-breadcrumb-item>
      </el-breadcrumb>

      <el-row :gutter="25">
        <el-col :span="15">
        <!--搜索區域-->
        <el-input placeholder="請輸入搜索内容" v-model="queryInfo.query" clearable @clear="getUserList">
          <!--搜索按鈕-->
          <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
        </el-input>
        </el-col>

          <!--添加用戶按鈕-->
          <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用戶</el-button>
          </el-col>
      </el-row>

      <!--用戶列表-->
      <el-table :data="userList" border stripe>
        <el-table-column type="index"></el-table-column><!--索引列-->
        <el-table-column label="用戶名" prop="username"></el-table-column>
        <el-table-column label="郵箱" prop="email"></el-table-column>
        <el-table-column label="密碼" prop="password"></el-table-column>
        <el-table-column label="角色" prop="role"></el-table-column>
        <el-table-column label="狀態" prop="state">
          <!--作用域插槽-->
          <template slot-scope="scope">
              <!--{{scope.row}}每一行封存的數據-->
            <el-switch v-model="scope.row.state" @change="userStateChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            <!-- 刪除 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row.id)"></el-button>
            <!-- 權限 -->
            <el-tooltip effect="dark" content="分配权限" placement="top-start" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

        <!--分頁組件-->
        <div>
          <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryInfo.pageNum"
              :page-sizes="[1, 2, 5, 100]"
              :page-size="queryInfo.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
          ></el-pagination>
        </div>
    </el-card>

    <!--新增用戶區域-->
    <el-dialog title="添加用戶" :visible.sync="addDialogVisible" width="50%" @close="addDialogClose">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用戶名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密碼" prop="username">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="郵箱" prop="username">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
      </el-form>
      <!--内容底部區域-->
        <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">確 定</el-button>
        </span>
    </el-dialog>

    <!--修改對話框-->
    <el-dialog title="修改用戶信息" :visible.sync="editDialogVisible" width="50%" @close="editDialogClose">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用戶名" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="密碼" prop="username">
          <el-input v-model="editForm.password"></el-input>
        </el-form-item>
        <el-form-item label="郵箱" prop="username">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
      </el-form>
        <!--内容底部區域-->
        <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">確 定</el-button>
        </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: "UserList",
  created(){
    this.getUserList();
  },
  data(){
    return{
      //查詢信息實體
      queryInfo:{
        query:"",//查詢信息
        pageNum:1,//當前頁
        pageSize:5,//每頁最大數
      },
      userList:[],//用戶列表
      total:0,//縂記錄數
      addDialogVisible: false ,// 對話框顯示
      // 添加用戶表單項
      addForm: {
        username: '',
        password: '',
        email: '',
      },
        // 控制修改用戶對話框顯示/隐藏
        editDialogVisible:false,
        // 修改用戶信息
        editForm:{},
        // 驗證規則
        addFormRules:{
          username:[
            { required: true, message: "請輸入用戶名", trigger: "blur" },
            { min: 5, max: 8, message: "长度在 5 到 8 个字符", trigger: "blur" }
          ],
          password:[
            { required: true, message: "請輸入密碼", trigger: "blur" },
            { min: 6, max: 8, message: "长度在 6 到 8 个字符", trigger: "blur" }
          ],
          email:[
            { required: true, message: "請輸入郵箱", trigger: "blur" },
            { min: 5, max: 15, message: "请输入正确邮箱地址", trigger: "blur" }
          ],
        },
        // 修改用户表单验证规则
        editFormRules:{
          password:[
            { required: true, message: "請輸入密碼", trigger: "blur" },
            { min: 6, max: 8, message: "长度在 6 到 8 个字符", trigger: "blur" }
          ],
          email:[
            { required: true, message: "請輸入郵箱", trigger: "blur" },
            { min: 5, max: 15, message: "请输入正确邮箱地址", trigger: "blur" }
          ],
        },
    }

    },
  methods:{
    //獲取所有用戶
    async getUserList(){
      const {data:res} =  await this.$http.get("/alluser",{params:this.queryInfo});
      //user number是後端返回的Map值
      this.userList = res.user;//用戶列表數據
      this.total = res.numbers;//縂用戶數封裝
    },
    //最大數
    handleSizeChange(newSize){
      this.queryInfo.pageSize = newSize;
      this.getUserList();
    },
    //pageNum的觸發動作
    handleCurrentChange(newPage){
      this.queryInfo.pageNum = newPage;
      this.getUserList();
    },

    //修改用戶狀態
    async userStateChange(userInfo){
      const {data:res} = await this.$http.put(`updateState?id=${userInfo.id}&state=${userInfo.state}`);
      if(res != "success"){
        userInfo.state = !userInfo.state;
        return this.$message.error("操作失敗")
      }
      this.$message.success("操作成功")
    },
    //監聽添加用戶
    addDialogClose(){
      this.$refs.addFormRef.resetFields();
    },
    addUser(){
      this.$refs.addFormRef.validate(async vaild=>{
        if(!vaild) return;
        const {data:res} = await this.$http.post("addUser",this.addForm);
        if (res!="success"){
          return this.$message.error("操作失敗")
        }
        this.$message.success("操作成功")
        this.addDialogVisible = false;
        this.getUserList();
      })
    },

    //根據主鍵刪除用戶
    async deleteUser(id){
      const confimResult = await this.$confirm("此操作將永久刪除用戶,確定刪除?",'提示',{
        confirmButtonText:'確定',
        cancelButtonText:'取消',
        type:'warning'
      }).catch(err => err)
      if (confimResult!='confirm'){
        return this.$message.info("已取消刪除");
      }
        const {data:res} = await this.$http.delete("/delUser/"+id);
        if (res != "success"){
          return this.$message.info("刪除失敗");
        }
        this.$message.success("刪除成功");
        this.getUserList();
    },

    //顯示對話框
    async showEditDialog(id){
      const {data:res} = await this.$http.get("/getUserById/"+id);
      this.editForm = res;//把查詢到的用戶信息反填回編輯表單裏
      this.editDialogVisible = true;//開啓編輯對話框
    },

    //關閉窗口
    editDialogClose(){
      this.$refs.editFormRef.resetFields();//重置信息
    },

    //確認修改
    editUserInfo(){
      this.$refs.editFormRef.validate(async vaild =>{
        if (!vaild) return;
        //發起修改請求
        const {data:res} = await this.$http.post("/updateUser",this.editForm);
        if (res!="success") return this.$message.error("操作失敗");
        //隱藏
        this.editDialogVisible = false;
        this.getUserList();

        return this.$message.success("操作成功")
      })
    }

  }
}
</script>

<style scoped>

</style>