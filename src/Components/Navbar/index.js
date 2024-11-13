import "./index.css"

const Navbar = (props) =>{
    const {handleLogout} = props
    return(
    <div className = "navbar">
        <h1 className = "navbar-heading"> TodoList </h1>
        <button className = "logout-btn" onClick = {handleLogout}> Logout </button>  
    </div>
    )
}

export default Navbar