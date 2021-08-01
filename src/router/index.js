import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Welcome from '../components/Welcome'
import UserList from "../components/admin/UserList";

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    redirect: "/login"
  },
  {
    path: "/login",
    component: Login
  },
  {
    path: "/home",
    component: Home,
    redirect: "/welcome",
    children:[
      {
        path: "/Welcome",
        name: "Welcome",
        component: Welcome
      },
      {
        path: "/user",
        component: UserList
      }
]
  }
]

const router = new VueRouter({
  routes
})

//路由守衛出現問題的時候使用
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location,onResolve,onReject,){
  if (onResolve || onReject) return originalPush.call(this,location,onResolve,onReject)
  return originalPush.call(this,location).catch(err => err)
}

//挂載路由導航守衛
router.beforeEach((to,from,next)=>{
  //to將要訪問
  //from 從哪訪問
  //next 接著next(url) 重定向url上; next()繼續訪問to路徑
  if(to.path == '/login') return next();
  //獲取user
  const userFlag =  window.sessionStorage.getItem("user");//取出當前用戶
  if(!userFlag) return next("/login");//無值返回登錄頁
  next();//符合要求 放行
  }
)

export default router
