import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import BoardList from "../components/BoardList";
import CreateBoard from "../components/CreateBoard";
import Board from "../components/Board";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { SET_USER } from "../store/user";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

function Main() {
	const dispatch = useDispatch();
	const token = useSelector((state) => state.token.accessToken);
	const [userInfo, setUserInfo] = useState(null);
	const [boards, setBoards] = useState([]);
	const [currentBoard, setCurrentBoard] = useState("");

	useEffect(() => {
		axios({
			url: `${SERVER_URL}/api/members/my-profile`,
			method: "get",
			headers: { Authorization: `Bearer ${token}` },
		}).then((res) => {
			setUserInfo(res.data);
			dispatch(SET_USER(res.data));
		});
	}, []);

	useEffect(() => {
		axios({
			url: `${SERVER_URL}/api/boards`,
			headers: { Authorization: `Bearer ${token}` },
			method: "get",
		})
			.then((res) => {
				setBoards(res.data);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	return (
		userInfo && (
			<div>
				<div>nav-bar</div>
				<Navbar />
				<CreateBoard />
				<BoardList boards={boards} setCurrentBoard={setCurrentBoard} />
				<Board currentBoard={currentBoard} />
				<p>{userInfo.username}</p>
				<Link to={`/profile/${userInfo.username}`} state={{ user: userInfo }}>
					Profile
				</Link>
				<Link to="/message-box/">MessageBox</Link>
			</div>
		)
	);
}

export default Main;
