<template>
    <div>
        <a-tag v-for="item in tagsData"><a href="#">{{ item }}</a></a-tag>
    </div>
</template>

<script setup>
import { ref, defineProps, onMounted } from 'vue';

const props = defineProps(
    {
        options: Array
    }
);

const tagsData = ref([]);

const prepareData = () => {
    props.options.forEach(function (item) {
        let check = item.indexOf('_');
        let data = check !== -1 ? item.split('_')[1] : item;
        tagsData.value.push(data);
    });
}

onMounted(() => {
    prepareData();
});
</script>