import { useParams } from "react-router";

function ChatPage() {
    const { channelName } = useParams();

    return (
        <p>{channelName}</p>
    )
}

export default ChatPage
