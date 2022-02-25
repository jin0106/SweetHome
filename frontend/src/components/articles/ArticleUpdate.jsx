import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import style from "style/articles/ArticleCreate.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { articleAxios, createFormData } from "utils/articleAxios";
import { setImage } from "utils/setImage";

function ArticleUpdate() {
	const location = useLocation();
	const navigate = useNavigate();
	const articleId = location.state.articleId;
	const user = useSelector((state) => state.userInfo.apt_house);
	const [articleData, setArticleData] = useState({ title: "", content: "" });
	const [imgFile, setImgFile] = useState("");

	const { title, content } = articleData;

	useEffect(() => {
		getArticle();
	}, []);

	const getArticle = async () => {
		const res = await articleAxios(user.apt.apt_id, articleId, "get");
		setArticleData({ title: res.data.title, content: res.data.content });
	};

	const handleInputChange = (e) => {
		setArticleData({ ...articleData, [e.target.id]: e.target.value });
	};

	const handleImageChange = (e) => {
		setImage(e, setImgFile);
	};

	const handleFormSubmit = async (e) => {
		e.preventDefault();
		const formData = createFormData(articleData, imgFile);

		if (title.trim() && content.trim()) {
			articleAxios(user.apt.apt_id, articleId, "put", formData);
			setArticleData({ title: "", content: "" });
			setImgFile("");
			navigate(-1);
		} else {
			alert("제목과 내용 모두 입력해주세요!");
		}
	};

	const handleCancelButtonClick = () => {
		navigate(-1);
	};

	return (
		<div className={style.update_body}>
			<form onSubmit={handleFormSubmit}>
				<input
					type="text"
					id="title"
					className={style.input_text}
					value={title}
					onChange={handleInputChange}
				/>
				<input
					type="text"
					id="content"
					className={style.textarea}
					value={content}
					onChange={handleInputChange}
				/>
				<div className={style.button_box}>
					<div>
						<label htmlFor="file" className={style.file_label}>
							<FontAwesomeIcon icon={faCamera} color="#afafaf" size="lg" />
						</label>
						<input
							type="file"
							id="file"
							className={style.input_file}
							accept="image/*"
							onChange={handleImageChange}
						/>
					</div>
					<div className={style.updateBtns}>
						<button onClick={handleCancelButtonClick} className={style.outline_btn}>
							취소
						</button>
						<button>수정</button>
					</div>
				</div>
			</form>
		</div>
	);
}

export default ArticleUpdate;
