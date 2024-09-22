import type {MetaFunction} from "@remix-run/node";
import {Header} from "~/components/header";

export const meta: MetaFunction = () => {
    return [
        {title: "SermonIndex"},
        {name: "description...", content: "This is a PoC..."},
    ];
};

export default function Index() {
    return (
        <div className="pt-[0rem]">
            <Header />
        </div>
    );
}
