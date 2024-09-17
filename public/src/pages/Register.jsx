import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Logo from "../assets/Logo.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toastify CSS
import axios from "axios";
import { registerRoute } from "../utils/APIRoutes";
const Register = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      console.log("in validation ", registerRoute);
      const { username, email, password } = values;
      const { data } = await axios.post(registerRoute, {
        username,
        email,
        password,
      });

      if (data.status === false) {
        toast.error(data.message, toastOption);
      }
      if (data.status === true) {
        localStorage.setItem("howzit-user", JSON.stringify(data.user));
        navigate("/");
      }
    }
  };

  const toastOption = {
    position: "bottom-right",
    autoClose: 8000,
    draggable: true,
    theme: "dark",
  };

  const handleValidation = () => {
    const { username, email, password, confirmPassword } = values;
    if (password !== confirmPassword) {
      toast.error(
        "Password and Confirm Password should be the same!",
        toastOption
      );
      return false;
    } else if (username.length < 3) {
      toast.error("username should be greater than 3 character", toastOption);
      return false;
    } else if (password.length < 8) {
      toast.error(
        "password should be equal and greater than 8 characters",
        toastOption
      );
      return false;
    } else if (email === "") {
      toast.error("email required", toastOption);
      return false;
    }
    return true;
  };

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  return (
    <>
      <ToastContainer />
      <FormContainer>
        <form onSubmit={(event) => handleSubmit(event)}>
          <div className="brand">
            <img src={Logo} alt="Logo" />
            <h1>Howzit</h1>
          </div>
          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            onChange={(e) => handleChange(e)}
          />
          <button type="submit">Create User</button>
          <span>
            Already have an account? <Link to="/login">Login</Link>
          </span>
        </form>
      </FormContainer>
    </>
  );
};

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #262f40;

  .brand {
    display: flex;
    align-items: center;
    img {
      height: 8rem;
    }
    h1 {
      color: white;
      text-transform: uppercase;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    padding: 3rem 5rem;
    border-radius: 2rem;

    input {
      background-color: transparent;
      padding: 1rem;
      border: 0.1rem solid #253c78;
      border-radius: 0.4rem;
      color: white;
      width: 100%; /* Fixed width issue */
      font-size: 1rem;

      &:focus {
        border: 0.1rem solid #3a69e4;
        outline: none;
      }
    }

    button {
      color: white;
      background-color: #ffffff34;
      padding: 1rem 2rem;
      border: none;
      font-weight: bold;
      cursor: pointer;
      border-radius: 0.4rem;
      font-size: 1rem;
      text-transform: uppercase;
      transition: 0.5s ease-in-out;

      &:hover {
        background-color: #3a69e4;
      }
    }

    span {
      color: white;
      text-transform: uppercase;

      a {
        color: #3a69e4;
        text-decoration: none;
        font-weight: bold;
      }
    }
  }
`;

export default Register;
