import { useState } from 'react'
import { useNavigate  } from 'react-router-dom';
import './styles/register.css';

export default function Register() {
  const navigate = useNavigate();
  const [prevDetails, setprevDetails] = useState({
    full_name:"",
    email:"",
    phone:"",
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

    try{
      e.preventDefault()
      console.log(prevDetails)
      const response = await fetch("http://localhost:5000/api/register",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        credentials:"include",
        body:JSON.stringify(prevDetails)
      })
      const data = await response.json();


      if(data.success){
        navigate("/login",{replace:true});
      }

      if(!response.ok){
        throw new Error(data.error || "Registration Failed");
      }

      console.log("Registered successfully");
     

    }catch(err){
      console.error(err.message)
      
    }}

    

  return (
   <>
<div className='page-container'>
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Create Account</h1>
          <p className="card-subtitle">Join SRMIST Lost &amp; Found</p>
        </div>

        <form onSubmit={handleSubmit} >
          <div className="form-group">
            <label>Full Name</label>
            <input
              className="input"
              type="text"
              placeholder="John Doe"
              name="full_name"
              value={prevDetails.full_name}
              onChange={handleChange}
              required
              />
            <div className="error-text"></div>
          </div>

          <div className="form-group">
            <label>SRMIST Email</label>
            <input
              className="input"
              type="email"
              placeholder="your.name@srmist.edu.in"
              name="email"
              value={prevDetails.email}
              onChange={handleChange}
              required
              />
            <div className="error-text"></div>
          </div>

          <div className="form-group">
            <label>Phone Number (Optional)</label>
            <input
              className="input"
              type="text"
              placeholder="+91 1234567890"
              name="phone"
              value={prevDetails.phone}
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
              value={prevDetails.password}
              onChange={handleChange}
              />
            <div className="error-text"></div>
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              className="input"
              type="password"
              placeholder="••••••••"
              name="password1"
              />
            <div className="error-text"></div>
          </div>

          <button className="btn-submit" type="submit">
            Create Account
          </button>

          <p className="helper-text">
            Already have an account? <a href="/login">Log In</a>
          </p>
        </form>
      </div>
              </div>
  
   </>
  );
}
