import { useState } from "react";
import { useSelector } from "react-redux";
import style from "style/articles/ArticleCreate.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { createFormData } from "utils/articleAxios";
import { setImage } from "utils/setImage";
import { articlePostAxios } from "utils/articleAxios";

function ArticleCreateForm({ boardId, invertFormStatus, getArticlesAfterCreate }) {
	const user = useSelector((state) => state.userInfo.apt_house);
	const [articleData, setArticleData] = useState({ title: "", content: "" });
	const [imgFile, setImgFile] = useState(null);
	const { title, content } = articleData;

	const handleFormSubmit = async (e) => {
		e.preventDefault();

		const formData = await createFormData(articleData, imgFile);

		if (title.trim() && content.trim()) {
			await articlePostAxios(user.apt.apt_id, boardId, formData);
			setArticleData({ title: "", content: "" });
			setImgFile({});
			getArticlesAfterCreate();
		} else {
			alert("제목과 내용 모두 입력하세요!");
		}
	};

	const handleInputChange = (e) => {
		setArticleData({ ...articleData, [e.target.id]: e.target.value });
	};

	const handleImageChange = (e) => {
		setImage(e, setImgFile);
	};

	return (
		<div className={style.opened}>
			<form onSubmit={handleFormSubmit}>
				<input
					type="text"
					id="title"
					value={title}
					onChange={handleInputChange}
					placeholder="제목을 입력하세요"
					className={style.input_text}
					maxLength="45"
				/>

				<textarea
					type="text"
					id="content"
					value={content}
					onChange={handleInputChange}
					placeholder="내용을 입력하세요"
					className={style.textarea}
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
					<div className={style.btns}>
						<button onClick={invertFormStatus} type="button" className={style.outline_btn}>
							취소
						</button>
						<button type="submit">작성</button>
					</div>
				</div>
			</form>
		</div>
	);
}

export default ArticleCreateForm;
