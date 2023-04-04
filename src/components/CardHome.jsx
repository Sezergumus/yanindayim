import React, { useState } from 'react'
import { Grid, PaginationItem } from '@mui/material'
import Post from '../components/Post';
import axios from 'axios'
import { Card, Button, FormGroup } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FilterListIcon from '@mui/icons-material/FilterList';
import Popover from '@mui/material/Popover';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import AddIcon from '@mui/icons-material/Add';
import Pagination from '@mui/material/Pagination';
import { Link } from 'react-router-dom'
 
const CardHome = () => {
  const [posts, setPosts] = useState([])
  const [filteredPosts, setFilteredPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const[filters, setFilters] = useState({
    category: '',
    city: '',
    district: '',
    helpingFilter: ''
  })

  const[ModalData, setModalData] = useState({})
  const [districts, setDistricts] = useState([]);
  const [addedCities, setAddedCities] = useState([]);
  const [open, setOpen] = React.useState(false);
  const[currentPage, setCurrentPage] = useState(1)
  const handleClose = () => setOpen(false);
  
  // Get current posts
  const postsPerPage = 12;
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const pageCount = Math.ceil(filteredPosts.length / postsPerPage);

  const handleCityChange = (newCity) => {
      setFilters(filters => ({ ...filters, city: newCity.label, city_id: newCity.id }));

      // add districts to districts array if city is not added before
      if(!addedCities.includes(newCity.id)) {
          axios.get(`https://turkiyeapi.cyclic.app/api/v1/provinces/${newCity.id}?fields=districts`)
          .then(res => {
              // add district's name and city's id to districts array
              res.data.data.districts.forEach(district => {
                  setDistricts(districts => [...districts, {label: district.name, city_id: newCity.id}]);
              });
              // when districts are added to districts array, add city's id to addedCities array
              setAddedCities(addedCities => [...addedCities, newCity.id]);
          })
          .catch(err => {
              console.log(err);
          })
      }
  }  

  const handlePageChange = (event, value) => {
    setCurrentPage(value)
    console.log(value)
  }

  React.useEffect(() => {
    axios.get('http://localhost:8080/api/posts', { withCredentials: true })
    .then(res => {
      const posts = res.data.map(post => {
        if(post.description.length > 100) {
          var shortDesc = post.description.substring(0, 100) + '...'
        } else {
          shortDesc = post.description
        }
        return {...post, shortDesc}
      })
      setPosts(posts)
      setFilteredPosts(posts)
      setLoading(false)
    })
    .catch(err => {
      console.log(err)
    })
  }, [])

  const changeHelping = (type) => {

    // set active class of helping buttons
    if(filters.helpingFilter === '') {
      document.querySelector(`.${type}`).classList.toggle('active')
    } else if(filters.helpingFilter != type){
      document.querySelector(`.${filters.helpingFilter}`).classList.toggle('active')
      document.querySelector(`.${type}`).classList.toggle('active')
    } else {
      document.querySelector(`.${type}`).classList.toggle('active')
    }        

    if(filters.helpingFilter === type){
      setFilters(filters => ({ ...filters, helpingFilter: '' }))
    } else{
      setFilters(filters => ({ ...filters, helpingFilter: type }))
    }
  }

  // when filters change, filter posts
  React.useEffect(() => {
    renderFilter()
  }, [filters])

  const openPostModal = (id) => {
    // find the post with the id
    const post = posts.find(post => post.id === id)
    console.log(post)
    setModalData(post)
    setOpen(true)
    
    // set the post's data to modal
  }

  const renderFilter = () => {
    setLoading(true)
    setFilteredPosts([
      ...posts.filter(post => {
        if(filters.helpingFilter === '') {
          return post
        } else {
          return post.helping_or_seeking === filters.helpingFilter
        }
      }).filter(post => {
        if(filters.category === '') {
          return post
        } else {
          return post.category === filters.category
        }
      }).filter(post => {
        if(filters.city === '') {
          return post
        } else {
          return post.city === filters.city
        }
      }).filter(post => {
        if(filters.district === '') {
          return post
        } else {
          return post.district === filters.district
        }
      })
    ])

    setLoading(false)
  }

  return (
    <div className="home-card-container">
      <div className="home-card-filter">
        <div className="help-choose">
          <div className="recipient" onClick={ () => { changeHelping('recipient') } }>yardım bekleyenler</div>
          <div className="helper" onClick={ () => { changeHelping('helper') } }>yardım edenler</div>
        </div>
        <div className="home-buttons-container">
          <PopupState variant="popover">
            {(popupState) => (
              <div>
                <Button variant="contained" className='filter-btn' endIcon={<FilterListIcon />} {...bindTrigger(popupState)}>
                  Filtrele
                </Button>
                <Popover
                  {...bindPopover(popupState)}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                  }}
                >
                <div className="filter-popup-container"> 
                  <div className="filter-popup">
                  <FormControl sx={{ m: 1, minWidth: 200 }}>
                        <InputLabel>Kategori</InputLabel>
                        <Select
                        value={filters.category}
                        label="Kategori"
                        onChange= {e => setFilters(filters => ({ ...filters, category: e.target.value }))}
                        >
                        <MenuItem value={""} sx={{}}>Hepsi
                            
                        </MenuItem>
                            <MenuItem value={'hizmet'}>Hizmet</MenuItem>
                            <MenuItem value={'giyim'}>Giyim</MenuItem>
                            <MenuItem value={'ilaç'}>İlaç</MenuItem>
                            <MenuItem value={'erzak'}>Erzak</MenuItem>
                            <MenuItem value={'konaklama'}>Konaklama</MenuItem>
                            <MenuItem value={'lojistik'}>Lojistik</MenuItem>
                        </Select>
                  </FormControl>  
                   
                    <FormGroup>    
                        <Autocomplete
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            id="combo-box"
                            value={filters.city}
                            city_id={filters.city_id}
                            options={cities}
                            sx={{ m:1, minWidth: 200, width: 'fit-content' }}
                            onChange={(event, newValue) => {
                                if (newValue) {
                                    handleCityChange(newValue);
                                    // blank the district input
                                    setFilters(filters => ({ ...filters, district: '' }));
                                } else if(newValue === null) {
                                    setFilters(filters => ({ ...filters, city: '', city_id: '', district: '' }));
                                }
                            }}
                            renderInput={(params) => <TextField {...params} label="Şehir" sx={{ maxHeight:100 }}                                 
                            />}
                        />
                        <Autocomplete
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            value={filters.district}
                            noOptionsText="Önce şehir seçin"
                            id="combo-box"
                            options={
                                districts.filter(district => district.city_id === filters.city_id)
                            }
                            sx={{ m:1, minWidth: 200, maxWidth: 300 }}
                            onChange={(event, newValue) => {
                                if (newValue) {
                                    setFilters(filters => ({ ...filters, district: newValue.label }));
                                } else if(newValue === null) {
                                    setFilters(filters => ({ ...filters, district: '' }));
                                }
                            }}
                            renderInput={(params) => <TextField {...params} label="İlçe" sx={{ maxHeight:100 }}
                            />}
                        />
                    </FormGroup>
                    </div>
                </div>
                </Popover>
              </div>
            )}
          </PopupState>
          <div className="create-button">
          <Link to="/olustur">
            <Button variant="contained" className='create-btn' sx={{ml:1}} endIcon={<AddIcon/>}>
              OLUŞTUR
            </Button>
          </Link>
        </div>                   
        </div>
      </div>
      <Grid container spacing={4} justifyContent="center">
        {loading ? <div className="loading">Yükleniyor...</div> : currentPosts.map(post => (
          <Grid item key={post._id}>
             <Card sx={{ minWidth: 275, maxWidth: 275, minHeight: '100%', display:'flex', flexDirection:'column', justifyContent:'space-between', borderRadius: 4, boxShadow: 'rgb(0 0 0 / 24%) 0px 3px 8px 10px' }} className='card'>
                <div className="card-category">
                  <h3 className='card-category-title'>{post.category}</h3>
                </div>
                <div className="card-main-content">
                  <div className="card-header">
                    <h2 className='card-title'>{post.title}</h2>
                    <div className='card-location'>
                      <p>{post.city}</p>
                      <p>{post.district}</p>
                    </div>
                    <h5 className='card-date'>{post.date} / {post.time}</h5>
                  </div>
                  <div className="card-description">
                    <p>{post.shortDesc}</p>
                  </div>
                </div>
                <Button 
                  variant="contained"
                  size="large"
                  className='card-button'
                  endIcon={<ArrowForwardIcon/>}
                  value={post.id}
                  onClick={ () => { openPostModal(post.id) } }
                  sx={{color: 'white', width:'fit-content' ,position: 'relative', left: '50%', transform: 'translateX(-50%)', py: 0.8, px: 2.5, borderRadius: 0.7,fontFamily: 'markpro-bold', textTransform: 'none', backgroundColor: '#4A2C8F', '&:hover': {backgroundColor: '#4A2C8F'}}}
                >Detay</Button>
            </Card>  
          </Grid>
        ))}
      </Grid>
      <div className="card-pagination">
        <Pagination count={pageCount} page={currentPage} onChange={handlePageChange} showFirstButton showLastButton sx={{color: 'white'}} renderItem={	(item) => <PaginationItem sx={{color:'white'}} {...item} />}/>
      </div>
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <div className="post-modal-container">
          <div className="post-modal-inner-container">
            <div className="modal-header">
              <p>Ad Soyad</p>
              <h4 className="modal-author">{ModalData.postFullName}</h4>
              <p>Tel. No</p>
              <h4 className="modal-contact">{ModalData.contact}</h4>
              <p>Adres</p>
              <h4 className="modal-location">{ModalData.city} - {ModalData.district}</h4>
              <p>Tarih / Saat</p>
              <h4 className="modal-date">{ModalData.date} / {ModalData.time}</h4>
              <p>Başlık</p>
              <h4 className="modal-title">{ModalData.title}</h4>
              <p>Açıklama</p>
              <h4 className="modal-description">{ModalData.description}</h4>
            </div>
            <div className="category-badge">
              <h4>{ModalData.category}</h4>
            </div>
          </div>
        </div>
      </Modal>
              
    </div>
  )
}

// Data from https://turkiyeapi.cyclic.app/api/v1/provinces?fields=name,id
const cities = [{"label":"Adana","id":1},{"label":"Adıyaman","id":2},{"label":"Afyonkarahisar","id":3},{"label":"Ağrı","id":4},{"label":"Amasya","id":5},{"label":"Ankara","id":6},{"label":"Antalya","id":7},{"label":"Artvin","id":8},{"label":"Aydın","id":9},{"label":"Balıkesir","id":10},{"label":"Bilecik","id":11},{"label":"Bingöl","id":12},{"label":"Bitlis","id":13},{"label":"Bolu","id":14},{"label":"Burdur","id":15},{"label":"Bursa","id":16},{"label":"Çanakkale","id":17},{"label":"Çankırı","id":18},{"label":"Çorum","id":19},{"label":"Denizli","id":20},{"label":"Diyarbakır","id":21},{"label":"Edirne","id":22},{"label":"Elazığ","id":23},{"label":"Erzincan","id":24},{"label":"Erzurum","id":25},{"label":"Eskişehir","id":26},{"label":"Gaziantep","id":27},{"label":"Giresun","id":28},{"label":"Gümüşhane","id":29},{"label":"Hakkari","id":30},{"label":"Hatay","id":31},{"label":"Isparta","id":32},{"label":"Mersin","id":33},{"label":"İstanbul","id":34},{"label":"İzmir","id":35},{"label":"Kars","id":36},{"label":"Kastamonu","id":37},{"label":"Kayseri","id":38},{"label":"Kırklareli","id":39},{"label":"Kırşehir","id":40},{"label":"Kocaeli","id":41},{"label":"Konya","id":42},{"label":"Kütahya","id":43},{"label":"Malatya","id":44},{"label":"Manisa","id":45},{"label":"Kahramanmaraş","id":46},{"label":"Mardin","id":47},{"label":"Muğla","id":48},{"label":"Muş","id":49},{"label":"Nevşehir","id":50},{"label":"Niğde","id":51},{"label":"Ordu","id":52},{"label":"Rize","id":53},{"label":"Sakarya","id":54},{"label":"Samsun","id":55},{"label":"Siirt","id":56},{"label":"Sinop","id":57},{"label":"Sivas","id":58},{"label":"Tekirdağ","id":59},{"label":"Tokat","id":60},{"label":"Trabzon","id":61},{"label":"Tunceli","id":62},{"label":"Şanlıurfa","id":63},{"label":"Uşak","id":64},{"label":"Van","id":65},{"label":"Yozgat","id":66},{"label":"Zonguldak","id":67},{"label":"Aksaray","id":68},{"label":"Bayburt","id":69},{"label":"Karaman","id":70},{"label":"Kırıkkale","id":71},{"label":"Batman","id":72},{"label":"Şırnak","id":73},{"label":"Bartın","id":74},{"label":"Ardahan","id":75},{"label":"Iğdır","id":76},{"label":"Yalova","id":77},{"label":"Karabük","id":78},{"label":"Kilis","id":79},{"label":"Osmaniye","id":80},{"label":"Düzce","id":81}]

export default CardHome