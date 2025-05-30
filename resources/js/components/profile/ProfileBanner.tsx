import { useState } from "react";
import FileInput from "../base/FileInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { APP_BASE_URL, DEFAULT_BANNER } from "../../bootstarp";

function ProfileBanner({
    banner,
    self,
    onChange,
}: {
    banner: string | null;
    self: boolean;
    onChange: (f: File) => void;
}) {
    const [filePickerOpen, setFilePickerOpen] = useState(false);

    function openFilePicker() {
        setFilePickerOpen(true);
    }

    function onChangeBanner(f: File | null) {
        if (f != null) onChange(f);

        setFilePickerOpen(false);
    }

    return (
        <div className="container">
            {filePickerOpen ? <FileInput onChange={onChangeBanner} /> : null}
            {self ? (
                <button onClick={openFilePicker} className="container-child cursor-pointer">
                    <div className="mt-8 right-8 absolute bottom-8">
                        <FontAwesomeIcon icon={faPen} />
                    </div>
                </button>
            ) : null}

            <img
                src={
                    banner
                        ? `${APP_BASE_URL}/storage/banners/${banner}`
                        : DEFAULT_BANNER
                }
                className="h-52 object-cover w-full rounded-t-md"
                alt="Profile Banner"
            />
        </div>
    );
}

export default ProfileBanner;
