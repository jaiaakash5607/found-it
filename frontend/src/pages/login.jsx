import  './styles/login.css';
import Alert from "react-bootstrap/Alert";
import { useState } from 'react';
import { useNavigate }  from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(false)
  const [prevDetails, setprevDetails] = useState({
    email:"",
    password:""
  })

  function handleChange(e){
    const {name, value} = e.target;
    setprevDetails(prev =>({
      ...prev,
      [name]:value
    }))
  }

  async function handleSubmit(e){
    e.preventDefault();
    setSuccess("")
    try{
      const response = await fetch("http://localhost:5000/api/login",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        credentials:"include",
        body:JSON.stringify(prevDetails)
      })
      const data = await response.json();
      

      if(!response.ok){
        throw new Error(data.error || "Registration Unsuccessfull")
      } 

      setSuccess(true);
      setTimeout(()=>{
        navigate("/browse",{replace:true})
      },1500);

      setprevDetails({
        password:""
      })

    } catch(err){
      setError(true)
      console.error(err.message)}
  }

  return (
    <>
       
      <div className='l'>
        <div className="card" >
          <div className="card-header">
            <h1 className="card-title">Log In</h1>
            <p className="card-subtitle">Access your Lost & Found account</p>
          </div>

      {success && (
        <Alert variant="success" style={{color:'green'}}>
            Login successful. Redirecting…
          </Alert>
        )}

    {error && (
      <Alert variant="danger" style={{color:"red"}}>
            <p>Invalid email id or password</p>
          </Alert>
        )}
        <br></br>

          <form onSubmit={handleSubmit} action="">
            <div className="form-group">
              <label>SRMIST Email</label>
              <input
                className="input"
                type="email"
                placeholder="your.name@srmist.edu.in"
                name="email"
                value={prevDetails.name}
                required
                onChange={handleChange}
                />
              <div className="error-text"></div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                className="input"
                type="password"
                placeholder="••••••••"
                name="password"
                value={prevDetails.value}
                onChange={handleChange}
                />
              <div className="error-text"></div>
            </div>

            <div className="form-footer">
              <div>
                {/* <input type="checkbox" id="rememberMe" /> */}
                {/* <label htmlFor="rememberMe">Remember me</label> */}
              </div>
              {/* <a href="#">Forgot Password?</a> */}
            </div>

            <button className="btn-submit" type="submit">
              Log In
            </button>

            <p className="helper-text">
              Don't have an account? <a href="/register">Create one</a>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
