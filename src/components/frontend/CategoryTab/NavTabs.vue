<template>
    <div class="col-sm-12">
        <ul class="nav nav-tabs">
            <li v-for="item in menuData" :class="appendActiveClass(item.class)">
                <a :href="item.href" :data-toggle="item.dataToggle">
                    {{ item.text }}
                </a>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';
const props = defineProps(
    {
        'menuData': Array
    }
);
const appendActiveClass = (data) => {
    return data || null;
}
</script>