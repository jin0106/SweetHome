import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

function ReadReceiveMessage() {
	const token = useSelector((state) => state.token.token);
	const [receiveMessageArray, setReceiveMessageArray] = useState([]);

	useEffect(() => {
		axios({
			method: "GET",
			url: `${SERVER_URL}/api/messages/receive`,
			headers: { Authorization: `Bearer ${token}` },
		})
			.then((res) => {
				setReceiveMessageArray(res.data);
				console.log(res.data);
				console.log("저장된 값 확인", receiveMessageArray);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);
	return (
		<div>
			<h1>ReadReciveMessage</h1>
			<ul>
				{receiveMessageArray.map((receiveMessage, idx) => (
					<li key={idx}>{receiveMessage.title}</li>
				))}
			</ul>
		</div>
	);
}

export default ReadReceiveMessage;
