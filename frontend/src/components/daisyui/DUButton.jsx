import { getButtonColor } from "../../utils/ButtonUtils.js"

export const DUButton = ({id = 0, color = "neutral", text = "Button", onClick = () => {}, disabled = false}) => {
    return (
        <button
            id={id}
            className={`btn ${getButtonColor(color)}`}
            onClick={onClick}
            disabled={disabled}
        >
            {text}
        </button>
    )
}