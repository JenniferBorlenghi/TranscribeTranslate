import { useState } from "react";
import Form from "../Form";
import ProcessingAPI from "../ProcessingAPI";
import Result from "../Result";

export default function MainContent() {
  const [step, setStep] = useState("Step 1 - Getting Data");
  const [result, setResult] = useState("");

  const handleStepChange = (step1) => {
    setStep(step1);
  };

  const handleProcessDone = (output) => {
    setResult(output);
  };
  return (
    <div className="main-content">
      {step === "Step 1 - Getting Data" && (
        <Form
          onStepChange={handleStepChange}
          onProcessDone={handleProcessDone}
        />
      )}

      {step === "Step 2 - Processing" && <ProcessingAPI />}

      {step === "Step 3 - Done" && (
        <Result output={result} onChangeStep={handleStepChange} />
      )}
    </div>
  );
}
