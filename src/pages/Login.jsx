import React from "react";
import LoginForm from "../components/Login";  // 👈 import form component directly

function Login() {
    return (
        <div className="py-8">
            <LoginForm />
        </div>
    );
}

export default Login;
