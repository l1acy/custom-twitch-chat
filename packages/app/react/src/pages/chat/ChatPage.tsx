import { useParams } from "react-router";
import ChatView from "../../components/chat/view/ChatView";

export default function ChatPage() {
    const {channel} = useParams<{ channel: string}>();

    if (!channel) {
        return (
            <p>Invalid channel</p>
        )
    }

    return (
        <ChatView channel={channel}/>
    )
}