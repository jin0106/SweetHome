export function setImage(e, setState) {
	const image = e.target.files;
	if (image) {
		if (image[0].size > 200 * 1024 * 1024) {
			alert("200MB 이상의 이미지 파일은 등록할 수 없습니다.");
			e.target.value = null;
			return;
		}
		setState(image[0]);
	}
}
