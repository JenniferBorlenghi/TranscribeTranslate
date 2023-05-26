import "./styles.scss";

export default function Result({ output, onChangeStep }) {
  const handleAnotherProcessing = () => {
    onChangeStep("Step 1 - Getting Data");
  };
  return (
    <div className="result-comp">
      <h2>Result</h2>
      <div className="output-place">{output}</div>
      <button onClick={handleAnotherProcessing}>Process Another Source</button>
    </div>
  );
}
