<template>
    <a-button class="editable-add-btn" @click="showModal" style="margin-bottom: 8px">Thêm</a-button>
    <a-alert :message="messageValidateModel" type="error" closable v-if="messageValidateModel !== ''" />
    <a-alert :message="messageDeletedFailed" type="error" closable v-if="isDeletedFailed" />
    <a-alert :message="messageSuccess" type="success" closable v-if="isSuccess" />
    <a-modal :width="800" v-model:open="open" title="Thêm danh mục" :confirm-loading="confirmLoading" @ok="handleOk">
        <CategoryForm ref="categoryRef" :options="options" :messageError="messageAddedFailed" :error="isAddedFailed"
            labelName="Tên danh mục" labelParent="Danh mục cha" />
    </a-modal>
    <a-table :columns="columns" :data-source="dataSource" bordered :pagination="{ pageSize: 7 }" :loading="isLoading">
        <!-- Search -->
        <template #customFilterDropdown="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }">
            <div style="padding: 8px">
                <a-input ref="searchInput" :placeholder="`Search ${column.dataIndex}`" :value="selectedKeys[0]"
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
            <template v-if="['parent_id'].includes(column.dataIndex)">
                <div>
                    <CategoryViewModel v-if="editableData[record.id]" :options="options" @select="validateModel(record.id)"
                        v-model:value="editableData[record.id][column.dataIndex]" @keyup.enter="save(record.id)">
                    </CategoryViewModel>
                    <template v-else>
                        {{ categoryCombine[text] }}
                    </template>
                </div>
            </template>
            <template v-if="['name'].includes(column.dataIndex)">
                <div>
                    <a-input v-if="editableData[record.id]" v-model:value="editableData[record.id][column.dataIndex]"
                        @keyup.enter="save(record.id)" style="margin: -5px 0" />
                    <template v-else>
                        {{ text }}
                    </template>
                </div>
            </template>
            <template v-if="column.dataIndex === 'operation'">
                <div class="editable-row-operations">
                    <span v-if="editableData[record.id]">
                        <a-popconfirm @confirm="save(record.id)" title="Sure to edit?"><a>Save</a></a-popconfirm>
                        <span>&nbsp;</span>
                        <a @click="cancel(record.id)">
                            <a>Cancel</a>
                        </a>
                    </span>
                    <span v-else>
                        <a @click="edit(record.id)">Edit</a>
                        <span>&nbsp;</span>
                        <a-popconfirm v-if="dataSource.length" title="Sure to delete?" @confirm="onDelete(record.id)">
                            <a>Delete</a>
                        </a-popconfirm>
                    </span>
                </div>
            </template>
        </template>
    </a-table>
</template>

<script setup>
import { cloneDeep } from 'lodash-es';
import { reactive, ref, computed, onBeforeMount } from 'vue';
import { SearchOutlined } from '@ant-design/icons-vue';
import CategoryForm from '@/components/admin/PageWrapper/Categories/CategoryForm.vue';
import { categoryData } from '@/stores/admin/categories';
import UserData from '@/utils/session-data.js';
import CategoryViewModel from './CategoryViewModel.vue';
import { Common } from '@/utils/common';

const store = categoryData();

// tree select model
const options = ref([]);
const categoryCombine = ref([]);
const messageValidateModel = ref('');

//validate edit category
const isSuccess = ref(false);
const messageSuccess = ref();

// validate add category
const isAddedFailed = ref(false);
const messageAddedFailed = ref();

// validate delete category
const messageDeletedFailed = ref();
const isDeletedFailed = ref(false);

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        width: '10%',
        customFilterDropdown: true,
        onFilter: (value, record) => record.id.toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: visible => {
            if (visible) {
                setTimeout(() => {
                    searchInput.value.focus();
                }, 100);
            }
        },
        sorter: (a, b) => a.id - b.id > 0,
        sortDirections: ['descend', 'ascend'],
    },
    {
        title: 'Tên Danh mục',
        dataIndex: 'name',
        width: '40%',
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
        title: 'Danh mục cha',
        dataIndex: 'parent_id',
        width: '40%',
        customFilterDropdown: true,
        onFilter: (value, record) => categoryCombine.value[record.parent_id].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: visible => {
            if (visible) {
                setTimeout(() => {
                    searchInput.value.focus();
                }, 100);
            }
        },
        sorter: (a, b) => categoryCombine.value[a.parent_id].localeCompare(categoryCombine.value[b.parent_id]),
        sortDirections: ['descend', 'ascend'],
    },
    {
        title: 'Thao tác',
        dataIndex: 'operation',
    }
];

// fetch Data to Grid
const isLoading = ref(false);
const fetchData = async () => {
    await store.getAllCategories(UserData.token);
    if (!store.data.error) {
        dataSource.value = store.data.categories;
        categoryCombine.value = store.data.category_combine
        options.value = store.data.category_model;
    }
}

const dataSource = ref([]);
const editableData = reactive({});

// edit, update
const edit = id => {
    editableData[id] = cloneDeep(dataSource.value.filter(item => id === item.id)[0]);
};

// validate Grid model
const validateModel = (id) => {
    messageValidateModel.value = '';
    let dataChanged = editableData[id];
    if (dataChanged.parent_id === dataChanged.id) {
        messageValidateModel.value = 'Không thể chọn danh mục cha là chính mình!';
    } else {
        let isChild = Common.isDescendantOf(dataChanged.parent_id, dataChanged.id, options.value);
        if (isChild) {
            messageValidateModel.value = 'Không thể chọn danh mục con của danh mục hiện tại!';
        }
    }
}
// save edit category
const save = async id => {
    isSuccess.value = false;
    if (messageValidateModel.value == '') {
        let categoryOld = dataSource.value.filter(item => id === item.id)[0];
        isLoading.value = true;
        await store.updateCategory(
            UserData.token,
            {
                'category_name': editableData[id].name,
                'parent_id': editableData[id].parent_id
            },
            editableData[id].id
        );
        options.value = store.data.categories_options;
        Object.assign(categoryOld, editableData[id]);
        isLoading.value = false;
        isSuccess.value = true;
        messageSuccess.value = store.data.message;
        delete editableData[id];
    }
};
// cancel edit category
const cancel = key => {
    delete editableData[key];
};

// delete
const onDelete = async id => {
    isDeletedFailed.value = false;
    messageDeletedFailed.value = '';
    await store.deletecategory(UserData.token, id);
    let error = store.data.error;
    if (!error) {
        dataSource.value = dataSource.value.filter(item => item.id !== id);
        options.value = store.data.categories_options;
        isSuccess.value = true;
        messageSuccess.value = store.data.message;
    } else {
        isDeletedFailed.value = true;
        messageDeletedFailed.value = "Đã xảy ra lỗi hệ thống!";
    }
};

// Search
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

// Check if the pressed button is the ESC key.
const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
        for (let key in editableData) {
            editableData[key] = null;
        }
    }
}

// Add new data
const handleAdd = async () => {
    let newData = {
        name: categoryRef.value.modelRef.name,
        parent_id: categoryRef.value.modelRef.parent_id
    }
    await store.createCategory(UserData.token, newData);
    if (store.data.error === false) {
        dataSource.value = store.data.categories;
        options.value = store.data.categories_options;
        categoryCombine.value = store.data.category_combine;
        return false;
    } else {
        return true;
    }

};

// show modal Add
const open = ref(false);
const confirmLoading = ref(false);
const showModal = () => {
    open.value = true;
};

const categoryRef = ref(null);

const handleOk = async () => {
    isAddedFailed.value = false;
    await categoryRef.value.onSubmit();
    confirmLoading.value = true;
    if (categoryRef.value.errorAdded.error) {
        confirmLoading.value = false;
        return;
    }
    let error = await handleAdd();
    if (error === false) {
        open.value = false;
        confirmLoading.value = false;
        isSuccess.value = true;
        messageSuccess.value = store.data.message;
    } else {
        isAddedFailed.value = true;
        messageAddedFailed.value = 'Đã xảy ra lỗi hệ thống!';
        confirmLoading.value = false;
        return;
    }
}

onBeforeMount(async () => {
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