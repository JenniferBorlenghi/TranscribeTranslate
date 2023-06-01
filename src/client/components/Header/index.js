import { BsSoundwave } from "react-icons/bs";
import { AiOutlineFontSize } from "react-icons/ai";
import "./styles.scss";

export default function Header() {
  return (
    <header>
      <BsSoundwave className="sound-icon" />
      <AiOutlineFontSize className="font-icon" />
      <div className="app-name"> Transcript & Translate</div>
    </header>
  );
}
