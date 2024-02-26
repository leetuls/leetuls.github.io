<template>
    <a-tree-select show-search style="width: 100%" :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
        placeholder="Hãy chọn danh mục cha" allow-clear tree-default-expand-all :tree-data="options"
        tree-node-filter-prop="label">
    </a-tree-select>
</template>
<script setup>
import { ref, watch, defineProps } from 'vue';

const props = defineProps(
    {
        'options': Array
    }
);
const value = ref();

watch(value, () => {
    console.log(value.value);
});
</script>