import React from 'react'
import Link from 'next/link'

export default function BackToHome() {
  return (
        <div className="back-to-home">
            <Link href="/" className="back-button btn btn-pills btn-sm btn-icon btn-primary"><i className="mdi mdi-arrow-left"></i></Link>
        </div>
  )
}
