import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "components/accounts/AccountSignIn";
import Home from "pages/Home";
import Main from "pages/Main";
import SignUp from "pages/SignUp";
import PrivateRoute from "components/PrivateRoute";
import Profile from "pages/Profile";
import Message from "pages/Message";
import MessageSend from "components/messages/MessageSend";
import NotFound from "pages/NotFound";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MessageDetail from "components/messages/MessageDetail";
import Board from "components/boards/Board";
import ArticleDetail from "components/articles/ArticleDetail";
import ArticleUpdate from "components/articles/ArticleUpdate";
import style from "style/App.module.css";
import { useEffect, useState } from "react";
import { onReissueFail, tokenReissue } from "utils/manageToken";
import Spinner from "components/Spinner";
import AccountKakao from "components/accounts/AccountKakao";
import Admin from "pages/Admin";
import AdminMemberManage from "components/admin/member/AdminMemberManage";
import Agreements from "components/agreements/Agreements";
import AgreementCreate from "components/agreements/AgreementCreate";
import AccountForgotPassword from "components/accounts/AccountForgotPassword";
import AgreementDetail from "components/agreements/AgreementDetail";
import Report from "components/reports/Report";
import SiteAdmin from "components/site/SiteAdmin";
import AptMemberRequest from "pages/Authority/AptMemberRequest";
import AptAdminRequest from "pages/Authority/AptAdminRequest";
import AdminBoardManage from "components/admin/board/AdminBoardManage";
import AdminBoardUpdate from "components/admin/board/AdminBoardUpdate";
import AdminReportManage from "components/admin/report/AdminReportManage";
import AdminReportArticleDetail from "components/admin/report/AdminReportArticleDetail";
import AdminReportCommentDetail from "components/admin/report/AdminReportCommentDetail";
import AdminAgreementManage from "components/admin/agreement/AdminAgreementManage";
import AdminAgreementListSearch from "components/admin/agreement/AdminAgreementListSearch";
import Layout from "components/Layout";
import MessagePage from "components/messages/MessagePage";
import MessageSendTarget from "components/messages/MessageSendTarget";
import BoardCreate from "components/boards/BoardCreate";
function App() {
	const [loading, setLoading] = useState(false);
	useEffect(() => {
		try {
			tokenReissue(loginCallBack);
		} catch (e) {
			onReissueFail(loginCallBack);
		}
	}, []);

	function loginCallBack(isLoading) {
		setLoading(isLoading);
	}

	if (loading) {
		return (
			<div className={style.app_js}>
				<Router>
					<div>
						<Routes className={style}>
							<Route path="/" element={<Layout />}>
								<Route path="/" element={<Home />} />
								<Route path="/sign-in" element={<SignIn />} />
								<Route path="/sign-up" element={<SignUp />} />
								<Route path="/oauth2/code/kakao" element={<AccountKakao />} />
								<Route path="/forgot-password" element={<AccountForgotPassword />} />
								<Route path="" element={<PrivateRoute />}>
									<Route path="/main" element={<Main />} />
									<Route path="/profile/:username" element={<Profile />} />
									<Route path="/agreements" element={<Agreements />} />
									<Route path="/agreement/:agreementId" element={<AgreementDetail />} />
									<Route path="/agreement/create" element={<AgreementCreate />} />
									<Route path="/boards/:boardId" element={<Board />} />
									<Route path="/articles/:articleId" element={<ArticleDetail />} />
									<Route path="/articles/:articleId/update" element={<ArticleUpdate />} />
									<Route path="/messages" element={<MessagePage />} />
									<Route path="/message-box/" element={<Message />} />
									<Route path="send-message" element={<MessageSend />} />
									<Route path="/message-detail" element={<MessageDetail />} />
									<Route
										path="/read-send-message/message-detail/send-message"
										element={<MessageSend />}
									/>
									<Route path="/request/apt-member" element={<AptMemberRequest />} />
									<Route path="/request/apt-admin" element={<AptAdminRequest />} />
									<Route path="/admin" element={<Admin />} />
									<Route path="/site" element={<SiteAdmin />} />
									<Route path="member-manage" element={<AdminMemberManage />} />
									<Route path="board-manage" element={<AdminBoardManage />} />
									<Route path="board-manage/board-update" element={<AdminBoardUpdate />} />
									<Route path="report-manage" element={<AdminReportManage />} />
									<Route
										path="/report-manage/report-article-detail"
										element={<AdminReportArticleDetail />}
									/>
									<Route
										path="/report-manage/report-comment-detail"
										element={<AdminReportCommentDetail />}
									/>
									<Route path="agreement-manage" element={<AdminAgreementManage />} />
									<Route
										path="/agreement-manage/list-search"
										element={<AdminAgreementListSearch />}
									/>
								</Route>
							</Route>
							<Route path="/report" element={<Report />} />
							<Route path="/send-message/:username" element={<MessageSendTarget />} />
							<Route path="/*" element={<NotFound />} />
							<Route path="/super-admin" element={<Admin />} />
							<Route path="/board-create" element={<BoardCreate />} />
						</Routes>
					</div>
				</Router>

				<ToastContainer style={{ fontSize: "1.4rem" }} />
			</div>
		);
	} else {
		return <Spinner />;
	}
}

export default App;
