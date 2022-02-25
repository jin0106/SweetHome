import { useDispatch, useSelector } from "react-redux";
import { SET_REPORT } from "store/report";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import style from "style/articles/ArticleDetailButtons.module.css";
import { SET_MESSAGE } from "store/message";
import { articleAxios } from "utils/articleAxios";

function ArticleDetailButtons({ article, articleId }) {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const username = useSelector((state) => state.userInfo.username);
	const userApt = useSelector((state) => state.userInfo.apt_house);

	const handleDeleteButtonClick = async () => {
		if (window.confirm("글을 삭제 하시겠습니까?")) {
			await articleAxios(userApt.apt.apt_id, articleId, "delete");
			navigate(-1);
		}
	};

	const createPopupWin = (pageURL, pageTitle, popupWinWidth, popupWinHeight) => {
		let left = window.screen.width / 2 - popupWinWidth / 2;
		let top = window.screen.height / 2 - popupWinHeight / 2;
		let myWindow = window.open(
			pageURL,
			pageTitle,
			"resizable=yes, width=" +
				popupWinWidth +
				", height=" +
				popupWinHeight +
				", top=" +
				top +
				", left=" +
				left,
		);
	};

	const handleMessageButtonClick = async () => {
		await dispatch(
			SET_MESSAGE({
				username: article.username,
			}),
		);
		createPopupWin(
			`/send-message/${article.username}`,
			`/send-message/${article.username}`,
			450,
			500,
		);
	};

	const reportArticle = async () => {
		await dispatch(
			SET_REPORT({
				...article,
				id: articleId,
				type: "articles",
			}),
		);
		createPopupWin("/report", "report", 450, 500);
	};

	return (
		<div className={style.button_box}>
			{article.username === username ? (
				<div>
					<Link
						to={`/articles/${articleId}/update`}
						state={{ articleId }}
						className={style.buttons}
					>
						수정
					</Link>
					<button onClick={handleDeleteButtonClick} className={style.buttons}>
						삭제
					</button>
				</div>
			) : (
				<div>
					<button onClick={handleMessageButtonClick} className={style.buttons}>
						쪽지
					</button>
					<button onClick={reportArticle} className={style.buttons}>
						신고
					</button>
				</div>
			)}
		</div>
	);
}

export default ArticleDetailButtons;
