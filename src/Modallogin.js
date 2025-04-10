import React from 'react'
import {
    MDBModal,
    MDBModalDialog,
    MDBModalContent,
    MDBModalHeader,
    MDBModalTitle,
    MDBModalBody,
    MDBBtn,
  } from "mdb-react-ui-kit";
import Login from './Login';

export default function Modallogin({staticModal, setStaticModal, toggleShow}) {
  return (
         <MDBModal staticBackdrop tabIndex='-1' show={staticModal} setShow={setStaticModal}>
         <MDBModalDialog>
           <MDBModalContent>
             <MDBModalHeader>
               <MDBModalTitle>Register/Login</MDBModalTitle>
               <MDBBtn
                 className="btn-close"
                 color="none"
                 onClick={toggleShow}
               ></MDBBtn>
             </MDBModalHeader>
             <MDBModalBody>
               <Login />
             </MDBModalBody>
 
             {/* <MDBModalFooter>
               <MDBBtn color='secondary' onClick={toggleShow}>
                 Close
               </MDBBtn>
             </MDBModalFooter> */}
           </MDBModalContent>
         </MDBModalDialog>
       </MDBModal>
  )
}
