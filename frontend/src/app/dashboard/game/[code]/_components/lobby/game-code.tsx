"use client";

import { useParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react"
import { useEffect, useState } from "react";

export const GameCodes = () => {
    const [url, setUrl] = useState("");
    const params = useParams();
    const code = params.code;
    const formattedCode = code?.slice(0, 3) + " " + code?.slice(3, 6);

    useEffect(() => {
        if (code) {
            setUrl(window.location.origin + "/" + code);
        }

    }, [code]);

    return (
        <div className="flex justify-center md:justify-start md:pl-8 px-2 gap-2">
            <div className="bg-white p-2 -translate-y-4 aspect-square h-full flex items-center justify-center rounded-lg">
                <QRCodeSVG className="w-full h-full" value={url} />
            </div>

            <h1 data-test="game-id" className="text-5xl sm:text-6xl text-nowrap rotate-6 -translate-y-2 h-fit rounded-xl font-extrabold bg-primary text-white p-5">
                {formattedCode}
            </h1>
        </div>
    )
}