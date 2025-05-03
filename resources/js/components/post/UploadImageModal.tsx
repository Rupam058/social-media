import { useRef } from "react";
import Modal from "../base/Modal";

function UploadImageModal({
    open,
    onClose,
}: {
    open: boolean;
    onClose: (file: File | null) => void;
}) {
    const fileInput = useRef<HTMLInputElement>(null);

    function openFilePicker() {
        fileInput.current?.click();
    }

    function onFileChange() {
        const files = fileInput.current?.files;
        if (files == null || files.length < 1) return;

        onClose(files[0]);
    }

    return (
        <Modal open={open} onClose={() => onClose(null)}>
            <h2 className="text-2xl font-bold">Upload File</h2>
            <div className="flex justify-center items-center">
                <input
                    ref={fileInput}
                    type="file"
                    className="hidden"
                    onChange={onFileChange}
                />
                <button
                    onClick={openFilePicker}
                    className="border rounded-xl p-4 flex justify-center items-center w-52 h-52 text-3xl mt-4"
                >
                    +
                </button>
            </div>
        </Modal>
    );
}
export default UploadImageModal;
