import { useEffect, useState } from "react";
import ArticleCreateForm from "./ArticleCreateForm";
import style from "style/articles/ArticleCreate.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";

function ArticleCreate({ boardId }) {
	const [formOpen, setFormOpen] = useState(false);

	useEffect(() => {
		setFormOpen(false);
	}, [boardId]);

	const invertFormStatus = () => {
		setFormOpen((prev) => !prev);
	};

	const getArticlesAfterCreate = () => {
		window.location.replace(`/boards/${boardId}`);
	};

	return formOpen ? (
		<ArticleCreateForm boardId={boardId} getArticlesAfterCreate={getArticlesAfterCreate} />
	) : (
		<div onClick={invertFormStatus} className={style.closed}>
			<p className={style.closed_msg}>새 글을 작성해주세요!</p>
			<FontAwesomeIcon icon={faPen} color="#8f8f8f" />
		</div>
	);
}

export default ArticleCreate;
