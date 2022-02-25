import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as fasHeart } from "@fortawesome/free-solid-svg-icons";
import { faComment } from "@fortawesome/free-regular-svg-icons";
import { Link } from "react-router-dom";
import style from "style/articles/ArticleListItem.module.css";
import anonymous from "assets/anonymous.jpg";

function ArticleListItem({ article, board }) {
	const { id, username, created_at, title, content, image_url, total_likes, total_replies } =
		article;

	const setArticleUserImg = () => {
		return article.user_image ? article.user_image : anonymous;
	};

	return (
		<li className={style.article}>
			<Link to={`/articles/${id}`} state={{ articleId: id, board: board }}>
				<div className={style.article_profile}>
					<div className={style.profile_img}>
						<img src={setArticleUserImg()} alt="profile" />
					</div>
					<p>{username} ⋅ </p>
					<p className={style.created}>{created_at.slice(5, 10)}</p>
				</div>
				<h3 className={style.title}>{title}</h3>
				{image_url && (
					<div className={style.img_box}>
						<img src={image_url} alt="" />
					</div>
				)}
				<div className={style.content}>{content}</div>
				<div className={style.article_bottom}>
					<FontAwesomeIcon icon={fasHeart} color="#888888" className={style.icons} size="lg" />
					<span className={style.icons}>{total_likes}</span>
					<FontAwesomeIcon icon={faComment} color="#595959" className={style.icons} size="lg" />
					<span className={style.icons}>{total_replies}</span>
				</div>
			</Link>
		</li>
	);
}

export default ArticleListItem;
