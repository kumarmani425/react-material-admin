import React, { useState } from "react";
import { TextField, Typography } from "@mui/material";
import { withRouter } from "react-router-dom";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import useStyles from "./styles";
import { Button } from "../../components/Wrappers";

function CreateUser() {
    const classes = useStyles();
    const { register, handleSubmit, formState: { errors }, control, reset } = useForm();
    const [successMsg, setSuccessMsg] = useState(false);

    const signUpUser = (data) => {
        fetch("http://localhost:8888/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: data.email,
                password: data.password,
                name: data.name,
                userId: data.userId,
                surname:'sdsd'
            }),
        }).then((res) => {
            console.log("Response:", res.status);
            if (res.status === 201) {
                setSuccessMsg(true);
                reset();
            }
        });
    };

    return (
        <div className={classes.form}>
            {successMsg && <Typography variant="h7" className={classes.successMsg}>User Created Successfully</Typography>}
            <Typography variant="h1" className={classes.greeting}>Create Your Account</Typography>
            <form onSubmit={handleSubmit(signUpUser)}>
                <TextField
                    id="name"
                    className={classes.Input}
                    {...register("name", { required: "Name is required" })}
                    margin="normal"
                    placeholder="Full Name"
                    type="text"
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name?.message}
                />
                <TextField
                    id="userId"
                    className={classes.Input}
                    {...register("userId", { required: "User ID is required" })}
                    margin="normal"
                    placeholder="User ID"
                    type="text"
                    fullWidth
                    error={!!errors.userId}
                    helperText={errors.userId?.message}
                />
                <TextField
                    id="email"
                    className={classes.Input}
                    {...register("email", { required: "Email is required" })}
                    margin="normal"
                    placeholder="Email Address"
                    type="email"
                    fullWidth
                    error={!!errors.email}
                    helperText={errors.email?.message}
                />
                <TextField
                    id="password"
                    className={classes.Input}
                    {...register("password", { required: "Password is required" })}
                    margin="normal"
                    placeholder="Password"
                    type="password"
                    fullWidth
                    error={!!errors.password}
                    helperText={errors.password?.message}
                />
                <Button type="submit" size="large" variant="contained" color="primary" fullWidth>
                    Create Account
                </Button>
            </form>
            <DevTool control={control} />
        </div>
    );
}

export default CreateUser;
