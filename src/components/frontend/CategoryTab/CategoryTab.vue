<template>
    <div class="category-tab"><!--category-tab-->
        <NavTabs v-bind:menu-data="menuData" />
        <div class="tab-content">
            <TshirtTabContent />
            <BlazersTabContent />
            <SunglassTabContent />
            <KidsTabContent />
            <PoloshirtTabContent />
        </div>
    </div><!--/category-tab-->
</template>

<script setup>
import TshirtTabContent from './TabContent/Home/TshirtTabContent.vue';
import BlazersTabContent from './TabContent/Home/BlazersTabContent.vue';
import SunglassTabContent from './TabContent/Home/SunglassTabContent.vue';
import KidsTabContent from './TabContent/Home/KidsTabContent.vue';
import PoloshirtTabContent from './TabContent/Home/PoloshirtTabContent.vue';
import NavTabs from './NavTabs.vue';
const menuData = [
    { class: 'active', href: '#tshirt', dataToggle: 'tab', text: 'T-Shirt' },
    { class: null, href: '#blazers', dataToggle: 'tab', text: 'Blazers' },
    { class: null, href: '#sunglass', dataToggle: 'tab', text: 'Sunglass' },
    { class: null, href: '#kids', dataToggle: 'tab', text: 'Kids' },
    { class: null, href: '#poloshirt', dataToggle: 'tab', text: 'Polo shirt' },
];
</script>