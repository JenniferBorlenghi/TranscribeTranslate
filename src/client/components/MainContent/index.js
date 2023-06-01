import { useState } from "react";
import Form from "../Form";
import ProcessingAPI from "../ProcessingAPI";
import Result from "../Result";

export default function MainContent() {
  const [step, setStep] = useState("Input");
  const [result, setResult] = useState("");

  const handleStepChange = (step1) => {
    setStep(step1);
  };

  const handleProcessDone = (output) => {
    setResult(output);
    console.log("the output", output);
  };
  return (
    <div className="main-content">
      {step === "Input" && (
        <Form
          onStepChange={handleStepChange}
          onProcessDone={handleProcessDone}
        />
      )}

      {step === "Processing" && <ProcessingAPI />}

      {step === "Output" && (
        <Result output={result} onChangeStep={handleStepChange} />
      )}
    </div>
  );
}
