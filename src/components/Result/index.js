export default function Result({ output, onChangeStep }) {
  const handleAnotherProcessing = () => {
    onChangeStep("Step 1 - Getting Data");
  };
  return (
    <div>
      <p>{output}</p>
      <button onClick={handleAnotherProcessing}>Process Another Source</button>
    </div>
  );
}
