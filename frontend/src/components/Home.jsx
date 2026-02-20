import React, { useEffect } from 'react'
import logo from '../../public/logo.webp'
import { Link } from 'react-router-dom'
import { FaFacebookF } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa"
import { FaGithub } from "react-icons/fa";
import { CiFacebook } from "react-icons/ci";
import axios from "axios"
import Slider from "react-slick"
import { useState } from 'react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Home = () => {


  const [courses,setCourses]=useState([])
  useEffect(()=>{
   const fetchCourses=async()=>{
    try {
      const response=await axios.get("http://localhost:4001/api/v1/course/courses",{
        withCredentials:true
      })
      console.log(response.data.courses)
      setCourses(response.data.courses)
    } catch (error) {
      console.log("error in getting course ",error)
    }
   }
   fetchCourses()
  },[])

  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    initialSlide: 0,
    autoplay:true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };


  return (
      <div className='bg-gradient-to-r from-[#a6300d] to-[#ffff7d] w-screen overflow-hidden'>
          <div className=' text-blue-300  mx-auto max-w-6xl'>
              
                  <header className='flex mx-auto max-w-6xl p-4 items-center justify-between'>
                      <div className='flex items-center space-x-3'>
                        <img src={logo} alt="" className='w-10 h-10 rounded-full'/>
                        <h1 className='text-2xl text-blue-300 font-bold'>Online Course Hub..</h1>
                      </div>
                      <div className='flex gap-2'>
                        <Link to={"/login"} className='bg-transparent text-red-400 px-4 py-2 rounded border border-white font-semibold'>Login</Link>
                        <Link to={"/signup"} className='bg-transparent text-red-400 px-4 py-2 rounded border border-white font-semibold'>SignUp</Link>
                      </div>
                  </header>
              
        <section className='text-center m-5 font-semibold text-2xl'>
          <h1 className='font-extrabold italic bg-gradient-to-r from-blue-600 to-red-700 bg-clip-text text-transparent'>ONLINE COURSE HUB</h1>
          <br />
          <p className='text-red-700 italic'>The ultimate online courses you want... crafted by experts.</p>
          <br />
          <div className='flex gap-8 justify-center mt-2'>
            <button className='bg-red-100 text-red-700 px-4 py-2 rounded-3xl border-2 border-pink-300 font-medium hover:bg-pink-200 hover:scale-105 duration-300 hover:text-red-700 hover:border-green-200 text-base italic hover:font-semibold'><Link to={`/courses`}>
              Explore-Courses
            </Link></button>
            <button className='bg-red-100 text-red-700 px-4 py-2 rounded-3xl border-2 border-pink-300 font-medium hover:bg-pink-200 hover:scale-105 duration-300 hover:text-red-700 hover:border-green-200 text-base italic hover:font-semibold'>Courses-Videos</button>
          </div>
        </section>



              <section>
          <Slider {...settings}>
            {
              courses.map((course)=>(
                <div key={course._id} className='p-4'>
                  <div className='relative flex-shrink-0 w-60 h-75 rounded-lg transition-transform duration-300 transform hover:scale-105 bg-red-400/40 p-3'>
                   
                    <img className='h-32 w-full object-contain' src={course.image.url} alt="" />
                    <div className="p-6 text-center">
                      <h2 className="text-xl font-bold text-white">
                        {course.title}
                      </h2>
                      <button className='mt-4 bg-orange-500 text-white py-2 px-4 rounded-full hover:bg-blue-500 duration-300'>
                      <Link to={`/buy/${course._id}`}>
                        Enroll Now
                      </Link>
                      </button>
                    </div>
                  
                  </div>
                </div>
              )

              )
            }
          </Slider>
        </section>
            
        <footer >
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 p-4 mt-15'>
            

              <div className='flex flex-col items-center '>
                <div >
                <div className='flex items-center space-x-2 mb-1'>
                  <img src={logo} alt="" className='w-6 h-6 rounded-full' />
                  <h1 className='text-xl text-gray-800 font-semibold'>Online Course Hub..</h1>
                </div>
                <div className='flex-col '>
                  <p>Follow Us</p>
                  <div className='flex space-x-2 mt-2'>
                    <a href=""><CiFacebook className='text-2xl hover:text-blue-600 duration-300' /></a>
                    <a href=""><FaInstagram className='text-2xl hover:text-pink-400 duration-300' /></a>
                    <a href=""><FaGithub className='text-2xl hover:text-black duration-300' /></a>
                  </div>
                </div>
                </div>
              </div>
              <div >
                <div className='text-amber-900 flex flex-col items-center  '>
                  <div >
                  <h1 className='text-2xl hover:text-red-500 hover:font-serif duration-300'>Connect us</h1>
                  <ul>
                    <li className='text-base text-blue-500 hover:text-green-700 font-semibold duration-300'>Learn Skills.</li>
                    <li className='text-base text-blue-500 hover:text-green-700 font-semibold duration-300'>Get Knowledge.</li>
                    <li className='text-base text-blue-500 hover:text-green-700 font-semibold duration-300'>Experience the truth.</li>
                  </ul>
                  </div>
                </div>
              </div>
              <div >
                <div className='text-amber-900 flex flex-col items-center  '>
                  <div >
                    <h1 className='text-2xl hover:text-red-500 hover:font-serif duration-300'>Copyrights-2026</h1>
                  <ul>
                    <li className='text-base text-blue-500 hover:text-green-700 font-semibold duration-300'>Important Discussions.</li>
                    <li className='text-base text-blue-500 hover:text-green-700 font-semibold duration-300'>Know more...</li>
                    <li className='text-base text-blue-500 hover:text-green-700 font-semibold duration-300'>Refund and cancellations.</li>
                  </ul>
                  </div>
                </div>
              </div>
            
          </div>
        </footer>
          </div>
      </div>
  )
}

export default Home