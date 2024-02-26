<template>
    <div>
        <a-alert :message="messageError" type="error" closable v-if="error" />
        <br>
        <a-form :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-form-item :label="labelName" v-bind="validateInfos.name">
                <a-input v-model:value="modelRef.name" />
            </a-form-item>
            <a-form-item :label="labelParent" v-bind="validateInfos.parent_id">
                <CategoryViewModel :options="options" v-model:value="modelRef.parent_id" />
            </a-form-item>
            <a-button style="margin-left: 10px" @click="resetFields">Reset</a-button>
        </a-form>
    </div>
</template>

<script setup>
import { reactive, toRaw, defineExpose, defineProps, ref } from 'vue';
import { Form } from 'ant-design-vue';
import CategoryViewModel from './CategoryViewModel.vue';

const useForm = Form.useForm;

const errorAdded = ref();

const props = defineProps(
    {
        'options': Array,
        'error': Boolean,
        'messageError': String,
        'labelName': String,
        'labelParent': String
    }
);

const labelCol = {
    span: 4,
};
const wrapperCol = {
    span: 14,
};
const modelRef = ref({
    name: '',
    parent_id: undefined
});
const rulesRef = reactive({
    name: [
        {
            required: true,
            message: 'Hãy nhập ' + props.labelName.toLowerCase(),
        },
    ],
    parent_id: [
        {
            required: true,
            message: 'Hãy chọn ' + props.labelParent.toLowerCase(),
        },
    ]
});
const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef, {
    onValidate: (...args) => console.log(...args),
});
const onSubmit = async () => {
    await validate()
        .then(() => {
            errorAdded.value = { 'error': false };
            console.log(toRaw(modelRef));
        })
        .catch(err => {
            errorAdded.value = { 'error': true };
            console.log('error', err);
        });
};

defineExpose({
    modelRef,
    errorAdded,
    onSubmit,
    resetFields
});
</script>