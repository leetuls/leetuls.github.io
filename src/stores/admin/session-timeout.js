import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useCookies } from "vue3-cookies";
import UserData from '@/utils/session-data.js';
import { useAuthStore } from './auth';

const { cookies } = useCookies();

export const Session = defineStore('session',
    {
        state: () => ({ sessionTimeout: ref(Promise) }),
        actions: {
            startSessionTimeout() {
                this.sessionTimeout.value = setTimeout(async function () {
                    let store = useAuthStore();
                    await store.logout(UserData.token);
                    cookies.set('session_data', null, 0);
                    // redirect to login page
                    window.location.href = '/login-admin';
                    // 600000 milliseconds = 10 min
                }, 600000);
            },
            resetSessionTimeout() {
                clearTimeout(this.sessionTimeout.value);
                cookies.set('session_data', UserData, 600, null, null, true);
                this.startSessionTimeout();
            },
            addEventTimeout() {
                // Set up event listeners for all user activities to refresh session timeout.
                document.addEventListener("mousemove", this.resetSessionTimeout);
                document.addEventListener("keyup", this.resetSessionTimeout);
            },
            async removeEventTimeout() {
                document.removeEventListener('mousemove', this.resetSessionTimeout);
                document.removeEventListener('keyup', this.resetSessionTimeout);
            }
        }
    }
);