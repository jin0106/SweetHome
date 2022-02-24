import axios from "axios";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

export function articleAxios(aptId, articleId, method, data = "") {
	const response = axios({
		url: `${SERVER_URL}/api/apts/${aptId}/boards/articles/${articleId}`,
		method,
		data,
	});
	return response;
}

export function createFormData(articleData, imgFile) {
	const formData = new FormData();
	formData.append("article", new Blob([JSON.stringify(articleData)], { type: "application/json" }));

	imgFile
		? formData.append("image", imgFile)
		: formData.append("image", new Blob([]), { type: "multipart/form-data" });

	return formData;
}
