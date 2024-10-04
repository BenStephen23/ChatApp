import { useRef, useEffect } from "react";
import useGetMessages from "../../hooks/useGetMessages";
import Message from "./Message";
import MessageSkeletons from "../skeletons/MessageSkeletons";
import useListenMessages from "../../hooks/useListenMessages";
const Messages = () => {
    const {loading, messages} = useGetMessages();
    useListenMessages();
    // to bring new message right into view
    const lastMessageRef = useRef();

    useEffect(() => {
        setTimeout(() => {
            lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    }, [messages]);
    

    return (

        <div className="px-4 flex-1 overflow-auto">
            {!loading &&
             messages.length > 0 && 
             messages.map((message) => (
                <div key={message._id} ref={lastMessageRef}> <Message message={message} />
                </div>
             ))}
             {/* statement to declare loading state */}
            {loading && [...Array(3)].map((_, idx) => <MessageSkeletons key={idx}/>)}
            {!loading && messages.length === 0 && (
                <p className="text-center">Send a message to start the conversation</p>
            )}
        </div>
    )
}

export default Messages;