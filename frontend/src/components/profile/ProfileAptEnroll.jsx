import React from "react";
import { useState } from "react";

function ProfileAptEnroll() {
	const [aptEnroll, setAptEnroll] = useState({
		apt_id: "",
		dong: "",
		ho: "",
	});
	return <h1>아파트 등록 및 이사가기?</h1>;
}

export default ProfileAptEnroll;
