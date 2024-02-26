<template>
    <TheSlider />
    <section>
        <div class="container">
            <div class="row">
                <TheSidebar />
                <div class="col-sm-9 padding-right">
                    <FeaturesItems />
                    <CategoryTab />
                    <RecommendedItems />
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import TheSlider from '@/components/frontend/Common/TheSlider.vue';
import TheSidebar from '@/components/frontend/Common/TheSidebar.vue';
import FeaturesItems from '@/components/frontend/Product/FeaturesItems.vue';
import CategoryTab from '@/components/frontend/CategoryTab/CategoryTab.vue';
import RecommendedItems from '@/components/frontend/Product/RecommendedItems.vue';
</script>