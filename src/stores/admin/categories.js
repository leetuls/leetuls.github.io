import Api from '@/apis/api';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const categoryData = defineStore('categories',
    {
        state: () => ({ data: ref(null) }),
        actions: {
            async getAllCategories(token) {
                Api.defaults.headers.Authorization = 'Bearer ' + token;
                await Api.get('category')
                    .then(response => {
                        this.data = {
                            'error': false,
                            'status': 200,
                            'categories': response.data.categories,
                            'category_model': response.data.category_model,
                            'category_combine': response.data.category_combine
                        };
                    })
                    .catch(error => {
                        console.log(error);
                        this.data = {
                            'error': true
                        };
                    })
            },
            async updateCategory(token, payload, id) {
                Api.defaults.headers.Authorization = 'Bearer ' + token;
                await Api.post('category/edit/' + id, payload)
                    .then(response => {
                        this.data = {
                            'error': false,
                            'categories_options': response.data.categories_options,
                            'message': response.data.message
                        };
                    })
                    .catch(error => {
                        console.log(error);
                        this.data = {
                            'error': true
                        };
                    })
            },
            async createCategory(token, payload) {
                Api.defaults.headers.Authorization = 'Bearer ' + token;
                await Api.post('category/add', payload)
                    .then(response => {
                        this.data = {
                            'error': false,
                            'categories': response.data.categories,
                            'categories_options': response.data.categories_options,
                            'category_combine': response.data.category_combine,
                            'message': response.data.message
                        };
                    })
                    .catch(error => {
                        console.log(error);
                        this.data = {
                            'error': true
                        };
                    })
            },
            async deletecategory(token, id) {
                Api.defaults.headers.Authorization = 'Bearer ' + token;
                await Api.delete('category/delete/' + id)
                    .then(response => {
                        this.data = {
                            'error': false,
                            'categories_options': response.data.categories_options,
                            'message': response.data.message
                        };
                    })
                    .catch(error => {
                        console.log(error);
                        this.data = {
                            'error': true
                        };
                    })
            }
        }
    });