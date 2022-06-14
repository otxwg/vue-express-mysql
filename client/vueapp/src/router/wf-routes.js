import Layout from "../../src/layout/index";
export default [
  // {
  //   path: "/vuedesigner",
  //   component: () => import("../../src/detail/formVueDesign"),
  // },
  // {
  //   path: "/",
  //   component: () => import("../../src/components/DesignerList"),
  // },
  // {
  //   path: "render",
  //   component: () => import("../../src/components/render"),
  // },
  // 跳转启动流程
  {
    path: "/",
    component: Layout,
    isDetail: false,
    // redirect: "/vuedesigner",
    children: [
      {
        path: "/",
        meta: {
          i18n: "DesignerList",
          title: "列表",
        },
        component: () => import("../../src/components/DesignerList"),
      },
    ],
  },
  {
    path: "/vuedesigner",
    component: Layout,
    isDetail: true,
    redirect: "/vuedesigner",
    children: [
      {
        path: "/vuedesigner",
        name: "vue定制页",
        meta: {
          i18n: "vuedesigner",
          isDetail: true,
          title: "vue定制页",
        },
        component: () => import("../../src/detail/formVueDesign"),
      },
    ],
  },
  {
    path: "/render/:id",
    name: "render",
    component: Layout,
    isDetail: true,
    children: [
      {
        path: "/render/:id",
        name: "render",
        meta: {
          i18n: "render",
          isDetail: true,
          title: "vue定制页",
        },
        component: () => import("../../src/view/form-custom/index"),
      },
    ],
  },
];
