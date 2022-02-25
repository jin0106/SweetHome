import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AgreementsPagination from "./AgreementsPagination";
import { authorityCheck } from "utils/authority";
import style from "style/Admin.module.css";
import { useSelector } from "react-redux";
import AgreementCreate from "./AgreementCreate";

function Agreements({ newAgreement }) {
	const SERVER_URL = process.env.REACT_APP_SERVER_URL;
	const [data, setData] = useState({ agreements: [], totalPage: 0, currentPage: 0 });
	const { agreements, totalPage, currentPage } = data;
	const authority = useSelector((state) => state.userInfo.authority);
	const today = new Date();

	const agreementProgress = (start_date, end_date) => {
		if (new Date(start_date) > today) {
			return "진행 예정";
		} else if (today > new Date(end_date)) {
			return "만료";
		} else {
			return "진행중";
		}
	};

	const getAgreementsPage1 = () => {
		axios({
			url: `${SERVER_URL}/api/agreements`,
			method: "get",
		}).then((res) => {
			setData((prev) => ({
				...prev,
				agreements: res.data.agreements,
				totalPage: res.data.total_page_count,
				currentPage: res.data.current_page_count,
			}));
		});
	};

	if (newAgreement) getAgreementsPage1();

	useEffect(() => {
		axios({
			url: `${SERVER_URL}/api/agreements?page=${currentPage}&size=10`,
			method: "get",
		}).then((res) => {
			setData((prev) => ({
				...prev,
				agreements: res.data.agreements,
				totalPage: res.data.total_page_count,
				currentPage: res.data.current_page_count,
			}));
		});
	}, [currentPage]);

	return (
		<div>
			<div className={style.agreement_headers}>
				<h1 className={style.agreements_title}>동의서 게시판</h1>
			</div>

			<table>
				<thead>
					<tr>
						<th>제목</th>
						<th>기간</th>
						<th>진행여부</th>
						{authorityCheck(authority) > 2 && <th>동의 목록 보기</th>}
					</tr>
				</thead>

				<tbody>
					{agreements.length > 0 ? (
						agreements.map((agreement, idx) => (
							<tr key={idx}>
								<td>
									<Link
										to={`/agreement/${agreement.agreement_id}`}
										state={{
											id: agreement.agreement_id,
											progress: agreementProgress(agreement.start_date, agreement.end_date),
										}}
									>
										{agreement.title}{" "}
									</Link>
								</td>
								<td>
									{agreement.start_date.slice(0, 10)} ~ {agreement.end_date.slice(0, 10)}
								</td>
								<td>{agreementProgress(agreement.start_date, agreement.end_date)}</td>
								{authorityCheck(authority) > 2 && (
									<td>
										<Link
											to={`/agreement-manage/list-search`}
											state={{ agreementId: agreement.agreement_id }}
										>
											동의 목록 보기
										</Link>
									</td>
								)}
							</tr>
						))
					) : (
						<tr>
							<td colSpan={5}>작성된 동의서가 없습니다</td>
						</tr>
					)}
				</tbody>
			</table>
			<div style={{ display: "none" }}>
				<AgreementCreate getAgreementsPage1={getAgreementsPage1} />
			</div>
			{agreements.length > 0 && (
				<footer>
					<AgreementsPagination page={currentPage} total={totalPage} setData={setData} />
				</footer>
			)}
		</div>
	);
}

export default Agreements;
