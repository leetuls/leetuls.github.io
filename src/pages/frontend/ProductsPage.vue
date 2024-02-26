<template>
    <section id="advertisement">
        <div class="container">
            <img src="@/assets/frontend/images/shop/advertisement.jpg" alt="" />
        </div>
    </section>
    <section>
        <div class="container">
            <div class="row">
                <TheSidebar />
                <div class="col-sm-9 padding-right">
                    <FeaturesItems />
                    <ul class="pagination">
                        <li class="active"><a href="">1</a></li>
                        <li><a href="">2</a></li>
                        <li><a href="">3</a></li>
                        <li><a href="">&raquo;</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { onMounted } from 'vue';
import TheSidebar from '@/components/frontend/Common/TheSidebar.vue';
import FeaturesItems from '@/components/frontend/Product/FeaturesItems.vue';
import { Common } from '../../utils/common';

onMounted(() => {
    Common.removeMenuColor();
    Common.changeColorById('shopTag');
    Common.changeColorClick('Products');
});
</script>