import axios from "axios";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

export function agreementAxios(method, data) {
	const response = axios({
		url: `${SERVER_URL}/api/admin/agreements`,
		method,
		data: {
			...data,
			start_date: `${data.start_date}T00:00:00`,
			end_date: `${data.end_date}T23:59:59`,
		},
	});
	return response;
}
