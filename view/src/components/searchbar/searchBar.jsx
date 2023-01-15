import {
  Button,
  Form,
  InputGroup,
  Row,
  Col,
} from "react-bootstrap";
import React, { useState, useEffect, useMemo } from "react";
import Select from "react-select";
import countryList from "react-select-country-list";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function SearchBar(props) {
  const [origin, setOrigin] = useState({}); //holds the data from the reqest
  const [ways, setWays] = useState(0);
  const [destination, setdestention] = useState({});
  const [startdate, setstartdate] = useState(new Date());
  const [startPrice, setStartPrice] = useState(0);
  const [endPrice, setEndPrice] = useState(0);
  const countries = useMemo(() => countryList().getData(), []);
  const renderDatePicker = (get, set) => {
    return (
      <DatePicker
        selected={get}
        onChange={(date) => set(date)}
        showTimeInput
        minDate={new Date()}
        dateFormat="dd/MM/yyyy HH:mm"
      />
    );
  };
const validator=()=>{
  if ( ways === 0 ){
    alert("please fill ways  field")
    return false;
  }
  if ( origin.value===undefined ){

    alert("please fill origin  field")
    return false;
  } 
  if ( destination.value===undefined){
    alert("please fill destination  field")
    return false;
  }
  if ( startPrice >= endPrice ){
    alert("please fill to price that bigger then from prcie field")
    return false;
  }

  return true;
}

  const handleSubmit = (event) => {
    event.stopPropagation(); //stops form onSubmit from firing when opening/closing modal
    event.preventDefault();
    if (validator()) {
    const api = `/api/searchFlight/${origin.value}/${destination.value}/${startdate}/${startPrice}/${endPrice}/${ways}`;
    const requestOptions = {
      method: "get",
      headers: { "Content-Type": "application/json" },
    };
    fetch(api, requestOptions)
      .then((response) => response.json())
      .then((data) => { props.setflightsList(data) })
      .catch((err) => console.log(err));
  }
  };
  const renderCountryPicker = (get, set) => {
    return <Select options={countries} value={get} onChange={set} required />;
  };
  return (
    <>
      <div>
        <h1>find your next flight</h1>
        <Form
          onSubmit={handleSubmit}
          style={{
            direction: "ltr",
            color: "blue",
            "text-align": "center",
            padding: "10px",
          }}
        >
          <Row>
            <Col xs="auto">
              <Form.Group controlId="ways">
                <Form.Check
                  inline
                  label="one way"
                  name="group1"
                  type="radio"
                  
                  onChange={() => {
                    setWays(1)
                  }}
                />
                <Form.Check
                  inline
                  label="two way"
                  name="group1"
                  type="radio"
                  
                  onChange={() => {
                    setWays(2)
                  }}
                />
              </Form.Group>
            </Col>
            <Col xs={6} md={3}>
              <Form.Group controlId="origin">
                <Form.Label>origin</Form.Label>
                {renderCountryPicker(origin, setOrigin)}
                
              </Form.Group>
            </Col>
            <Col xs={6} md={3}>
              <Form.Group controlId="destination">
                <Form.Label>destination</Form.Label>
                {renderCountryPicker(destination, setdestention)}
              </Form.Group>
            </Col>
            <Col xs={6} md={3}>
              <Form.Group controlId="start_date">
                <Form.Label>from date</Form.Label>
                {renderDatePicker(startdate, setstartdate)}
              </Form.Group>
            </Col>

            <Col xs={4} md={2}>
              <Form.Group controlId="start_price">
                <Form.Label>from price</Form.Label>
                <InputGroup className="mb-3">
                  <InputGroup.Text>$</InputGroup.Text>
                  <Form.Control
                    defaultValue={0}
                    onChange={(e) => {
                      setStartPrice(e.target.value);
                    }}
                    type="number"
                  />
                </InputGroup>
              </Form.Group>
            </Col>
            <Col xs={4} md={2}>
              <Form.Group controlId="end_price">
                <Form.Label>to price</Form.Label>
                <InputGroup className="mb-3">
                  <InputGroup.Text>$</InputGroup.Text>
                  <Form.Control
                    defaultValue={0}
                    onChange={(e) => {
                      setEndPrice(e.target.value);
                    }}
                    type="number"
                    
                  />
                </InputGroup>
              </Form.Group>
            </Col>
            <Col xs="auto">
              <div style={{ direction: "rtl" }}>
                <br />
                <Button variant="primary" type="submit">
                  search
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </div>
    </>
  );
}
