import { useState, useRef } from "react";
import "./styles.scss";
import { extractVideoIdFromLink, processSource } from "./../../apis/api-client";
import ProcessingAPI from "../ProcessingAPI";
import Result from "../Result";

export default function Form() {
  const [sourceType, setSourceType] = useState("");
  const [isAudioSource, setIsAudioSource] = useState(false);
  const [isYoutubeSource, setIsYoutubeSource] = useState(false);
  const [source, setSource] = useState("");
  const [resultType, setResultType] = useState("");
  const [resultLanguage, setResultLanguage] = useState("no translation");
  const [email, setEmail] = useState("");
  const [errorMessages, setErrorMessages] = useState([]);

  const [step, setStep] = useState("Step 1 - Getting Data");
  const [output, setOutput] = useState("");

  const inputFile = useRef();

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    console.log(
      "Source Type: " +
        sourceType +
        "\nSource: " +
        source +
        "\nResult Type: " +
        resultType +
        "\nResult Language: " +
        resultLanguage +
        "\nEmail: " +
        email
    );

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
      arrayOfErrorMessages.push("All fields are required.");
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
      console.log("ready to work!");
      setStep("Step 2 - Processing");

      if (sourceType === "youtube") {
        // extract video id from the url
        const videoId = extractVideoIdFromLink(source);

        const videoTranscription = await processSource(
          videoId,
          resultType,
          resultLanguage,
          email,
          (message) => {
            console.log((prev) => prev + message);
          }
        );
        if (videoTranscription) {
          console.log(videoTranscription);
          setOutput(videoTranscription);
        }

        setStep("Step 3 - Done");
      } else {
        const formData = new FormData();
        formData.append("audio", source);

        const audioTranscription = await processSource(
          formData,
          resultType,
          resultLanguage,
          email,
          (message) => {
            console.log((prev) => prev + message);
          }
        );
        if (audioTranscription) {
          console.log(audioTranscription);
          setOutput(audioTranscription);
        }
        setStep("Step 3 - Done");
      }

      console.log("output", output);

      // clear fields after sending them
      setSourceType("");
      setIsAudioSource("");
      setIsYoutubeSource("");
      setSource("");
      setResultType("");
      setResultLanguage("");
      setEmail("");
      // DEAL WITH THAT LATER ON
      //   inputFile.current.value = "";
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

  const handleStepChange = (step1) => {
    setStep(step1);
  };
  return (
    <div className="form" onSubmit={handleFormSubmit}>
      {/* Conditionally display the error message */}
      {errorMessages.length > 0 && (
        <div>
          Invalid data:
          <ul>
            {errorMessages.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {step === "Step 1 - Getting Data" && (
        <form>
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
                  ref={inputFile}
                />
                {/*SEE WHY ADD REF HERE!!  */}
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

          <button>Start Processing</button>
        </form>
      )}

      {step === "Step 2 - Processing" && <ProcessingAPI />}

      {step === "Step 3 - Done" && (
        <Result output={output} onChangeStep={handleStepChange} />
      )}
    </div>
  );
}
