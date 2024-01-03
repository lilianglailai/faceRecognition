import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";

/**
 * Note: 路由配置项
 *
 * hidden: true                     // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true                 // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                  // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                  // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                  // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect             // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'               // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * query: '{"id": 1, "name": "ry"}' // 访问路由的默认传递参数
 * roles: ['admin', 'common']       // 访问路由的角色权限
 * permissions: ['a:a:a', 'b:b:b']  // 访问路由的菜单权限
 * meta : {
    noCache: true                   // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
    title: 'title'                  // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'                // 设置该路由的图标，对应路径src/assets/icons/svg
    breadcrumb: false               // 如果设置为false，则不会在breadcrumb面包屑中显示
    activeMenu: '/system/user'      // 当路由设置了该属性，则会高亮相对应的侧边栏。
  }
 */

// 公共路由
export const constantRoutes = [
  {
    path: "/redirect",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "/redirect/:path(.*)",
        component: () => import("@/views/redirect"),
      },
    ],
  },
  {
    path: "/login",
    component: () => import("@/views/login"),
    hidden: true,
  },
  {
    path: "/register",
    component: () => import("@/views/register"),
    hidden: true,
  },
  {
    path: "/404",
    component: () => import("@/views/error/404"),
    hidden: true,
  },
  {
    path: "/401",
    component: () => import("@/views/error/401"),
    hidden: true,
  },
  {
    path: "/",
    component: Layout,
    redirect: "index",
    children: [
      {
        path: "index",
        component: () => import("@/views/index"),
        name: "Index",
        meta: { title: "首页", icon: "dashboard", affix: true },
      },
    ],
  },
  {
    path: "index_v1",
    component: () => import("@/views/index_v1"),
    name: "index_v1",
    meta: { title: "首页", icon: "dashboard" },
    hidden: true,
  },
//   {
//     path: "/",
//     component: Layout,
//     redirect: "/ListProject",
    
//     children: [
//       {
//         path: "ListProject",
//         component: () => import("@/views/ListProject/ListProject"),
//         name: "ListProject",
//         meta: { title: "项目管理",
//         icon: "build",
//         noCache: true,
//         link: null,},
//       },
//     ],
//   },
//   {
//     path: "/",
//     component: Layout,
//     redirect: "/Feedback",
//     children: [
//       {
//         path: "Feedback",
//         component: () => import("@/views/Feedback/Feedback"),
//         name: "Feedback",
//         meta: { title: "反馈列表",
//         icon: "build",
//         noCache: false,
//         link: null,},
//       },
//     ],
//   },
  {
    name: "System",
    path: "/system",
    hidden: false,
    redirect: "noRedirect",
    component: Layout,
    alwaysShow: true,
    meta: {
      title: "系统管理",
      icon: "system",
      noCache: false,
      link: null,
    },
    children: [
    //   {
    //     name: "category",
    //     path: "category",
    //     hidden: false,
    //     component: () => import("@/views/system/category/category"),
    //     meta: {
    //       title: "分类管理",
    //       icon: "build",
    //       noCache: false,
    //       link: null,
    //     },

    //   },
      {
        name: "AdminUser",
        path: "AdminUser",
        hidden: false,
        component: () => import("@/views/system/AdminUser/AdminUser"),
        meta: {
          title: "用户列表",
          icon: "user",
          noCache: false,
          link: null,
        }, 
      },
    //   {
    //     name: "user",
    //     path: "user",
    //     hidden: false,
    //     component: () => import("@/views/system/user/user"),
    //     meta: {
    //       title: "用户列表",
    //       icon: "user",
    //       noCache: false,
    //       link: null,
    //     }, 
    //   },
    //   {
    //     name: "ListCreator",
    //     path: "ListCreator",
    //     hidden: false,
    //     component: () => import("@/views/system/ListCreator/ListCreator"),
    //     meta: {
    //       title: "创作者列表",
    //       icon: "user",
    //       noCache: false,
    //       link: null,
    //     }, 
    //   },
    //   {
    //     hidden: true,
    //     path: 'profile',
    //     component: () => import('@/views/system/profile/index'),
    //     name: 'Profile',
    //     meta: { title: '个人中心', icon: 'user' }
    //   }
    ],
  },
//   {
//     path: "/",
//     component: Layout,
//     redirect: "/UpdateCommonFile",
//     children: [
//       {
//         path: "UpdateCommonFile",
//         component: () => import("@/views/UpdateCommonFile/UpdateCommonFile"),
//         name: "UpdateCommonFile",
//         meta: { title: "更新通用文件",
//         icon: "build",
//         noCache: false,
//         link: null,},
//       },
//     ],
//   },
  {
    path: "/user",
    component: Layout,
    hidden: true,
    redirect: "noredirect",
  },
];

// 动态路由，基于用户权限动态去加载
// 防止连续点击多次路由报错
let routerPush = Router.prototype.push;
let routerReplace = Router.prototype.replace;
// push
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch((err) => err);
};
// replace
Router.prototype.replace = function push(location) {
  return routerReplace.call(this, location).catch((err) => err);
};

export default new Router({
  mode: "history", // 去掉url中的#
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes,
});
