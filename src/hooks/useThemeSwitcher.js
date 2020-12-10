import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";

function useThemeSwitcher() {
    const [mode, setMode] = useState(() => localStorage.getItem("mode"));

    useEffect(() => {
        window.addEventListener("storage", setPreferedTheme);
        return () => {
            window.removeEventListener("storage", setPreferedTheme);
        };
    }, []);

    const setPreferedTheme = () => {
        const _mode = localStorage.getItem("mode");
        if (_mode) {
            setMode(_mode);
        } else {
            setMode("light");
        }
    };

    useEffect(() => {
        if (mode === "dark") {
            document.body.classList.add("dark-mode");
            localStorage.setItem("mode", "dark");
        } else {
            document.body.classList.remove("dark-mode");
            localStorage.setItem("mode", "light");
        }
    }, [mode]);

    return (
        <a className="cursor-pointer"
            onClick={() => setMode(mode => (mode === "dark" ? "light" : "dark"))}>
            <Button variant="success"> {mode === "dark" ? <i class="fas fa-moon"></i> : <i class="far fa-moon"></i>} Mode</Button>
        </a>
    );
}

export default useThemeSwitcher;