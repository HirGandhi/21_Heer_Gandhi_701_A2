


import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Logins () {
    const navigate = useNavigate();
    const [data, setData] = useState({
        email:"",
        pass: "",
         });
    
      // Handle the onchange event for each textbox
      const handleChange = (event) => {
        const { name, value } = event.target;
        setData((values) => ({
          ...values,
          [name]: value
        }));
      //  alert(data.No1);
      };

    const check=() =>
    {
        const sEmail = sessionStorage.getItem("sessionEmail");
        const sPass = sessionStorage.getItem("sessionPass");
        //var x=data["email"];
        // var y=data["pass"];
    // if (x==="bca" && y==="123")
    if (data.email===sEmail && data.pass===sPass)
        //navigate("/home");
    //{state:{id:1,name:'zzz'}}
      navigate("app/", { state: { user: x }} );
    else
        alert("sorry");
    };

    return (
        <div>
        <form>
        <br/>
        <br/>
        <br/>           
      <label for="email" >Email:</label>
      <input type="text"  id="email" placeholder="Enter email" name="email" value={data.email}  onChange={handleChange} />
  <br/>
      <label for="pass" >Password:</label>
      <input type="text" id="pass" placeholder="Enter Password" name="pass" value={data.pass} onChange={handleChange}/>
       <br/>
       <button type="button" className="btn btn-primary" name='b1'  onClick={check}>Submit</button>
            </form>
        </div>
    );
};