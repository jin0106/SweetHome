import MessageBox from "components/messages/MessageBox";
import { useLocation } from "react-router-dom";

function MessagePage() {
	const location = useLocation();
	const from = location.state.to;
	return (
		<div style={{ width: "100%" }}>
			{from === "inbox" && <MessageBox action="receive" />}
			{from !== "inbox" && <MessageBox action="send" />}
		</div>
	);
}

export default MessagePage;
