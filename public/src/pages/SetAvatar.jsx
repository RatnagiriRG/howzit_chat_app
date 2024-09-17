import React, { useEffect, useState } from "react";
import styled from "styled-components";
import loader from "../assets/loader.gif";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toastify CSS
import axios from "axios";
import { setAvatarRoutes } from "../utils/APIRoutes";
import { useNavigate } from "react-router-dom";

export default function SetAvatar() {
  const navigate = useNavigate();

  const api = "https://api.multiavatar.com/45678945";
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);

  const toastOption = {
    position: "bottom-right",
    autoClose: 8000,
    draggable: true,
    theme: "dark",
  };

  // Fetch the user when the component mounts
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("howzit-user"));
        if (!user || !user._id) {
          navigate("/login");
        }
      } catch (error) {
        toast.error(`Error occurred: ${error.message}`, toastOption);
      }
    };
    fetchUser();
  }, [navigate]); // Add 'navigate' as a dependency

  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Please select an avatar", toastOption);
    } else {
      try {
        const user = JSON.parse(localStorage.getItem("howzit-user"));
        if (!user || !user._id) {
          navigate("/login");
          return;
        }

        console.log("Selected Avatar Data:", avatars[selectedAvatar]);

        const { data } = await axios.post(`${setAvatarRoutes}/${user._id}`, {
          image: avatars[selectedAvatar],
        });

        if (data.isSet) {
          user.isAvatarImageSet = true;
          user.avatarImage = data.image;
          localStorage.setItem("howzit-user", JSON.stringify(user));
          navigate("/");
        } else {
          toast.error(
            "Error while setting avatar, please try again.",
            toastOption
          );
        }
      } catch (error) {
        console.error("Error setting avatar:", error);
        toast.error(
          `An error occurred: ${error.message || error}`,
          toastOption
        );
      }
    }
  };

  // Fetch avatars only when the component mounts
  useEffect(() => {
    const fetchAvatars = async () => {
      const data = [];
      for (let i = 0; i < 4; i++) {
        try {
          const response = await axios.get(`${api}/${Math.random() * 1234}`, {
            responseType: "text", // Expecting SVG as text
          });

          console.log("Avatar Response:", response.data);

          // Encode the SVG data to base64
          const base64Data = window.btoa(
            unescape(encodeURIComponent(response.data))
          );
          data.push(`data:image/svg+xml;base64,${base64Data}`);
        } catch (error) {
          console.error("Error fetching avatar:", error);
          toast.error(
            "Failed to fetch avatars, please try again.",
            toastOption
          );
        }

        await new Promise((resolve) => setTimeout(resolve, 1100)); // Delay to avoid hitting rate limits
      }
      setAvatars(data);
      setIsLoading(false);
    };

    fetchAvatars();
  }, []); // Empty dependency array ensures this runs only once

  return (
    <>
      <ToastContainer />
      {isLoading ? (
        <Container>
          <img src={loader} alt="loading" />
        </Container>
      ) : (
        <Container>
          <div className="title-container">
            <h1>Pick an avatar for your profile picture</h1>
          </div>
          <div className="avatars">
            {avatars.map((avatar, index) => (
              <div
                key={index}
                className={`avatar ${
                  selectedAvatar === index ? "selected" : ""
                }`}
                onClick={() => setSelectedAvatar(index)}
              >
                <img src={avatar} alt={`avatar-${index}`} />
              </div>
            ))}
          </div>
          <button className="submit-btn" onClick={setProfilePicture}>
            Set a Profile Picture
          </button>
        </Container>
      )}
    </>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  background-color: #262f40;
  height: 100vh;
  width: 100vw;

  .loader {
    max-inline-size: 100%;
  }
  .title-container {
    h1 {
      color: white;
      font-size: 1rem;
    }
  }

  .avatars {
    display: flex;
    gap: 2rem;
    .avatar {
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 5rem;
      justify-content: center;
      align-items: center;
      transition: 0.5s ease-in-out;
      img {
        height: 6rem;
      }
    }
    .selected {
      border: 0.4rem solid #3a69e4;
    }
  }

  .submit-btn {
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
`;
