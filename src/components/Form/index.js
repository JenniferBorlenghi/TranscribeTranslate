import { useState } from "react";

export default function Form() {
  const [sourceType, setSourceType] = useState("");
  const [isAudioSource, setIsAudioSource] = useState(false);
  const [isYoutubeSource, setIsYoutubeSource] = useState(false);
  const [source, setSource] = useState("");
  const [resultType, setResultType] = useState("");
  const [resultLanguage, setResultLanguage] = useState("");
  const [email, setEmail] = useState("");
  const [errorMessages, setErrorMessages] = useState([]);

  const handleFormSubmit = (e) => {
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

    if (
      sourceType === "" ||
      source === "" ||
      resultType === "" ||
      resultLanguage === "" ||
      email === ""
    ) {
      arrayOfErrorMessages.push("All fields are required.");
    }

    if (sourceType === "youtube") {
      const youtubeLinkPattern =
        /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
      const isValidLink = youtubeLinkPattern.test(source);

      if (!isValidLink) {
        arrayOfErrorMessages.push("The link provided is not valid");
      }

      setErrorMessages(arrayOfErrorMessages);

      if (arrayOfErrorMessages.length === 0) {
        console.log("ready to work!");
      }
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
          <label>
            Select an audio:
            <input
              type="file"
              accept="audio/*"
              onChange={(e) => setSource(e.target.files[0])}
            />
            {/*SEE WHY ADD REF HERE!!  */}
          </label>
        )}

        {/* Conditional Input Text for YouTube URL source type */}
        {isYoutubeSource && (
          <label>
            YouTube URL
            <input
              type="text"
              placeholder="Enter the YouTube URL"
              value={source}
              onChange={(e) => setSource(e.target.value)}
            />
          </label>
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
              value="subtitles"
              checked={resultType === "subtitles"}
              onChange={(e) => setResultType(e.target.value)}
            />
            Subtitles
          </label>
        </div>

        {/* Result language select input */}
        <label>
          To what language you would like to translate your source?
          <select
            value={resultLanguage}
            onChange={(e) => setResultLanguage(e.target.value)}
          >
            <option value="notranslation">No translation</option>
            <option value="english">English</option>
            <option value="portuguese">Portuguese</option>
            <option value="filipino">Filipino</option>
            <option value="japanese">Japanese</option>
          </select>
        </label>

        {/* User email input */}
        <label>
          Let us know your email so we can let you know when your processing is
          done
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <button>Start Processing</button>
      </form>
    </div>
  );
}
