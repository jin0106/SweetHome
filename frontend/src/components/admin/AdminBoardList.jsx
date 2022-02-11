import axios from "axios";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

function AdminBoardList() {
	const [boardRequestList, setBoardRequestList] = useState({
		id: "",
		name: "",
		description: "",
	});
	useEffect(() => {
		axios({
			method: "GET",
			url: `${SERVER_URL}/api/admin/boards`,
		})
			.then((res) => {
				console.log(res.data);
				setBoardRequestList(res.data.boards);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);
	return (
		<table>
			<thead>
				<tr>
					<th>신청자</th>
					<th>내용</th>
					<th></th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				{boardRequestList.length > 0 ? (
					boardRequestList.map((boardRequest, idx) => (
						<tr key={idx}>
							<td>{boardRequest.name}</td>
							<td>{boardRequest.description}</td>
							<button> 승인</button>
							<button> 거절</button>
						</tr>
					))
				) : (
					<tr>
						<td colSpan="5">회원이 없습니다</td>
					</tr>
				)}
			</tbody>
		</table>
	);
}

export default AdminBoardList;
