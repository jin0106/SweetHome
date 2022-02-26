import axios from "axios";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

export function postAgreementAxios(method, data) {
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

export function agreementDetailAxios(method, agreementId, data = "") {
	const response = axios({
		url: `${SERVER_URL}/api/agreements/${agreementId}`,
		method,
		data,
	});

	return response;
}

export function deleteAgreementAxios(agreementId) {
	const response = axios({
		url: `${SERVER_URL}/api/admin/agreements/${agreementId}`,
		method: "delete",
	});

	return response;
}

export function getAgreementAxios(currentPage) {
	const response = axios({
		url: `${SERVER_URL}/api/agreements?page=${currentPage}&size=10`,
		method: "get",
	});

	return response;
}
