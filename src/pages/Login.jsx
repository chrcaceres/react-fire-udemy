import { useEffect, useState } from "react";
import { login } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { Formik } from "formik";
import * as Yup from "yup";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();
    const { user } = useUserContext();

    useEffect(() => {
        if (user) {
            navigate("/dashboard");
        }
    }, [user]);

    //Ya no es necesario ya que todo estaré en el onSubmit que es manejado por el componente de Formik
    /*     const handleSubmit = async (e) => {
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
    }; */

    const onSubmit = async (
        values,
        { setSubmitting, setErrors, resetForm } //Desestructuración campos consulta Firebase. Setsubmiting es true mientras consulta autenticación, el finally lo resetea a false
    ) => {
        const { email, password } = values;
        try {
            const credentialUser = await login({
                email: email,
                password: password,
            });
            console.log(credentialUser);
            resetForm();
        } catch (error) {
            console.log(error);
            if (error.code === "auth/user-not-found") {
                //auth/user-not-found es el error.code enviado por Firebase
                return setErrors({ email: "Usuario no registrado" });
            }
            if (error.code === "auth/wrong-password") {
                //auth/wrong-password es el error.code enviado por Firebase
                return setErrors({ password: "Password incorrecto" });
            }
        } finally {
            setSubmitting(false);
        }
    };

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email("Email no válido")
            .required("Email requerido"),
        password: Yup.string()
            .trim()
            .min(6, "Mínimo 6 carácteres")
            .required("Password requerido"),
    });

    return (
        <>
            <h1>Login</h1>
            <Formik
                initialValues={{ email: "", password: "" }}
                onSubmit={onSubmit}
                validationSchema={validationSchema}
            >
                {({
                    values,
                    handleSubmit,
                    handleChange,
                    errors,
                    touched,
                    handleBlur,
                    isSubmitting,
                }) => (
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Ingrese email"
                            value={values.email}
                            onChange={handleChange}
                            name="email"
                            onBlur={handleBlur}
                        ></input>
                        {errors.email && touched.email && errors.email}
                        <input
                            type="password"
                            placeholder="Ingrese contraseña"
                            value={values.password}
                            onChange={handleChange}
                            name="password"
                            onBlur={handleBlur}
                        ></input>
                        {errors.password && touched.password && errors.password}
                        <button type="submit" disabled={isSubmitting}>
                            Login
                        </button>
                    </form>
                )}
            </Formik>
        </>
    );
};

export default Login;
