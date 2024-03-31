<template>
    <a-select v-model:value="value" mode="tags" style="width: 100%" :token-separators="[',']"
        placeholder="Automatic tokenization" :options="tagsData" @change="handleChange"
        @remove="handleChange"></a-select>
</template>

<script setup>
import { ref, watch, defineProps, onMounted, defineExpose } from 'vue';

const tagsData = ref([]);
const defaultValue = ref([]);
const dataRemove = ref([]);

const props = defineProps(
    {
        options: Array,
    }
);

const value = ref([]);

const handleChange = value => {
    console.log(`selected ${value}`);
};

watch(value, (newValue, oldValue) => {
    let result = oldValue.filter(item => !newValue.includes(item));
    if (result.length > 0 && defaultValue.value.includes(result[0])) {
        dataRemove.value.push(result);
    }
});

const prepareData = () => {
    props.options.forEach(function (item) {
        let check = item.indexOf('_');
        let data = check !== -1 ? item.split('_')[1] : item;
        value.value.push(data);
    });
    defaultValue.value = value.value;
}

onMounted(() => {
    prepareData();
});

defineExpose({
    value,
    defaultValue,
    dataRemove
});

</script>