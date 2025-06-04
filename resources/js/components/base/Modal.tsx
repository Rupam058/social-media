import { MouseEvent, useEffect, useRef, CSSProperties } from "react";

function Modal({
    open,
    children,
    onClose,
    className = "",
    fullscreen = false,
}: {
    open: boolean;
    children: React.ReactNode;
    onClose: () => void;
    className?: string;
    fullscreen?: boolean;
}) {
    const modalRef = useRef<HTMLDialogElement | null>(null);

    useEffect(() => {
        const modalElement = modalRef.current;
        if (modalElement != null) {
            if (open) {
                modalElement.showModal();
                document.body.style.overflow = "hidden"; // Prevent background scrolling
            } else {
                modalElement.close();
                document.body.style.overflow = ""; // Restore scrolling
            }
        }

        // Cleanup function
        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);

    function onMouseDown(e: MouseEvent<HTMLDialogElement>) {
        if (e.target == modalRef.current) {
            onClose();
        }
    }

    const fullscreenTW =
        "m-0 fixed md:top-[8vh] md:left-[8vw] top-0 left-0 w-[100vw] h-[100vh] md:w-[84vw] md:h-[84vh] max-w-[100vw] max-h[100vw] md:max-w-[84vw] md:max-h-[84vh] overflow-hidden bg-white";
    const defaultTW =
        "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-0 rounded-md overflow-hidden bg-white";

    // const modalStyle = fullscreen ? fullscreenStyle : defaultStyle;

    return (
        <dialog ref={modalRef} onMouseDown={onMouseDown}>
            <div
                className={`${fullscreen ? fullscreenTW : defaultTW} overflow-auto p-4 md:p-6 rounded-md border ${className}`}
            >
                {children}
            </div>
        </dialog>
    );
}

export default Modal;
