'use client'
import React, { useState } from 'react'

import Navbar from '../../components/navbar'
import Footer from '../../components/footer'
import Filter from '../../components/explore/filter'
import ExploreModels from '../../components/explore/explore-models'
import Banner from '../../components/explore/banner'

export default function Explore() {
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    category: 'all',
    sortBy: 'recent'
  });

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <>
      <Navbar navlight={true}/>
      
      {/* Hero Section */}
      <section 
        className="bg-half-170 d-table w-100" 
        style={{
          backgroundImage: `url("/images/bg/01.jpg")`,
          backgroundPosition: 'bottom'
        }}
      >
        <div className="bg-overlay bg-gradient-overlay-2"></div>
        <div className="container">
          <div className="row mt-5 justify-content-center">
            <div className="col-12">
              <div className="title-heading text-center">
                <h5 className="heading fw-semibold sub-heading text-white title-dark">
                  AI Models
                </h5>
                <p className="text-white-50 para-desc mx-auto mb-0">
                  Verified AI Models by the community
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shape Divider */}
      <div className="position-relative">            
        <div className="shape overflow-hidden text-white">
          <svg viewBox="0 0 2880 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 48H1437.5H2880V0H2160C1442.5 52 720 0 720 0H0V48Z" fill="currentColor"></path>
          </svg>
        </div>
      </div>

      {/* Main Content Section */}
      <section className="section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12">
              <div className="features-absolute">
                <div className="row justify-content-center" id="reserve-form">
                  <div className="col-xl-10 mt-lg-5">
                    <div className="card bg-white feature-top border-0">
                      <Filter onFilterChange={handleFilterChange} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <ExploreModels filters={filters} />
        </div>
      </section>

      <Banner/>
      <Footer/>
    </>
  )
}
