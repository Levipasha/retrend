import React from "react";
import { MDBAccordion, MDBAccordionItem, MDBContainer, MDBCard, MDBCardBody, MDBCardHeader, MDBBtn } from "mdb-react-ui-kit";
import { useNavigate } from 'react-router-dom';
import { categories } from "./resources/Catagories";

function Sell() {
  
const navigate = useNavigate();
const handleClick = (category, item) => {
  navigate(`/attributes/${category}/${item}`);
};
  return (
    <MDBContainer>
      <MDBCard alignment='center' background='light' border='primary' shadow='0' className="mt-3 mb-3 container text-center" style={{ maxWidth: "800px" }}>
        <MDBCardHeader><h3>CHOOSE A CATEGORY</h3></MDBCardHeader>
        <MDBCardBody>
          <MDBAccordion alwaysOpen initialActive={1}>
            {categories.map(({ title, items }, index) => (
              <MDBAccordionItem key={index} collapseId={index + 1} headerTitle={title}>
                {items.map((item, i) => (
                  <MDBBtn key={i} className="btn btn-secondary mb-1 w-100" onClick={() => handleClick(title, item)}>{item}</MDBBtn>
                ))}
              </MDBAccordionItem>
            ))}
          </MDBAccordion>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
}

export default Sell;
