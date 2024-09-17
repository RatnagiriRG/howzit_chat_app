import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import { RiLogoutCircleRLine } from "react-icons/ri";

export default function Logout() {
  const navigate = useNavigate();

  const handleClick = async () => {
    localStorage.clear();
    navigate("/login");
  };
  return (
    <>
      <Button onClick={handleClick}>
        <RiLogoutCircleRLine color="white" />
      </Button>
    </>
  );
}

const Button = styled.button`
  display: flex;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: #262f40;
  border: 0.1rem solid #585858;
  cursor: pointer;
  svg {
    font-size: 1.3rem;
    color: #6f89ba;
  }
`;
