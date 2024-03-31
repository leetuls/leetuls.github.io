import Api from '@/apis/api';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const productData = defineStore(
    'products',
    {
        state: () => ({ data: ref(null) }),
        actions: {
            async getProducts(token) {
                Api.defaults.headers.Authorization = 'Bearer ' + token;
                await Api.get('product')
                    .then(response => {
                        this.data = {
                            'error': false,
                            'status': 200,
                            'products': response.data.products
                        };
                    })
                    .catch(error => {
                        console.log(error);
                        this.data = {
                            'error': true,
                            'message': error.response.data.message
                        };
                    })
            },
        }
    }
);