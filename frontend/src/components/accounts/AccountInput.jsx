import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faCheck, faBan } from "@fortawesome/free-solid-svg-icons";
import style from "style/SignIn.module.css";
import axios from "axios";

function SignInPassword({ onChange, password, email }) {
	const URL = process.env.REACT_APP_SERVER_URL;
	const [passwordType, setPasswordType] = useState({
		type: "password",
		visible: false,
	});

	const [isDup, setIsDup] = useState(0);

	const changePasswordType = () => {
		setPasswordType(() => {
			if (passwordType.visible) return { type: "password", visible: false };
			return { type: "text", visible: true };
		});
	};

	const checkEmailDup = () => {
		axios({
			url: `${URL}/api/members/exist-email`,
			method: "get",
			headers: { "Content-Type": "application/json" },
			data: { value: email },
		})
			.then((res) => (res.data.result ? setIsDup(1) : setIsDup(2)))
			.catch((err) => console.log(err.response));
	};
	return (
		<div className={style.password}>
			<div>
				<input
					type="text"
					placeholder="email"
					id="email"
					onChange={onChange}
					onBlur={checkEmailDup}
					value={email}
				/>
				{(isDup === 1 && (
					<FontAwesomeIcon icon={faBan} className={isDup ? style.iconDuplicate : style.notDupl} />
				)) ||
					(isDup === 2 && (
						<FontAwesomeIcon
							icon={faCheck}
							className={isDup ? style.notDupl : style.iconDuplicate}
						/>
					))}
			</div>

			<div className={style.password_div}>
				<input
					type={passwordType.type}
					placeholder="숫자 + 문자로 비밀번호를 입력하세요"
					onChange={onChange}
					value={password}
					id="password"
				/>
				{passwordType.visible ? (
					<FontAwesomeIcon
						icon={faEye}
						className={password.length ? `${style.icon}` : `${style.hidden}`}
						onClick={changePasswordType}
					/>
				) : (
					<FontAwesomeIcon
						icon={faEyeSlash}
						className={password.length ? `${style.icon}` : `${style.hidden}`}
						onClick={changePasswordType}
					/>
				)}
			</div>
		</div>
	);
}

export default SignInPassword;
