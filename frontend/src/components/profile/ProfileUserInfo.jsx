import React, { useEffect, useState, useRef } from "react";
import * as inputValid from "utils/inputValid";
import axios from "axios";
import { toast } from "react-toastify";
import ProfileButtons from "./ProfileButtons";
import style from "style/Profile.module.css";
import { thisDuplicte } from "utils/accountAxios";
import { useDispatch, useSelector } from "react-redux";
import { GETUSERINFO } from "utils/profileAxios";
import { SET_USER } from "store/user";
import anonymous from "assets/anonymous.jpg";
import ProfileNav from "./ProfileNav";
import { persistor } from "index";
import errorMessage from "store/errorMessage";
import { cookieDelete } from "utils/manageToken";
import ProfileUserInfoInput from "./ProfileUserInfoInput";
import { setImage } from "utils/setImage";

function ProfileUserInfo({ setIntro, intro, active, setActive }) {
	const SERVER_URL = process.env.REACT_APP_SERVER_URL;
	const user = useSelector((state) => state.userInfo);
	const [isDup, setIsDup] = useState(0);
	const [loading, setLoading] = useState(false);
	const [userInfo, setUserInfo] = useState({
		username: null,
		email: null,
		phone_number: "",
		authority: "",
		apt_house: {},
		password: null,
		image_url: null,
	});
	const profileImage = useRef(null);
	const [imgFile, setFiles] = useState(null);
	const dispatch = useDispatch();

	useEffect(() => {
		GETUSERINFO(dispatch, SET_USER);
		setUserInfo(user);
	}, []);

	const { username, email, phone_number, apt_house, password } = userInfo;
	const isValid = inputValid.profileChange(email, phone_number);

	const onChange = (e) => {
		setUserInfo({ ...userInfo, [e.target.id]: e.target.value });
	};

	const checkUserDup = () => {
		const data = { value: username };
		if (username === user.username) {
			alert("현재 닉네임과 같습니다");
			return setIsDup(2);
		}
		thisDuplicte("name", data, setIsDup);
	};
	const onSubmit = (e) => {
		e.preventDefault();
		if (isDup === 2 && isValid && username.trim().length > 0) {
			const formData = new FormData();
			const data = { email, password, username, phone_number };
			if (imgFile) {
				formData.append("image", imgFile);
			} else {
				formData.append("image", new Blob([]), { type: "multipart/form-data" });
			}
			formData.append("profile", new Blob([JSON.stringify(data)], { type: "application/json" }));
			axios({
				method: "put",
				url: `${SERVER_URL}/api/members/my-profile`,
				data: formData,
			})
				.then(() => {
					setLoading(!loading);
					setIntro({
						...intro,
						email,
						username,
						image_url: user.image_url,
					});
					setUserInfo({ ...userInfo, password: "" });
				})
				.then(() => toast.success("회원정보가 변경 되었습니다"))
				.catch((err) => console.log(err.response.data));

			setIsDup(0);
		} else {
			toast.error("회원 정보가 변경 되지 않았습니다.");
		}
	};

	const setProfileImage = (e) => {
		setImage(e, setFiles);
	};

	const deleteAccount = () => {
		window.confirm("정말로 회원 탈퇴를 진행 하시겠습니까?") &&
			axios({
				url: `${SERVER_URL}/api/members`,
				method: "delete",
			})
				.then(() => {
					persistor.purge();
					cookieDelete();
				})
				.then(() => window.location.replace("/"))
				.catch((err) => errorMessage(err.response.data.error_code));
	};

	return (
		userInfo.authority && (
			<>
				<div className={style.profile_user}>
					<figure className={style.figure}>
						<input
							ref={profileImage}
							className={style.input_image}
							type="file"
							accept="image/*"
							onChange={setProfileImage}
						/>
						<img
							src={user.image_url ? user.image_url : anonymous}
							alt="Profile img"
							className={style.profile_img}
							onClick={() => profileImage.current.click()}
						/>
					</figure>
					<div>
						<h1 className={style.title}>{intro.username}</h1>
						<p className={style.email}>{intro.email}</p>
					</div>

					<button type="button" onClick={deleteAccount} className={style.deleteAccount}>
						회원 탈퇴
					</button>
				</div>
				<ProfileNav active={active} setActive={setActive} />
				<form onSubmit={onSubmit} className={style.profile_form}>
					<div className={`${style.first_div}`}>
						<ProfileUserInfoInput
							naming="닉네임"
							inputId="username"
							value={username}
							onChange={onChange}
						/>
						<button type="button" onClick={checkUserDup} className={style.btn_duplicate}>
							중복 검사
						</button>
					</div>
					<p className={style.duplic}>중복검사 버튼을 눌러주세요</p>
					<ProfileUserInfoInput naming="Email" inputId="email" value={email} onChange={onChange} />
					<ProfileUserInfoInput
						naming="휴대폰 번호"
						inputId="phone_number"
						value={phone_number}
						onChange={onChange}
					/>
					{apt_house && (
						<ProfileUserInfoInput
							naming="주소"
							inputId="apt_house"
							value={apt_house.apt.road_Name}
						/>
					)}
					<ProfileUserInfoInput
						naming="비밀번호"
						inputId="password"
						value={password}
						onChange={onChange}
						type="password"
					/>
					<ProfileButtons password={password} isDup={isDup} />
				</form>
			</>
		)
	);
}

export default ProfileUserInfo;
