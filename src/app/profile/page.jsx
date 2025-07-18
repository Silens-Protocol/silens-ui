'use client'

import React from 'react'

import Navbar from '../../components/navbar'
import ProfileHero from '../../components/profile/profile-hero'
import ProfileTab from '../../components/profile/profile-tab'
import Footer from '../../components/footer'

export default function Profile() {
  return (
    <>
    <Navbar/>
    <section className="bg-creator-profile">
      <ProfileHero/>
      <ProfileTab/>
    </section>
    <Footer/>
    </>
  )
}