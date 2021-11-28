import React from "react";
import styles from "./Message.module.css";

export const Message = ({message, userId}) => {

    const formatAMPM = (date) => {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? '0'+minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }

    const messsageClassList = () => {
        let classList = styles.message;
        if (message.user.userId === userId) {
            classList += ` ${styles.message_self}`;
        }
        return classList;
    }

    return (
        <div className={messsageClassList()}>
            <img
                className={styles.message__avatar}
                src={message.user.avatarUrl} alt="sender avatar" 
            />
            <div className={styles.message__wrapper}>
                <h2 className={styles.message__sender}>
                    {`${message.user.firstName} ${message.user.secondName}`}
                </h2>
                <p className={styles.message__text}>{message.body.text}</p>
                <div className={styles.message__date}>
                    {formatAMPM(new Date(message.body.date))}
                </div>
            </div>
        </div>
    )
}