import { useCookies } from "vue3-cookies";

const { cookies } = useCookies();
const dataSession = cookies.get('session_data') ||
{
    'username': '',
    'token': ''
};
const UserData = {
    'username': dataSession.username,
    'token': dataSession.token
}

export default UserData;