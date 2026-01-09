import "./styles/logo.css"

export default function Logo(){
    return (
        <>
    <header>
        <div id="header">
            <div id="logo">
                <img src="./src/assets/logo.jpeg" />
                <h2>SRMIST Lost & Found</h2>
            </div>
            <div id="login">
                <button id="log" onclick="location.href='login.html'"><b>Log in</b></button>
                <button id="sing" onclick="location.href='Sign.html'">Sign Up</button>
            </div>
        </div>
    </header>
        </>
    )
}