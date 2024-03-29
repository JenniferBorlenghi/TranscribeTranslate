import { ClipLoader } from "react-spinners";
import "./styles.scss";

export default function ProcessingSpinner() {
  return (
    <div className="processing-ai" id="test-process">
      <p>Processing...</p>
      <div className="spinner-loading">
        <ClipLoader color="#6a4d54" size={120} aria-label="Loading Spinner" />
      </div>
      <p>
        Once it's ready, if you provide your email address, you will receive it
        in your email inbox.
      </p>
    </div>
  );
}
