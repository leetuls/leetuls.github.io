<template>
    <a-button class="editable-add-btn" style="margin-bottom: 8px; float: right;" @click="showModal">Thêm</a-button>
    <a-popconfirm title="Xóa các menu đã chọn?" @confirm="removeData">
        <template #icon><question-circle-outlined style="color: red" /></template>
        <a-button class="editable-delete-btn" style="margin-bottom: 8px; float: right;">
            Xóa
        </a-button>
    </a-popconfirm>
    <a-space :align="'center'" style="margin-bottom: 16px">
        CheckStrictly:
        <a-switch v-model:checked="rowSelection.checkStrictly"></a-switch>
    </a-space>
    <div><a-alert message="Hãy chọn ít nhất 1 bản ghi để xóa!" type="error" closable v-if="isSelectedRows"
            :after-close="handleClose" /></div>
    <a-modal :width="800" v-model:open="open" title="Thêm menu" :confirm-loading="confirmLoading" @ok="handleOk">
        <CategoryForm ref="menuRef" :options="options" messageError="" :error="false" labelName="Tên menu"
            labelParent="Menu cha" />
    </a-modal>
    <a-table :columns="columns" :data-source="dataSource" :row-selection="rowSelection" :loading="isLoading"
        :pagination="{ pageSize: 7 }">
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
            <template v-if="['name'].includes(column.dataIndex)">
                <div>
                    <a-input v-if="editableData[record.key]" v-model:value="editableData[record.key][column.dataIndex]"
                        @keyup.enter="save(record.key)" />
                    <template v-else>
                        {{ text }}
                    </template>
                </div>
            </template>
            <template v-if="['parent_id'].includes(column.dataIndex)">
                <div>
                    <CategoryViewModel v-if="editableData[record.key]" :options="options" :style="changeStyle()"
                        v-model:value="editableData[record.key][column.dataIndex]" @keyup.enter="save(record.key)">
                    </CategoryViewModel>
                    <template v-else>
                        {{ menuCombine[text] }}
                    </template>
                </div>
            </template>
            <template v-if="column.dataIndex === 'operation'">
                <div class="editable-row-operations">
                    <span v-if="editableData[record.key]">
                        <a-popconfirm @confirm="save(record.key)" title="Sure to edit?"><a>Save</a></a-popconfirm>
                        <span>&nbsp;</span>
                        <a @click="cancel(record.key)">
                            <a>Cancel</a>
                        </a>
                    </span>
                    <span v-else>
                        <a @click="edit(record.key)">Edit</a>
                    </span>
                </div>
            </template>
        </template>
    </a-table>
</template>
<script setup>
import { cloneDeep } from 'lodash-es';
import { ref, reactive, onBeforeMount, watch } from 'vue';
import { SearchOutlined, QuestionCircleOutlined } from '@ant-design/icons-vue';
import { Common } from '@/utils/common';
import CategoryViewModel from '@/components/admin/PageWrapper/Categories/CategoryViewModel.vue';
import CategoryForm from '@/components/admin/PageWrapper/Categories/CategoryForm.vue';
import { menuData } from '@/stores/admin/menus';
import UserData from '@/utils/session-data.js';

// store data
const dataSource = ref([]);
const store = menuData();
const menuCombine = ref([]);
// end store data

// fetch Data to Grid
const isLoading = ref(false);
const fetchData = async () => {
    await store.getMenus(UserData.token);
    if (!store.data.error) {
        dataSource.value = store.data.menus['tree'];
        menuCombine.value = store.data.menu_combine
        options.value = store.data.menu_model;
    }
}
// End fetch Data to Grid

const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        customFilterDropdown: true,
        onFilter: (value, record) => searchData(value, record, 'name'),
        onFilterDropdownOpenChange: visible => {
            if (visible) {
                setTimeout(() => {
                    searchInput.value.focus();
                }, 100);
            }
        },
    },
    {
        title: 'Danh mục cha',
        dataIndex: 'parent_id',
        width: '40%',
        key: 'address',
    },
    {
        title: 'Thao tác',
        dataIndex: 'operation',
        width: '8.4%',
    }
];

// Data Selected
const selectedData = ref([]);
const rowSelection = ref({
    checkStrictly: false,
    onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    onSelect: (record, selected, selectedRows) => {
        selectedData.value = selectedRows;
        console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
        selectedData.value = selectedRows;
        console.log(selected, selectedRows, changeRows);
    },
});
// End data Selected

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
const searchData = (value, record, dataIndex) => {
    if (record.hasOwnProperty('children')) {
        let foundData = Common.searchByName(record, value);
        return foundData.length > 0 ? true : false;
    } else {
        return record[dataIndex].toString().toLowerCase().includes(value.toLowerCase());
    }
}
// End Search

// inline data edit
const editableData = reactive({});
const edit = key => {
    let dataEdit = cloneDeep(dataSource.value.filter(item => key === item.key)[0]);
    if (dataEdit) {
        editableData[key] = cloneDeep(dataSource.value.filter(item => key === item.key)[0]);
    } else {
        editableData[key] = Common.findObjectByKey(dataSource.value, key);
    }
};
const save = key => {
    let dataSave = dataSource.value.filter(item => key === item.key)[0];
    if (dataSave) {
        Object.assign(dataSave, editableData[key]);
    } else {
        Object.assign(Common.findObjectByKey(dataSource.value, key), editableData[key]);
    }
    delete editableData[key];
};
const cancel = key => {
    delete editableData[key];
};
// End inline data edit

// Check if the pressed button is the ESC key.
const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
        for (let key in editableData) {
            editableData[key] = null;
        }
    }
}
onBeforeMount(async () => {
    isLoading.value = true;
    await fetchData();
    isLoading.value = false;
    document.addEventListener('keydown', handleKeyDown);
});
// End check if the pressed button is the ESC key.

// delete
const isSelectedRows = ref(false);
const handleClose = () => {
    isSelectedRows.value = false;
};
const removeData = () => {
    let keys = Common.uniqueKeys(selectedData.value);
    if (keys.length === 0) {
        isSelectedRows.value = true;
    }
}
// end delete

// Menus model
const options = ref([]);
// End Menus model

// Modal add new menus
const menuRef = ref(null);
const open = ref(false);
const confirmLoading = ref(false);
const showModal = () => {
    open.value = true;
};
const handleOk = () => {
    menuRef.value.onSubmit();
}
// End modal add new menus

// change style
const changeStyle = () => {
    return $('.ant-table-row-expand-icon-collapsed').length > 0 ||
        $('.ant-table-row-expand-icon-expanded').length > 0 ? 'margin-top: 18px' : '';
}
// end change style
</script>