import "./css/App.css"
import { useState } from 'react'
import { Navbar, Container, Button } from 'react-bootstrap'
import FlightsList from './components/Flights/FlightsList'
import LoginButton from "./components/LoginButton"
import ScrollToTopButton from "./components/ScrollToTopButton"
import UtilityFunctions from "./UtilityFunctions"
import { useEffect } from "react"

export default function App() {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [flightsListMode, setFlightsListMode] = useState('All flights')

  function CheckAuthorization() {
    if (document.cookie) {
      const encryptedUserId = UtilityFunctions.CookieToJson("data")
      const encryptedUserPerm = UtilityFunctions.CookieToJson("userperm")
      if (encryptedUserId != "" && encryptedUserPerm != "") {
        const decryptedUserId = UtilityFunctions.Decrypt(encryptedUserId)
        fetch("/api/auth/" + decryptedUserId)
          .then(response => response.json())
          .then(data => setIsAuthorized(data))

        if (UtilityFunctions.Decrypt(encryptedUserPerm) === "admin") {
          setIsAdmin(true)
        }
      }
    }
  }

  useEffect(() => {
    CheckAuthorization()
  }, [isAuthorized])

  const logout_button = () => {
    document.cookie = "data= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"
    document.cookie = "userperm= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"
    location.reload()
  }

  const handleChangeMode = () => {
    if (flightsListMode === 'My tickets') {
      setFlightsListMode('All flights')
    }
    else {
      setFlightsListMode('My tickets')
    }
  }

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>

          {/* Logo and text */}
          <Navbar.Brand href="/">
            <img
              alt=""
              src="https://vitejs.dev/logo-with-shadow.png"
              width="30"
              height="30"
              className="d-inline-block align-top"
            />
            Sky searcher
          </Navbar.Brand>

          <Navbar.Collapse className="justify-content-end">

            {/*TODO: My tickets button (if pressed shows myflightslsit instead of flightslist*/}
            <Navbar.Text>
              {isAuthorized && !isAdmin ?
                <Button onClick={handleChangeMode}>{flightsListMode === "My tickets" ? 'All Flights' : 'My tickets'}</Button> : null}
            </Navbar.Text>

            {/* Login button */}
            <Navbar.Text>
              {isAuthorized ? <Button variant="danger" onClick={logout_button}> logout</Button> : <LoginButton />}
            </Navbar.Text>
          </Navbar.Collapse>

        </Container>
      </Navbar>

      <FlightsList mode={flightsListMode} isAuthorized={isAuthorized} isAdmin={isAdmin} />
    </>

  )
}