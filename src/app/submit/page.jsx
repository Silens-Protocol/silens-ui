'use client'

import React from 'react'
import Link from 'next/link'
import Navbar from '../../components/navbar'
import Footer from '../../components/footer'
import ModelForm from '../../components/submit/ModelForm'

export default function SubmitModel() {
  return (
    <>
    <Navbar navlight={true}/>  
    <section className="bg-half-170 d-table w-100" style={{backgroundImage:`url('/images/bg/01.jpg')`, backgroundPosition:'bottom'}}>
      <div className="bg-overlay bg-gradient-overlay-2"></div>
      <div className="container">
          <div className="row mt-5 justify-content-center">
              <div className="col-12">
                  <div className="title-heading text-center">
                      <h5 className="heading fw-semibold sub-heading text-white title-dark">Submit AI Model</h5>
                      <p className="text-white-50 para-desc mx-auto mb-0">Share your AI model with the community for review and validation</p>
                  </div>
              </div>
          </div>

          <div className="position-middle-bottom">
              <nav aria-label="breadcrumb" className="d-block">
                  <ul className="breadcrumb breadcrumb-muted mb-0 p-0">
                      <li className="breadcrumb-item"><Link href="/">Silens</Link></li>
                      <li className="breadcrumb-item active" aria-current="page">Submit Model</li>
                  </ul>
              </nav>
          </div>
      </div>
    </section>
    <div className="position-relative">            
      <div className="shape overflow-hidden text-white">
          <svg viewBox="0 0 2880 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 48H1437.5H2880V0H2160C1442.5 52 720 0 720 0H0V48Z" fill="currentColor"></path>
          </svg>
      </div>
    </div>

    <section className="section">
      <div className="container">
          <div className="row justify-content-center">
              <div className="col-lg-10">
                  <ModelForm />
              </div>
          </div>
      </div>
    </section>
    <Footer/>
    </>
  )
}
