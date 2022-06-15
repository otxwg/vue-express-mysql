import Layout from "@/layout/index";
export default [
  {
    path: "/DesignerList",
    component: Layout,
    isDetail: false,
    children: [
      {
        path: "/DesignerList",
        meta: {
          i18n: "DesignerList",
          title: "列表",
          isDetail: false,
        },
        component: () => import("@/view/designerList"),
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
        component: () => import("@/components/formVueDesign"),
      },
    ],
  },
  {
    path: "/render/:id",
    name: "render",
    component: Layout,
    isDetail: false,
    children: [
      {
        path: "/render/:id",
        name: "render",
        meta: {
          i18n: "render",
          isDetail: false,
          title: "vue定制页",
        },
        component: () => import("@/view/form-custom/index"),
      },
    ],
  },
];
