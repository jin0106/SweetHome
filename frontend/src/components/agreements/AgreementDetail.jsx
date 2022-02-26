import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { authorityCheck } from "utils/authority";
import style from "style/AgreementDetail.module.css";
import { agreementDetailAxios, deleteAgreementAxios } from "utils/agreementAxios";

function AgreementDetail() {
	const SERVER_URL = process.env.REACT_APP_SERVER_URL;
	const location = useLocation();
	const navigate = useNavigate();
	const user = useSelector((state) => state.userInfo);
	const authority = useSelector((state) => state.userInfo.authority);
	const agreementId = location.state.id;
	const progress = location.state.progress;
	const [agreement, setAgreement] = useState("");
	const [agreementStatus, setAgreementStatus] = useState("");
	const today = new Date();

	useEffect(() => {
		getAgreementStatus();
	}, []);

	const getAgreementStatus = async () => {
		const res = await agreementDetailAxios("get", agreementId);
		setAgreement(res.data);
	};

	const handleFormSubmit = async (e) => {
		e.preventDefault();
		await agreementDetailAxios("post", agreementId, { agreement_status: agreementStatus });
		setAgreementStatus("");
		navigate("/agreements");
	};

	const handleInputChange = (e) => {
		e.target.value === "agree" ? setAgreementStatus(true) : setAgreementStatus(false);
	};

	const handleDeleteButtonClick = async () => {
		await deleteAgreementAxios(agreementId);
		navigate(-1);
	};

	const isInProgress = () => {
		if (progress === "진행중") {
			return "진행중";
		} else if (progress === "만료") {
			return "기한 만료된 동의서입니다";
		} else {
			return "진행 대기 중인 동의서입니다";
		}
	};

	return (
		agreement && (
			<div className={style.body}>
				<div>
					<h2 className={style.title}>{agreement.title}</h2>
				</div>
				<article>
					<div className={style.content}>{agreement.content}</div>
					<p className={style.user_info}>
						{user.apt_house.dong} 동 {user.apt_house.ho} 호 {user.username}
					</p>

					<p className={style.date}>
						{today.getFullYear()}년 {today.getMonth() + 1}월 {today.getDate()}일
					</p>

					{authorityCheck(authority) === 3 ? (
						<button onClick={handleDeleteButtonClick} className={style.btn}>
							삭제
						</button>
					) : isInProgress() === "진행중" ? (
						agreement.my_agreed === null ? (
							<form onSubmit={handleFormSubmit}>
								<div>
									<div className={style.radio_btn}>
										<input
											type="radio"
											id="agree"
											name="status"
											value="agree"
											onChange={handleInputChange}
										/>
										<label htmlFor="agree" className={style.first_label}>
											동의
										</label>
										<input
											type="radio"
											id="disagree"
											name="status"
											value="disagree"
											onChange={handleInputChange}
										/>
										<label htmlFor="disagree">반대</label>
									</div>
									<button>제출</button>
								</div>
							</form>
						) : (
							<p className={style.not_in_progress}>이미 제출한 동의서입니다</p>
						)
					) : (
						<p className={style.not_in_progress}>{isInProgress()}</p>
					)}
				</article>
			</div>
		)
	);
}

export default AgreementDetail;
