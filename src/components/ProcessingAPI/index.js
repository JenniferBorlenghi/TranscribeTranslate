import { ClipLoader } from "react-spinners";
import "./styles.scss";

export default function ProcessingSpinner() {
  return (
    <div className="processing-ai">
      <p>Processing...</p>
      <div className="spinner-loading">
        <ClipLoader color="#6a4d54" size={120} aria-label="Loading Spinner" />
      </div>
    </div>
  );
}
