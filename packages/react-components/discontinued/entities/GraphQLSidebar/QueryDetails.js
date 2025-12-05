import React, { useState } from "react";
import {Button} from "../../components";

export default function QueryDetails({ children }) {

    // React state to manage visibility
    const [show, setShow] = useState();

    // function to toggle the boolean value
    function toggleShow() {
        setShow(!show);
    }
    const buttonText = show ? "Hide Query" : "Show Query";

    return <>
        <Button appearance="primaryOutline" onClick={toggleShow}>{buttonText}</Button>
        <div className="component-container">
            {show && children}
        </div>
    </>
}