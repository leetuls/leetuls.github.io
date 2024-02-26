<template>
    <section>
        <div class="container">
            <div class="row">
                <TheSidebar />
                <div class="col-sm-9 padding-right">
                    <ProductDetails />
                    <div class="category-tab shop-details-tab"><!--category-tab-->
                        <NavTabs :menu-data="menuData" />
                        <div class="tab-content">
                            <DetailsTabContent />
                            <CompanyProfileTabContent />
                            <TagTabContent />
                            <ReviewsTabContent />
                        </div>
                    </div><!--/category-tab-->
                    <RecommendedItems />
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { onMounted } from 'vue';
import TheSidebar from '@/components/frontend/Common/TheSidebar.vue';
import ProductDetails from '@/components/frontend/Product/ProductDetails.vue';
import { Common } from '../../utils/common';
import NavTabs from '@/components/frontend/CategoryTab/NavTabs.vue';
import DetailsTabContent from '@/components/frontend/CategoryTab/TabContent/ProductDetails/DetailsTabContent.vue';
import CompanyProfileTabContent from '@/components/frontend/CategoryTab/TabContent/ProductDetails/CompanyProfileTabContent.vue';
import TagTabContent from '@/components/frontend/CategoryTab/TabContent/ProductDetails/TagTabContent.vue';
import ReviewsTabContent from '@/components/frontend/CategoryTab/TabContent/ProductDetails/ReviewsTabContent.vue';
import RecommendedItems from '@/components/frontend/Product/RecommendedItems.vue';

const menuData = [
    { class: null, href: '#details', dataToggle: 'tab', text: 'Details' },
    { class: null, href: '#companyprofile', dataToggle: 'tab', text: 'Company Profile' },
    { class: null, href: '#tag', dataToggle: 'tab', text: 'Tag' },
    { class: 'active', href: '#reviews', dataToggle: 'tab', text: 'Reviews (5)' },
];

onMounted(() => {
    Common.removeMenuColor();
    Common.changeColorById('shopTag');
    Common.changeColorClick('Product Details');
});
</script>