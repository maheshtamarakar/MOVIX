/* eslint-disable no-unused-vars */
import { useEffect } from "react"
import {fetchDataFromApi} from './utils/api'
import {getApiConfiguration, getGenres} from './store/homeSlice'
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
    genresCall()
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

  const genresCall = async () => {
    let promises = []
    let endPoints = ["tv", "movie"]
    let allGenres = {}

    endPoints.forEach((url) => {
      promises.push(fetchDataFromApi(`/genre/${url}/list`))
    })

    const data = await Promise.all(promises)
    data.map(({genres}) => {
      return genres.map((item) => (allGenres[item.id] = item))
    })
    dispatch(getGenres(allGenres))
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
