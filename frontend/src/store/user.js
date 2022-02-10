const LOGIN = "user/setUserInfo";
const DELETE = "user/deleteUserInfo";

export const DELETE_USER = () => ({ type: DELETE });
export const SET_USER = (data) => ({ type: LOGIN, data });

const initialState = {
	username: "",
	email: "",
	phone_number: "",
	authority: "",
};

const userInfo = (state = initialState, action) => {
	switch (action.type) {
		case LOGIN:
			return {
				...state,
				username: action.data.username,
				email: action.data.email,
				phone_number: action.data.phone_number,
				authority: action.data.authority,
			};
		case DELETE:
			return {
				...state,
				username: "",
				email: "",
				phone_number: "",
				authority: "",
			};
		default:
			return state;
	}
};

export default userInfo;
