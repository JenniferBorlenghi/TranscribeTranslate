import { useState } from "react";
import {
  extractVideoIdFromLink,
  processSource,
  sendEmail,
} from "./../../api-client";
import "./styles.scss";

export default function Form({ onStepChange, onProcessDone }) {
  const [sourceType, setSourceType] = useState("");
  const [isAudioSource, setIsAudioSource] = useState(false);
  const [isYoutubeSource, setIsYoutubeSource] = useState(false);
  const [source, setSource] = useState("");
  const [resultType, setResultType] = useState("");
  const [resultLanguage, setResultLanguage] = useState("no translation");
  const [email, setEmail] = useState("");
  const [errorMessages, setErrorMessages] = useState([]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const arrayOfErrorMessages = [];

    // verifying if the fields are all filled out
    if (
      sourceType === "" ||
      source === "" ||
      resultType === "" ||
      resultLanguage === ""
      // ||
      // email === ""
    ) {
      arrayOfErrorMessages.push("All fields, except the email, are required.");
    }

    // verifying if the youtube link provided is valid
    if (sourceType === "youtube") {
      const youtubeLinkPattern =
        /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
      const isValidLink = youtubeLinkPattern.test(source);

      if (!isValidLink) {
        arrayOfErrorMessages.push("The link provided is not valid");
      }
    }

    setErrorMessages(arrayOfErrorMessages);

    if (arrayOfErrorMessages.length === 0) {
      onStepChange("Processing");

      if (sourceType === "youtube") {
        // extract video id from the url
        const videoId = extractVideoIdFromLink(source);

        const videoTranscription = await processSource(
          videoId,
          resultType,
          resultLanguage,
          email
        );

        if (videoTranscription) {
          onProcessDone(videoTranscription);
          onStepChange("Output");
          if (email !== "") {
            sendEmail(email, videoTranscription);
          }
        }
      } else {
        const formData = new FormData();
        formData.append("audio", source);

        const audioTranscription = await processSource(
          formData,
          resultType,
          resultLanguage,
          email
        );

        if (audioTranscription) {
          onProcessDone(audioTranscription);
          onStepChange("Output");
          if (email !== "") {
            sendEmail(email, audioTranscription);
          }
        }
      }

      // clear fields after sending them
      setSourceType("");
      setIsAudioSource("");
      setIsYoutubeSource("");
      setSource("");
      setResultType("");
      setResultLanguage("");
      setEmail("");
    }
  };

  const handleSourceTypeChange = (e) => {
    const sourceFormat = e.target.value;
    setSourceType(sourceFormat);

    if (sourceFormat === "audio") {
      setIsAudioSource(true);
      setIsYoutubeSource(false);
    } else if (sourceFormat === "youtube") {
      setIsAudioSource(false);
      setIsYoutubeSource(true);
    }
  };

  return (
    <div className="form-comp">
      <h2>Audio and YouTube Video Transcription & Translation</h2>
      {/* Error Messages for when the user fill the input incorrectly */}
      {errorMessages.length > 0 && (
        <div className="form-validate">
          Invalid data:
          <ul>
            {errorMessages.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      <form onSubmit={handleFormSubmit}>
        {/* Source Type Radio Input */}
        <div className="source-type">
          Define your source:
          <label>
            <input
              type="radio"
              value="audio"
              checked={sourceType === "audio"}
              onChange={handleSourceTypeChange}
            />
            Audio
          </label>
          <label>
            <input
              type="radio"
              value="youtube"
              checked={sourceType === "youtube"}
              onChange={handleSourceTypeChange}
            />
            Youtube URL
          </label>
        </div>

        {/* Conditional Input File for audio source type */}
        {isAudioSource && (
          <div>
            <label>
              Select an audio:
              <input
                type="file"
                accept="audio/*"
                onChange={(e) => setSource(e.target.files[0])}
                id="audio-file"
              />
            </label>
          </div>
        )}

        {/* Conditional Input Text for YouTube URL source type */}
        {isYoutubeSource && (
          <div>
            <label>
              YouTube URL
              <input
                type="text"
                placeholder="Enter the YouTube URL"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                id="youtube-url"
              />
            </label>
          </div>
        )}

        {/* Result type input radio */}
        <div className="result-type">
          To what format would you like to do receive your source?
          <label>
            <input
              type="radio"
              value="text"
              checked={resultType === "text"}
              onChange={(e) => setResultType(e.target.value)}
            />
            Text
          </label>
          <label>
            <input
              type="radio"
              value="srt"
              checked={resultType === "srt"}
              onChange={(e) => setResultType(e.target.value)}
            />
            Subtitles
          </label>
        </div>

        {/* Result language select input */}
        <div>
          <label>
            To what language you would like to translate your source?
            <select
              value={resultLanguage}
              onChange={(e) => setResultLanguage(e.target.value)}
            >
              <option value="no translation">No translation</option>
              <option value="english">English</option>
              <option value="portuguese">Portuguese</option>
              <option value="filipino">Filipino</option>
              <option value="japanese">Japanese</option>
              <option value="spanish">Spanish</option>
            </select>
          </label>
        </div>

        {/* User email input */}
        <div>
          <label>
            Let us know your email so we can let you know when your processing
            is done
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
        </div>

        <button id="submit-form">Start Processing</button>
      </form>
    </div>
  );
}
