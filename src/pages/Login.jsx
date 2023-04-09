import { useEffect, useState } from "react";
import { login } from "../config/firebase";
import { Navigate, useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const Navigate = useNavigate();
    const { user } = useUserContext();

    useEffect(() => {
        if (user) {
            Navigate("/dashboard");
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("submit");
        try {
            const credentialUser = await login({
                email: email,
                password: password,
            });
            console.log(credentialUser);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Ingrese email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                ></input>
                <input
                    type="password"
                    placeholder="Ingrese contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                ></input>
                <button type="submit">Login</button>
            </form>
        </>
    );
};

export default Login;
