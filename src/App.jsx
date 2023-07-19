/* eslint-disable no-unused-vars */
import { useEffect } from "react"
import {fetchDataFromApi} from './utils/api'
import {getApiConfiguration} from './store/homeSlice'
import { useSelector, useDispatch } from 'react-redux'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/header/Header'
import Footer from './components/footer/Footer'
import Home from './pages/home/Home'
import Details from './pages/details/Details'
import SearchResult from './pages/searchResult/SearchResult'
import Explore from './pages/explore/Explore'
import PageNotFound from './pages/404/PageNotFound'

function App() {
  const dispatch = useDispatch() // dispatch is use to call homeSlice getApiConfiguration so I can store response 
  const {url} = useSelector((state) => state.home)// useSelectore goes to my store.js and return home:homeSlice

  useEffect(() => {
    // invoke function when page loads
    fetchApiConfig()
  }, [])

  // redux devtools is chrome extension for testing redux store
  const fetchApiConfig = () => {
    fetchDataFromApi("/configuration").then((res) => {
      const url = {
        backdrop: res.images.secure_base_url + 
        "original",
        poster: res.images.secure_base_url + 
        "original",
        profile: res.images.secure_base_url + 
        "original",
      }
      dispatch(getApiConfiguration(url))
    })
  }
  return (
    <BrowserRouter>
    <Header/>
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/:mediaType/:id" element={<Details/>} />
      <Route path="/search/:query" element={<SearchResult/>} />
      <Route path="/explore/:mediaType" element={<Explore/>} />
      <Route path="*" element={<PageNotFound/>} /> 
    </Routes>
    <Footer/>
    </BrowserRouter>
  )
}

export default App
