import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import styles from "./AuthPage.module.css"

export const AuthPage = () => {
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState("");
    const [secondName, setSecondName] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");
    const [userId, setUserId] = useState(null);

    const [isFilled, setIsFilled] = useState(false);

    useEffect(() => {
        const cacheUser = localStorage["user"];
        if (cacheUser) {
            const user = JSON.parse(cacheUser);
            setFirstName(user.firstName);
            setSecondName(user.secondName);
            setAvatarUrl(user.avatarUrl);
            setUserId(user.userId);
        }
    }, [])

    useEffect(() => {
        setIsFilled(firstName !== "" && secondName !== "");
    }, [firstName, secondName])

    const firstNameChangeHandler = (e) => {
        setFirstName(e.target.value);
    }

    const secondNameChangeHandler = (e) => {
        setSecondName(e.target.value);
    }

    const avatarUrlChangeHandler = (e) => {
        setAvatarUrl(e.target.value);
    }

    const submitHandler = (e) => {
        e.preventDefault();

        if (!userId) {
            setUserId(new Date().valueOf());
        }
        const user = {
            firstName,
            secondName,
            userId,
            avatarUrl
        }

        localStorage["user"] = JSON.stringify(user);

        navigate(`/chat/`, {
            state: {
                user
            }
        });
    }

    return(
        <main className={styles.authPage}>
            <form className={styles.authForm}>
                <h1 className={styles.authForm__header}>Join to chat!</h1>
                <input 
                    className={styles.authForm__textInput}
                    type={"text"} 
                    name={"firstName"}
                    value={firstName}
                    onChange={firstNameChangeHandler}
                    placeholder={"Your first name"}
                />
                <input 
                    className={styles.authForm__textInput}
                    type={"text"} 
                    name={"secondName"}
                    value={secondName}
                    onChange={secondNameChangeHandler}
                    placeholder={"Your second name"}
                />
                <input 
                    className={styles.authForm__textInput}
                    type={"text"} 
                    name={"avatarUrl"}
                    value={avatarUrl}
                    onChange={avatarUrlChangeHandler}
                    placeholder={"Your avatar url"}
                />
                <input
                    className={styles.authForm__button}
                    type={"submit"}
                    value={"Join"}
                    disabled={!isFilled}
                    onClick={submitHandler}
                />
            </form>
        </main>
    )
}