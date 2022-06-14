import Vue from "vue";
import App from "./App.vue";
import Element from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "gd_vue_components/dist/gd-components.min.css";
import "./styles/common.scss";
import router from "./router/router";
import gdComponents from "gd_vue_components";
// import "./components/icons";
Vue.use(router);
Vue.config.productionTip = false;
Vue.use(Element);
Vue.use(gdComponents);
new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
