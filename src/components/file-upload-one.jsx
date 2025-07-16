'use client'
import React, { useState } from "react";
import Image from "next/image";
import {FiCamera} from '../assets/icons/vander'

export default function FileUploadOne() {
    let [file, setFile] = useState('/images/client/01.jpg')

    function handleChange(e) {
        setFile(URL.createObjectURL(e.target.files[0]));
    }

  return (
    <div className="profile-pic">
        <input id="pro-img" name="profile-image" type="file" className="d-none" onChange={(e)=>handleChange(e)} />
        <div className="position-relative d-inline-block">
            <Image src={file} width={110} height={110} className="avatar avatar-medium img-thumbnail rounded-pill shadow-sm" id="profile-image" alt=""/>
            <label className="icons position-absolute bottom-0 end-0" htmlFor="pro-img"><span className="btn btn-icon btn-sm btn-pills btn-primary"><FiCamera className="fs-6"></FiCamera></span></label>
        </div>
    </div>
  )
}
