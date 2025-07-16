import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FiArrowRight } from '../../assets/icons/vander'

export default function Banner() {
  return (
    <section className="section pt-0 pt-sm-5 mt-0 mt-sm-5">
        <div className="container">
            <div className="bg-black rounded-md p-md-5 p-4">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4 col-md-6">
                            <div className="app-subscribe text-center text-md-start">
                                <Image src='/images/cta.png' width={0} height={0} sizes='100vw' style={{width:'100%', height:'auto'}} className="img-fluid" alt=""/>
                            </div>
                        </div>

                        <div className="col-lg-8 col-md-6 mt-4 pt-2 mt-sm-0 pt-sm-0">
                            <div className="section-title text-center text-md-start ms-xl-5 ms-md-4">
                                <h4 className="display-6 fw-bold text-white title-dark mb-0">Be the first to review <span className="text-gradient-primary fw-bold">AI Models </span> <br/> and earn reputation badges</h4>
                            
                                <div className="mt-4">
                                    <Link href="" className="btn btn-link primary text-white title-dark">Review Now <FiArrowRight/></Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  )
}
