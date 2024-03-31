<template>
    <div class="container">
        <div class="row">
            <div class="col-md-4 col-md-offset-4">
                <div class="login-panel panel panel-default">
                    <div v-for="item in message">
                        <a-alert :message="item" type="error" closable @close="onClose" v-if="display" />
                    </div>
                    <div class="panel-heading">
                        <h3 class="panel-title">Please Sign In</h3>
                    </div>
                    <div class="panel-body">
                        <form role="form">
                            <fieldset>
                                <div class="form-group">
                                    <input class="form-control" v-model="email" placeholder="E-mail" name="email"
                                        type="email" @keyup.enter="login" autofocus>
                                </div>
                                <div class="form-group">
                                    <input class="form-control" v-model="password" placeholder="Password" name="password"
                                        type="password" @keyup.enter="login" value="">
                                </div>
                                <div class="checkbox">
                                    <label>
                                        <input name="remember" type="checkbox" value="Remember Me">Remember Me
                                    </label>
                                </div>
                                <!-- Change this to a button or input when using this as a form -->
                                <a class="btn btn-lg btn-success btn-block" @click="login">Login
                                </a>
                            </fieldset>
                        </form>
                    </div>
                    <div class="loader-shop" v-if="isLoading"></div>
                </div>
            </div>
        </div>
    </div>
    <!-- <div class="vld-parent">
        <Loading :active="isLoading" :can-cancel="false" color="#FF9933" />
    </div> -->
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { Common } from '@/utils/common.js';
import { useAuthStore } from '@/stores/admin/auth';
import { useRouter } from 'vue-router';
import { useCookies } from "vue3-cookies";

const email = ref(null);
const password = ref(null);
const store = useAuthStore();
const display = ref(false);
const message = ref([]);
const router = useRouter();
const isLoading = ref(false);
const count = ref();
const { cookies } = useCookies();

// load dynamic css for admin page
const addDynamicCssToHead = () => {
    let dynamicCssPath = [
        '/assets/admin/css/loader.css',
        '/assets/admin/css/bootstrap.min.css',
        '/assets/admin/css/startmin.css'
    ];

    let fontAwesome = '/assets/admin/css/font-awesome.min.css';

    let scriptTag = [
        '/assets/admin/js/jquery.min.js',
        '/assets/admin/js/bootstrap.min.js'
    ];
    for (let path of dynamicCssPath) {
        let linkElement = document.createElement('link');
        linkElement.setAttribute('rel', 'stylesheet');
        linkElement.setAttribute('href', path);

        // Append the <link> element to the head of the document
        document.head.appendChild(linkElement);
    }
    let linkElement1 = document.createElement('link');
    linkElement1.setAttribute('rel', 'stylesheet');
    linkElement1.setAttribute('type', 'text/css');
    linkElement1.setAttribute('href', fontAwesome);

    // Append the <link> element to the head of the document
    document.head.appendChild(linkElement1);

    for (let path of scriptTag) {
        let linkElement = document.createElement('script');
        linkElement.setAttribute('src', path);

        // Append the <link> element to the head of the document
        document.body.appendChild(linkElement);
    }
}

const onClose = () => {
    display.value = false;
    message.value = [];
}

// watching count prop when changed
watch(count, async () => {
    if (count.value > 0) {
        setTimeout(() => {
            count.value--;
            message.value = ['Try it ' + count.value + ' seconds'];
        }, 1000)
    } else {
        message.value = [];
        $('.btn-lg').removeAttr('disabled');
        $("input[name='email']").removeAttr('disabled');
        $("input[name='password']").removeAttr('disabled');
    }
});

// call login when lick Login button
const login = async () => {
    // show loading after click login button
    isLoading.value = true;
    setTimeout(() => {
        isLoading.value = false;
    }, 1000)

    // define parameters to call api login
    let payload = {
        'email': email.value,
        'password': password.value,
    };

    // call store auth to get data from api
    await store.authLogin(payload);

    // edit request
    let responseData = store.data;
    switch (responseData.status) {
        case 200:
            let sessionData = {
                'user_id': responseData.user.user_id,
                'username': responseData.user.name,
                'token': responseData.authorisation.token
            }
            cookies.set('session_data', sessionData, 600, null, null, true);
            await router.push('/admin');
            window.location.reload();
            break;
        case 500:
            message.value = [responseData.message];
            display.value = true;
            break;
        case 422:
            let errors = responseData.error_data;
            let messages = [];
            for (let key1 in errors) {
                for (let key2 in errors[key1]) {
                    messages.push(errors[key1][key2]);
                }
            }
            message.value = messages;
            display.value = true;
            break;
        case 429:
            $('.btn-lg').attr('disabled', true);
            $("input[name='email']").attr('disabled', true);
            $("input[name='password']").attr('disabled', true);
            count.value = 60;
            message.value = ['Try it ' + count.value + ' seconds'];
            display.value = true;
            break;

        default:
            message.value = ["System error!"];
            display.value = true;
    }
}
onMounted(() => {
    Common.removeTag();
    addDynamicCssToHead();
});
</script>