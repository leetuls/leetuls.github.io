import { useCookies } from "vue3-cookies";

const { cookies } = useCookies();
const dataSession = cookies.get('session_data') ||
{
    'user_id': '',
    'username': '',
    'token': ''
};
const UserData = {
    'user_id': dataSession.user_id,
    'username': dataSession.username,
    'token': dataSession.token
}

export default UserData;