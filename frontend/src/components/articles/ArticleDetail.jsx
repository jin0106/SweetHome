import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Comments from "../comments/Comments";
import ArticleDetailButtons from "./ArticleDetailButtons";
import style from "style/articles/ArticleDetail.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as fasHeart } from "@fortawesome/free-solid-svg-icons";
import { faComment } from "@fortawesome/free-regular-svg-icons";
import { useSelector } from "react-redux";
import anonymous from "assets/anonymous.jpg";
import { useDispatch } from "react-redux";
import { SET_ARTICLE_NUM } from "store/comment";
import { articleAxios, articleLikeAxios } from "utils/articleAxios";

function ArticleDetail() {
	const location = useLocation();
	const dispatch = useDispatch();
	const articleId = location.state.articleId;
	const board = location.state.board;
	const user = useSelector((state) => state.userInfo.apt_house);

	const [article, setArticle] = useState();
	const [isLiked, setIsLiked] = useState();
	const [comment, setComment] = useState(0);

	useEffect(() => {
		dispatch(SET_ARTICLE_NUM(articleId));
		getArticle();
		getArticleLiked();
	}, [isLiked, comment]);

	const getArticle = async () => {
		const res = await articleAxios(user.apt.apt_id, articleId, "get");
		setArticle(res.data);
		setComment(res.data.total_replies);
	};

	const getArticleLiked = async () => {
		const res = await articleLikeAxios(user.apt.apt_id, articleId, "get");
		setIsLiked(res.data.is_liked);
	};

	const handleHeartClick = async () => {
		const method = isLiked ? "delete" : "post";
		await articleLikeAxios(user.apt.apt_id, articleId, method);
		setIsLiked((prev) => !prev);
	};

	const setArticleUserImg = () => {
		const articleUserImg = article.user_image ? article.user_image : anonymous;
		return articleUserImg;
	};

	return (
		<div className={style.article_detail_page}>
			{article && (
				<section className={style.article_detail}>
					<div className={style.article_to_board}>
						<Link to={`/boards/${board.id}`} state={{ board: board }}>
							{board.name}
						</Link>
					</div>

					<div className={style.article_comment_box}>
						<article className={style.article}>
							<div className={style.article_top}>
								<div className={style.profile}>
									<div className={style.profile_img}>
										<img src={setArticleUserImg()} alt="profile" />
									</div>
									<div>
										<p>{article.username}</p>
										<p>{article.created_at.slice(0, 10)}</p>
									</div>
								</div>
								<ArticleDetailButtons article={article} articleId={articleId} />
							</div>

							<h3 className={style.article_title}>{article.title}</h3>
							{article.image_url && (
								<div className={style.article_img}>
									<img src={article.image_url} alt="article" />
								</div>
							)}
							<div className={style.article_content}>{article.content}</div>

							<div className={style.article_bottom}>
								<div className={style.article_bottom_info}>
									<FontAwesomeIcon icon={fasHeart} color="#888888" size="lg" />
									<span style={{ marginRight: "0.8rem" }}>{article.total_likes}</span>
									<FontAwesomeIcon icon={faComment} color="#595959" size="lg" />
									<span>{comment}</span>
								</div>
								<button className={style.heart_btn} onClick={handleHeartClick}>
									{isLiked ? (
										<FontAwesomeIcon icon={fasHeart} color="red" size="2x" />
									) : (
										<FontAwesomeIcon icon={fasHeart} color="#dedede" size="2x" />
									)}
								</button>
							</div>
						</article>
						<Comments
							totalComments={comment}
							setComment={setComment}
							getTotalComments={getArticle}
						/>
					</div>
				</section>
			)}
		</div>
	);
}

export default ArticleDetail;
