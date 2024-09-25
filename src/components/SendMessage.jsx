import React, { useState, useEffect } from "react";
import supabase from "../supabase";
import { Send } from "react-feather";

function SendMessage() {
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        const video = document.getElementById("video");
        video.srcObject = stream;
      })
      .catch((err) => {
        console.error("Error accessing camera:", err);
      });
  }, []);

  const handleCapture = () => {
    const video = document.getElementById("video");
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      setImage(blob);
    }, "image/jpeg");
  };

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: { exact: "environment" } } })
      .then((stream) => {
        const video = document.getElementById("video");
        video.srcObject = stream;
      })
      .catch((err) => {
        console.error("Error accessing camera:", err);
      });
  }, []);
  const uploadImageToSupabase = async (imageBlob) => {
    if (!imageBlob) {
      console.error("Error: No image data to upload!");
      return;
    }

    const fileName = `${Date.now()}.jpg`;

    console.log("Uploading image:", fileName);

    const { data, error } = await supabase.storage
      .from("ReportedImages")
      .upload(fileName, imageBlob, {
        contentType: "image/jpeg",
      });

    if (error) {
      console.error("Supabase Upload Error:", error);
      return null;
    }

    console.log("Upload successful:", data);

    // Construct the correct public URL
    const { data: urlData } = supabase.storage
      .from("ReportedImages")
      .getPublicUrl(fileName); // Use fileName instead of data.path

    if (!urlData || !urlData.publicUrl) {
      console.error("Error getting public URL:", urlData);
      return null;
    }

    console.log("Uploaded file URL:", urlData.publicUrl);
    return urlData.publicUrl;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    let uploadedImageUrl = imageUrl;

    if (image && !imageUrl) {
      try {
        uploadedImageUrl = await uploadImageToSupabase(image);
        setImageUrl(uploadedImageUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }

    const { data, error } = await supabase
      .from("ReportedMessages")
      .insert([{ message, fileURL: uploadedImageUrl }]);

    if (error) {
      console.error("Error inserting message:", error);
    } else {
      console.log("Message inserted:", data);
      setMessage("");
      setImage(null);
      setImageUrl(null);
    }
  };

  return (
    <div>
      <div className="cameraFeed">
        <video id="video" width="240" height="320" autoPlay></video>
        <button type="button" onClick={handleCapture}>
          Capture Photo
        </button>
      </div>
      <div className="anonymousReportingForm">
        <input
          className="anonymousReportingInput"
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your message"
        />
        <button className="anonymousReportingButton" onClick={handleSubmit}>
          <Send />
        </button>
      </div>
    </div>
  );
}

export default SendMessage;
