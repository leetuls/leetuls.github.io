<template>
  <component v-bind:is="currentComponent"></component>
</template>

<script setup>
import { onMounted, shallowRef } from "vue";
import { useRoute, useRouter } from 'vue-router';
import Home from './layouts/frontend/Home.vue';
import PageNotFound from './layouts/frontend/PageNotFound.vue';
import Admin from './layouts/admin/Admin.vue';
import Login from "./pages/admin/Login.vue";
import { useCookies } from "vue3-cookies";
import { routerData } from "./utils/router-data";

const currentComponent = shallowRef();
const route = useRoute();
const router = useRouter();
const { cookies } = useCookies();

onMounted(async () => {
  let checkNull = [null, 'null'];
  await router.isReady()
  if (routerData.page_not_found.includes(route.path)) {
    currentComponent.value = PageNotFound;
  } else if (routerData.page_admin.includes(route.path)) {
    if (checkNull.includes(cookies.get('session_data'))) {
      window.location.href = '/login-admin';
      exit(0);
    }
    currentComponent.value = Admin;
  } else if (routerData.page_login.includes(route.path)) {
    currentComponent.value = Login;
  } else {
    currentComponent.value = Home;
  }
});
</script>
