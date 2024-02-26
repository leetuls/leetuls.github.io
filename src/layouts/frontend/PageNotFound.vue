<template>
    <div class="container text-center">
        <div class="logo-404">
            <a href="index.html"><img src="@/assets/frontend/images/home/logo.png" alt="" /></a>
        </div>
        <div class="content-404">
            <img src="@/assets/frontend/images/404/404.png" class="img-responsive" alt="" />
            <h1><b>OPPS!</b> We Couldn’t Find this Page</h1>
            <p>Uh... So it looks like you brock something. The page you are looking for has up and Vanished.</p>
            <h2><a href="/">Bring me back Home</a></h2>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from "vue";
const addDynamicCssToHead = () => {
    let dynamicCssPath = [
        '/assets/frontend/css/bootstrap.min.css',
        '/assets/frontend/css/main.css',
    ];
    for (let path of dynamicCssPath) {
        let linkElement = document.createElement('link');
        linkElement.setAttribute('rel', 'stylesheet');
        linkElement.setAttribute('href', path);

        // Append the <link> element to the head of the document
        document.head.appendChild(linkElement);
    }

    let scriptTag = '/assets/frontend/js/main.js';
    let linkElement1 = document.createElement('script');
    linkElement1.setAttribute('src', scriptTag);

    // Append the <link> element to the head of the document
    document.body.appendChild(linkElement1);
}

onMounted(() => {
    addDynamicCssToHead();
});
</script>