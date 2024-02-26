import Api from '@/apis/api';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth',
    {
        state: () => ({ data: ref(null) }),
        actions: {
            async authLogin(payload) {
                await Api.post('login', payload)
                    .then(response => {
                        if (!response.data.error) {
                            this.data = {
                                'status': 200,
                                'user': response.data.user,
                                'authorisation': response.data.authorisation
                            }
                        } else {
                            this.data = {
                                'status': 500,
                                'message': response.data.message
                            }
                        }
                    })
                    .catch(error => {
                        let status = error.response.status;
                        let errorData = [];
                        if (error.response.status === 429) {
                            errorData = [{ 'message': error.response.statusText }]
                        } else {
                            errorData = error.response.data.errors;
                        }
                        this.data = {
                            'status': status,
                            'error_data': errorData
                        }
                    })
            },
            async logout(token) {
                let router = useRouter();
                Api.defaults.headers.Authorization = 'Bearer ' + token;
                await Api.delete('logout')
                    .then(response => {
                        router.push('/admin');
                        this.data = {
                            'status': 200
                        }
                    })
                    .catch(error => {
                        window.location.href = '/404-page-not-found';
                    })
            }
        },
    }
)