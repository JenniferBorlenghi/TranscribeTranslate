import "./styles.scss";

export default function Result({ output, onChangeStep }) {
  const handleAnotherProcessing = () => {
    onChangeStep("Input");
  };

  const handleDownloadResult = () => {
    const data = output;
    // convert data into a blob object with MIME type as text/plain
    const blob = new Blob([data], { type: "text/plain" });
    // create a temporary url with the blob obj
    const url = URL.createObjectURL(blob);
    // create a temporary url
    const link = document.createElement("a");
    // define the href link and name of the downloaded file
    link.href = url;
    link.download = "result.txt";
    // trigger the click in the link
    link.click();
    //revoke the temporary link to clean resources
    URL.revokeObjectURL(url);
  };

  return (
    <div className="result-comp">
      <h2>Result</h2>
      <div className="output-place">{output}</div>
      <div className="result-buttons">
        <button onClick={handleAnotherProcessing}>
          Process Another Source
        </button>
        <button
          style={{
            backgroundColor: "#FFC2B5",
            borderColor: "#FFC2B5",
            color: "#0F0F0F",
          }}
          onClick={handleDownloadResult}
        >
          Download Result
        </button>
      </div>
    </div>
  );
}
