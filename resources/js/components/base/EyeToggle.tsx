import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

interface EyeToggleProps {
    showPassword: boolean;
    onToggle: () => void;
    className?: string;
}

function EyeToggle({ showPassword, onToggle, className = "" }: EyeToggleProps) {
    return (
        <button
            type="button"
            className={`absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer ${className}`}
            onClick={onToggle}
            aria-label={showPassword ? "Hide password" : "Show password"}
        >
            <FontAwesomeIcon
                icon={showPassword ? faEye : faEyeSlash}
                className="text-gray-500"
            />
        </button>
    );
}

export default EyeToggle;
