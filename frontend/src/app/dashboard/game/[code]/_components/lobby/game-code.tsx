"use client";

import { QRCodeSVG } from "qrcode.react"

export const GameCodes = () => {
    

    return (
        <div className="flex justify-center md:justify-start md:pl-8 px-2 gap-2">
            <div className="bg-white p-2 -translate-y-4 aspect-square h-full flex items-center justify-center rounded-lg">
                <QRCodeSVG className="w-full h-full" value={"https://example.com"} />
            </div>

            <h1 className="text-5xl sm:text-6xl text-nowrap rotate-6 -translate-y-2 h-fit rounded-xl font-extrabold bg-primary text-white p-5">
                195 010
            </h1>
        </div>
    )
}