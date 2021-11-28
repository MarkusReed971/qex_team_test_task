import React, {useRef, useEffect, useState} from "react";
import styles from "./ChatPage.module.css";
import { useLocation, useNavigate } from 'react-router-dom';
import {ReactComponent as Logo} from '../../images/Vector.svg';
import { Message } from "../Message/Message";
import TextareaAutosize from 'react-textarea-autosize';
import ReactTooltip from 'react-tooltip';

export const ChatPage = () => {
    const navigate = useNavigate();
    const ws = useRef();

    const scrollTarget = useRef(null);

    const { user } = useLocation().state;

    const [isConnectionOpened, setConnectionOpened] = useState(false);
    const [messageText, setMessageText] = useState('');

    const [messages, setMessages] = useState([]);


    useEffect(() => {
		ws.current = new WebSocket('wss://ws.qexsystems.ru');

		ws.current.onopen = () => {
            const cacheMessages = localStorage["messages"];
            if (cacheMessages) {
                const messageList = JSON.parse(cacheMessages);
                setMessages(messageList);
            }

            console.log('Connection opened!');
			setConnectionOpened(true);
		};
		ws.current.onmessage = (ev) => {
			const message = JSON.parse(ev.data);
			setMessages(_messages => [..._messages, message]);
		};
		ws.current.onclose = (ev) => {
            console.log('Connection closed!');
			navigate("/auth")
		};

		return () => {
			ws.current.close();
		};
	}, [navigate]);

    useEffect(() => {
		if (scrollTarget.current) {
			scrollTarget.current.scrollIntoView({ behavior: 'smooth' });
		}
        if (messages.length > 0) {
            localStorage["messages"] = JSON.stringify(messages);
        }
	}, [messages]);

    const isSendDisabled = () => (messageText === "" || !isConnectionOpened);

    const sendMessageHandler = () => {
        const message = {
            user,
            body: {
                text: messageText,
                date: Date.now()
            }
        }
		ws.current.send(JSON.stringify(message));
        setMessages(_messages => [..._messages, message]);
		setMessageText('');
	};

    const messageTextInputHandler = (e) => {
        setMessageText(e.target.value);
    }

    return(
        <main className={styles.chatPage}>
            <div className={styles.chatPage__header}>
                <img 
                    className={styles.chatPage__avatar}
                    src={user.avatarUrl} 
                    alt={'user avatar'} 
                />
                <h1 className={styles.chatPage__username}>{`${user.firstName} ${user.secondName}`}</h1>
            </div>

            <div className={styles.chatPage__messagesWrapper}>
                {messages.map(mes => <Message 
                    key={mes.body.date} 
                    message={mes} 
                    userId={user.userId}
                />)}
                <div ref={scrollTarget} />
            </div>
            <div className={styles.chatPage__inputWrapper}>
                <TextareaAutosize
                    data-tip={"Press Ctrl + Enter for line break<br/>Press Enter to send the message"}
                    data-multiline={true}
                    maxRows={3}
                    className={styles.chatPage__messageTextInput} 
                    type={"text"}
                    name={"messageText"}
                    value={messageText}
                    onChange={messageTextInputHandler}
                    onKeyDown={(e) => {
                        if (e.ctrlKey && e.key === 'Enter') {
                            setMessageText(prev => prev + "\n");
                        } else if (e.key === 'Enter') {
                            e.preventDefault();
                            sendMessageHandler();
                        }
                        
                    }}
                    placeholder={"Enter text message..."}
                />
                <button 
                    className={styles.chatPage__sendMessageInput} 
                    onClick={sendMessageHandler}
                    disabled={isSendDisabled()}
                >
                    <Logo className={isSendDisabled() 
                        ? styles.chatPage__sendMessageImage_disabled 
                        : styles.chatPage__sendMessageImage}
                    />
                </button>
            </div>
            <ReactTooltip />
        </main>
    )
}