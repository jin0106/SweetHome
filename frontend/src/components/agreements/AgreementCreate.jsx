import { useState } from "react";
import axios from "axios";
import style from "style/AgreementCreate.module.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function AgreementCreate(props) {
	const SERVER_URL = process.env.REACT_APP_SERVER_URL;
	const navigate = useNavigate();
	const [agreementData, setAgreementData] = useState({
		title: "",
		content: "",
		start_date: "",
		end_date: "",
	});
	const { title, content, start_date, end_date } = agreementData;

	const handleFormSubmit = (e) => {
		e.preventDefault();
		if (start_date > end_date) {
			toast.error("날짜를 확인해주세요");
			return;
		}
		if (title.trim() && content.trim() && start_date && end_date) {
			axios({
				url: `${SERVER_URL}/api/admin/agreements`,
				method: "post",
				data: {
					title,
					content,
					start_date: `${start_date}T00:00:00`,
					end_date: `${end_date}T23:59:59`,
				},
			}).then(() => {
				setAgreementData({
					title: "",
					content: "",
					start_date: "",
					end_date: "",
				});
				navigate(-1);
			});
		} else {
			alert("동의서 제목, 내용, 시작 날짜, 종료 날짜를 모두 입력해주세요.");
		}
	};

	const handleInputChange = (e) => {
		setAgreementData({ ...agreementData, [e.target.id]: e.target.value });
	};

	const handleCancelClick = () => {
		navigate(-1);
	};

	return (
		<form onSubmit={handleFormSubmit} className={style.form}>
			<h1>동의서 작성</h1>
			<input
				type="text"
				id="title"
				value={title}
				onChange={handleInputChange}
				placeholder="제목을 입력하세요"
			/>
			<div className={style.deadline}>
				<label className={style.label}>시작 날짜</label>
				<input type="date" id="start_date" value={start_date} onChange={handleInputChange} />
				<label className={style.label}>종료 날짜</label>
				<input type="date" id="end_date" value={end_date} onChange={handleInputChange} />
			</div>
			<textarea
				id="content"
				placeholder="동의서 내용을 입력하세요"
				value={content}
				onChange={handleInputChange}
				className={style.textarea}
			></textarea>
			<div className={style.btns}>
				<button className={style.submit_btn}>작성</button>
				<button className={style.cancel_btn} type="button" onClick={handleCancelClick}>
					취소
				</button>
			</div>
		</form>
	);
}

export default AgreementCreate;
