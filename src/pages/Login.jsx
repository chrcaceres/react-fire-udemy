import { useEffect, useState } from "react";
import { login } from "../config/firebase";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { Formik } from "formik";
import * as Yup from "yup";
import { Avatar, Box, Button, TextField, Typography } from "@mui/material";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { LoadingButton } from "@mui/lab";

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
        <Box
            sx={{
                mt: 8,
                maxWidth: "400px",
                mx: "auto",
                textAlign: "center",
            }}
        >
            <Avatar sx={{ mx: "auto", bgcolor: "#111" }}>
                <AddAPhotoIcon></AddAPhotoIcon>
            </Avatar>

            <Typography variant="h5" component="h1">
                Login
            </Typography>

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
                    <Box
                        sx={{ mt: 1 }}
                        component="form"
                        onSubmit={handleSubmit}
                    >
                        <TextField
                            type="text"
                            placeholder="email@example.com"
                            value={values.email}
                            onChange={handleChange}
                            name="email"
                            onBlur={handleBlur}
                            id="email"
                            label="Ingrese email"
                            fullWidth
                            sx={{ mb: 3 }}
                            error={errors.email && touched.email}
                            helperText={
                                errors.email && touched.email && errors.email
                            }
                        ></TextField>

                        <TextField
                            type="password"
                            placeholder="123123"
                            value={values.password}
                            onChange={handleChange}
                            name="password"
                            onBlur={handleBlur}
                            id="password"
                            label="Ingrese contraseña"
                            fullWidth
                            sx={{ mb: 3 }}
                            error={errors.password && touched.password}
                            helperText={
                                errors.password &&
                                touched.password &&
                                errors.password
                            }
                        ></TextField>

                        <LoadingButton
                            type="submit"
                            disabled={isSubmitting}
                            loading={isSubmitting}
                            variant="contained"
                            fullWidth
                            sx={{ mb: 3 }}
                        >
                            Login
                        </LoadingButton>

                        <Button fullWidth component={Link} to="/register">
                            ¿No tienes cuenta? Regístrate
                        </Button>
                    </Box>
                )}
            </Formik>
        </Box>
    );
};

export default Login;
