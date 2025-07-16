'use client'
import { useState } from 'react';
import Link from 'next/link'

import { FiArrowRight, MdOutlineClose } from '../assets/icons/vander'

import Modal from 'react-bootstrap/Modal';
import Image from 'next/image';

export default function WalletModal({desc}) {
    const [show, setShow] = useState(false);
  return (
    <>
     <p className="text-muted mt-3 mb-0">{desc} <Link href="#" className="link fw-semibold" onClick={()=>setShow(true)}>here <FiArrowRight/></Link></p> 
     <Modal
      show={show}
      onHide={()=>setShow(false)}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header>
        <Modal.Title className='d-flex w-100'>
          <h5 className="modal-title"><Image src='/images/logo-dark.png' width={120} height={26} alt=""/></h5>
          <button type="button" className="btn-close d-flex align-items-center text-dark" scroll={false} onClick={()=>setShow(false)}><MdOutlineClose className=" fs-4 text-muted"></MdOutlineClose></button>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form>
            <div className="form-floating mb-2">
                <input type="email" className="form-control" id="LoginEmail" placeholder="name@example.com"/>
                <label htmlFor="LoginEmail">Email Address:</label>
            </div>
            <div className="form-floating mb-3">
                <input type="password" className="form-control" id="LoginPassword" placeholder="Password"/>
                <label htmlFor="LoginPassword">Password:</label>
            </div>
        
            <div className="d-flex justify-content-between">
                <div className="mb-3">
                    <div className="form-check align-items-center d-flex mb-0">
                        <input className="form-check-input mt-0" type="checkbox" value="" id="RememberMe"/>
                        <label className="form-check-label text-muted ms-2" htmlFor="RememberMe">Remember me</label>
                    </div>
                </div>
                <small className="text-muted mb-0"><Link href="/reset-password" className="text-muted fw-semibold">Forgot password ?</Link></small>
            </div>

            <button className="btn btn-primary rounded-md w-100" type="submit">Sign in</button>

            <div className="col-12 text-center mt-4">
                <small><span className="text-muted me-2">Don't have an account ?</span> <Link href="/signup" className="text-dark fw-bold">Sign Up</Link></small>
            </div>
        </form>
      </Modal.Body>
    
    </Modal>
    </>
  )
}
