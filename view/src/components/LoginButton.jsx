import { Button, Modal,Tabs,Tab,Form } from "react-bootstrap";
import React, { useState ,useEffect} from "react";
import "../css/LoginButton.css";
import UtilityFunctions from "../UtilityFunctions";

export default function LoginButton() {
  const [data, setData] = useState(""); //holds the data from the reqest
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const [api, setapi] = useState("/api/login");
  const [userData, setUserData] = useState({}); //holds the data from the form
  const [show, setShow] = useState(false);
  const handleClose = () => {setShow(false);window.location.reload(false);}
  const handleShow = () => setShow(true);
  
  const handleSubmit = (event) => {
    event.stopPropagation() //stops form onSubmit from firing when opening/closing modal
    event.preventDefault() //stops page from refreshing
    setUserData({
        "username": username,
        "password": password

    })
}


useEffect(() => { //useEffect hook to make sure userData is actually set
  if (Object.keys(userData).length > 0) { //if userData is not empty
      const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
      }
      fetch(api, requestOptions)
          .then(response => response.json())
          .then(data => {
              console.log(data)
              if(data.message==="login success"){
                document.cookie = `data=${UtilityFunctions.Encrypt(data.id)}; Secure`
                document.cookie = `userperm=${UtilityFunctions.Encrypt(data.type)}; Secure`
                handleClose()
                location.reload()
              }
              else if(data.message==="register success"){
                handleClose()
              }
              else if(data.message==="email already exists"){
                alert("email already exists")
              } 
              else if(data.message==="password incorrect"){
                alert("password incorrect")
              }
              else if(data.message==="email not found"){
                alert("email not found")
              }
          })

           
  }
}, [userData])


const renderForm = (
    <Form onSubmit={handleSubmit}>
        <Form.Group controlId="username">
            <Form.Label>email</Form.Label>
            <Form.Control type="email" required onChange={e=>setusername(e.target.value)}/>
        </Form.Group>
        <Form.Group controlId="password">
            <Form.Label>password</Form.Label>
            <Form.Control type="password" required onChange={e=>setpassword(e.target.value)}/>
        </Form.Group>
        <div style={{ direction: "ltr" }}>
            <br />
            <Button variant="primary" type="submit" >
                Submit
            </Button>
        </div>
    </Form>
)



  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Login\Register
      </Button>

      <Modal show={show} onHide={handleClose} dialogClassName="my-modal">
      <Tabs
      defaultActiveKey="/api/login"
      id="login\register-tab"
      className="mb-3"
      justify
      variant="pills"
      onSelect={(eKey)=>setapi(eKey)}
    >
      <Tab title="login" eventKey="/api/login">
        <Modal.Header  className="flex-box">
          <Modal.Title><h2>Login</h2></Modal.Title>
        </Modal.Header>
        <Modal.Body className="flex-box">
            {renderForm}
        </Modal.Body>
      </Tab>
      <Tab title="register" eventKey="/api/register">
        <Modal.Header  className="flex-box">
          <Modal.Title><h2>Register</h2></Modal.Title>
        </Modal.Header>
        <Modal.Body className="flex-box">
            {renderForm}
        </Modal.Body>
        </Tab>
        </Tabs>
      </Modal>
    </>
  );
}
