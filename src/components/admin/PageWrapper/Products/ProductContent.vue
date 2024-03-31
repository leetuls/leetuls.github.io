<template>
    <a-button style="margin-bottom: 8px">Thêm</a-button>
    <a-table :columns="columns" :data-source="dataSource" bordered :loading="isLoading">
        <!-- Search -->
        <template #customFilterDropdown="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }">
            <div style="padding: 8px">
                <a-input ref="searchInput" :placeholder="`${column.title}`" :value="selectedKeys[0]"
                    style="width: 188px; margin-bottom: 8px; display: block"
                    @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
                    @pressEnter="handleSearch(selectedKeys, confirm, column.dataIndex)" />
                <a-button type="primary" size="small" style="width: 90px; margin-right: 8px"
                    @click="handleSearch(selectedKeys, confirm, column.dataIndex)">
                    <template #icon>
                        <SearchOutlined />
                    </template>
                    Search
                </a-button>
                <a-button size="small" style="width: 90px" @click="handleReset(clearFilters)">
                    Reset
                </a-button>
            </div>
        </template>

        <template #customFilterIcon="{ filtered }">
            <search-outlined :style="{ color: filtered ? '#108ee9' : undefined }" />
        </template>
        <!-- End Search -->

        <template #bodyCell="{ column, text, record }">
            <template v-if="['name', 'content'].includes(column.dataIndex)">
                <div>
                    <a-input v-if="editableData[record.product_id]"
                        v-model:value="editableData[record.product_id][column.dataIndex]"
                        @keyup.enter="save(record.product_id)" style="margin: -5px 0" />
                    <template v-else>
                        {{ text }}
                    </template>
                </div>
            </template>

            <template v-if="['category_id'].includes(column.dataIndex)">
                <div>
                    <span
                        v-if="editableData[record.product_id] && editableData[record.product_id][column.dataIndex] === undefined"
                        style="color: red;" id="record.product_id">Hãy chọn hạng mục này!</span>
                    <CategoryViewModel v-if="editableData[record.product_id]" :options="categoryOptions"
                        placeholder="Hãy chọn danh mục"
                        v-model:value="editableData[record.product_id][column.dataIndex]"
                        @keyup.enter="save(record.product_id)">
                    </CategoryViewModel>
                    <template v-else>
                        {{ categoryCombine[text] }}
                    </template>
                </div>
            </template>

            <template v-if="['price'].includes(column.dataIndex)">
                <div>
                    <a-input v-if="editableData[record.product_id]"
                        v-model:value="editableData[record.product_id][column.dataIndex]"
                        @keyup.enter="save(record.product_id)" style="margin: -5px 0" />
                    <template v-else>
                        {{ new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(text) }}
                    </template>
                </div>
            </template>

            <template v-if="['product_tag'].includes(column.dataIndex)">
                <div>
                    <ProductTagEdit v-if="editableData[record.product_id]" @keyup.enter="save(record.product_id)"
                        style="margin: -5px 0" ref="tagEdit"
                        :options="record.product_tag == null ? [] : record.product_tag.split(';')" />
                    <ProductTagView v-else :options="record.product_tag == null ? [] : record.product_tag.split(';')"
                        :key="record.product_id" />
                </div>
            </template>

            <template v-else-if="column.dataIndex === 'operation'">
                <div class="editable-row-operations">
                    <span v-if="editableData[record.product_id]">
                        <a-popconfirm @confirm="save(record.product_id)"
                            title="Sure to edit?"><a>Save</a></a-popconfirm>
                        <span>&nbsp;</span>
                        <a @click="cancel(record.product_id)">
                            <a>Cancel</a>
                        </a>
                    </span>
                    <span v-else>
                        <span>&nbsp;</span>
                        <a @click="edit(record.product_id)">Edit</a>
                        <a-popconfirm v-if="dataSource.length" title="Sure to delete?"
                            @confirm="onDelete(record.product_id)">
                            <a>Delete</a>
                        </a-popconfirm>
                    </span>
                </div>
            </template>

            <template v-if="column.dataIndex === 'feature_image'">
                <div>
                    <ImagePreview :images="[record.feature_image]" :name="record.name" ref="imageChildrent" count="1"
                        :key="record.product_id" />
                </div>
            </template>

            <template v-if="column.dataIndex === 'detail_images'">
                <div>
                    <ImagePreview :images="record.detail_images === null ? [] : record.detail_images.split(';')"
                        :name="record.product_id" ref="imageDetail" count="4" :key="record.product_id" />
                </div>
            </template>
        </template>
    </a-table>
</template>

<script setup>
import { cloneDeep } from 'lodash-es';
import { reactive, ref, onMounted } from 'vue';
import { SearchOutlined } from '@ant-design/icons-vue';
import ImagePreview from './ImagePreview.vue';
import { productData } from '@/stores/admin/products';
import { categoryData } from '@/stores/admin/categories';
import UserData from '@/utils/session-data.js';
import ProductTagView from './ProductTagView.vue';
import ProductTagEdit from './ProductTagEdit.vue';
import CategoryViewModel from '@/components/admin/PageWrapper/Categories/CategoryViewModel.vue';


const imageChildrent = ref(null);
const imageDetail = ref(null);
const productStore = productData();
const categoryStore = categoryData();
const tagEdit = ref(null);
const isError = ref();

// fetch Data to Grid
const categoryOptions = ref([]);
const categoryCombine = ref([]);
const isLoading = ref(false);
const fetchData = async () => {
    await productStore.getProducts(UserData.token);
    await categoryStore.getAllCategories(UserData.token);
    if (!productStore.data.error && !categoryStore.data.error) {
        dataSource.value = productStore.data.products;
        categoryOptions.value = categoryStore.data.category_model;
        categoryCombine.value = categoryStore.data.category_combine;
    }
}
// End fetch Data to Grid

const columns = [
    {
        title: 'Mã sản phẩm',
        dataIndex: 'product_id',
        width: '8%',
        customFilterDropdown: true,
        onFilter: (value, record) => record.product_id.toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: visible => {
            if (visible) {
                setTimeout(() => {
                    searchInput.value.focus();
                }, 100);
            }
        },
        sorter: (a, b) => a.product_id.localeCompare(b.product_id),
        sortDirections: ['descend', 'ascend'],
    },
    {
        title: 'Tên sản phẩm',
        dataIndex: 'name',
        width: '10%',
        customFilterDropdown: true,
        onFilter: (value, record) => record.name.toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: visible => {
            if (visible) {
                setTimeout(() => {
                    searchInput.value.focus();
                }, 100);
            }
        },
        sorter: (a, b) => a.name.localeCompare(b.name),
        sortDirections: ['descend', 'ascend'],
    },
    {
        title: 'Giá sản phẩm',
        dataIndex: 'price',
        width: '10%',
        sorter: (a, b) => parseInt(a.price) - parseInt(b.price),
        sortDirections: ['descend', 'ascend'],
    },
    {
        title: 'Mô tả sản phẩm',
        dataIndex: 'content',
        width: '15%',
    },
    {
        title: 'Danh mục',
        dataIndex: 'category_id',
        customFilterDropdown: true,
        onFilter: (value, record) => record.category_id.toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: visible => {
            if (visible) {
                setTimeout(() => {
                    searchInput.value.focus();
                }, 100);
            }
        },
        width: '14%'
    },
    {
        title: 'Thẻ sản phẩm',
        dataIndex: 'product_tag',
        width: '15%'
    },
    {
        title: 'Hình ảnh đại diện',
        dataIndex: 'feature_image',
        width: '10%'
    },
    {
        title: 'Hình ảnh chi tiết',
        dataIndex: 'detail_images',
        width: '20%'
    },
    {
        title: 'Thao tác',
        dataIndex: 'operation',
    },
];

// Inline Edit
const dataSource = ref([]);
const editableData = reactive({});

const edit = key => {
    editableData[key] = cloneDeep(dataSource.value.filter(item => key === item.product_id)[0]);
};
const save = async key => {
    // feature_image
    let fileObject = imageChildrent.value.fileObj;
    let base64FeatureImage = fileObject.length > 0 ? await imageChildrent.value.getBase64(fileObject[0]) : '';

    //detail_images
    let base64DetailImages = [];
    let fileObjectDetail = imageDetail.value.fileObj;
    for (let i = 0; i < fileObjectDetail.length; i++) {
        let base64Data = await imageChildrent.value.getBase64(fileObjectDetail[i]);
        base64DetailImages.push(base64Data);
    }

    let imagesRemove = imageDetail.value.fileRemove;

    // tags
    let modelTag = tagEdit.value.value;
    let defaultValueTag = tagEdit.value.defaultValue;
    let removeTags = tagEdit.value.dataRemove;
    let tagsNew = modelTag.filter(item => !defaultValueTag.includes(item));

    editableData[key].product_tag = modelTag.join(';');

    let dataUpdate = {
        products: {
            product_id: imageDetail.value.productId,
            name: editableData[key].name,
            price: editableData[key].price,
            content: editableData[key].content,
            category_id: editableData[key].category_id,
            feature_image: base64FeatureImage,
            user_id: UserData.user_id
        },
        product_images: {
            images_remove: imagesRemove,
            images_new: base64DetailImages
        },
        product_tags: {
            tags_remove: removeTags,
            tags_new: tagsNew
        }
    };

    // validate category
    if (dataUpdate.products.category_id === undefined) {
        isError.value = true;
        return;
    }

    Object.assign(dataSource.value.filter(item => key === item.product_id)[0], editableData[key]);
    delete editableData[key];
};
// End Inline edit

const cancel = key => {
    delete editableData[key];
};

const onDelete = key => {
    dataSource.value = dataSource.value.filter(item => item.product_id !== key);
};

// search
const state = reactive({
    searchText: '',
    searchedColumn: '',
});
const searchInput = ref();
const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    state.searchText = selectedKeys[0];
    state.searchedColumn = dataIndex;
};
const handleReset = clearFilters => {
    clearFilters({
        confirm: true,
    });
    state.searchText = '';
};
// end search

const handleKeyDown = (event) => {
    // Kiểm tra xem nút được nhấn có phải là ESC không
    if (event.key === 'Escape') {
        for (let key in editableData) {
            editableData[key] = null;
        }
    }
}

onMounted(async () => {
    isLoading.value = true;
    await fetchData();
    isLoading.value = false;
    document.addEventListener('keydown', handleKeyDown);
});
</script>

<style scoped>
.editable-row-operations a {
    margin-right: 8px;
}
</style>