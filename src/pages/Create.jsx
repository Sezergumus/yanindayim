import React, { useState, useEffect } from 'react';
import moment from 'moment';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Button, FormGroup } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

function Create() {
    const navigate = useNavigate();

    let phone;
    let fullName;
    let id;

    // check if user exists in local storage
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if(!user) {
            navigate('/giris');
        } else {
            phone = user.phone;
            fullName = user.full_name;
            id = user.id;
        }
    }, []);
        
    const [districts, setDistricts] = useState([]);
    const [addedCities, setAddedCities] = useState([]);
    
    const handleCityChange = (newCity) => {
        setInputs(inputs => ({ ...inputs, city: newCity.label, city_id: newCity.id }));

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

    const handleClick = async (e) => {
        e.preventDefault();
        // Check if all inputs are filled
        if(inputs.category === '' || inputs.title === '' || inputs.city === '' || inputs.district === '' || inputs.description === '' || inputs.helping_or_seeking === '') {
            alert('Lütfen tüm alanları doldurun');
            return;
        } else {
            // Send post to server with cookie token with credentials 
            await axios.post('http://localhost:8080/api/posts', inputs, { withCredentials: true })
            .then(res => {
                alert('Gönderildi denetimden geçtikten sonra paylaşılacaktır.');
                navigate('/');
            }
            ).catch(err => {
                console.log(err);
            });
        };
    };

    const [inputs, setInputs] = useState({
        fullName: '',
        category: '',
        title: '',
        contact: '',
        show_contact: 'true',
        city: '',
        city_id: '',
        district: '',
        description: '',
        date: moment().format('DD.MM.YYYY'),
        time: moment().format('HH:mm'),
        helping_or_seeking: '',
        uid: ''
    });

    useEffect(() => {
        setInputs(inputs => ({ ...inputs, fullName: fullName, contact: phone, uid: id }));
    }, [fullName,id,phone]);

    const handleTypeClick = (e) => {
        setInputs(inputs => ({ ...inputs, helping_or_seeking: e.target.className }));
        
        // Hide the choose-post-type div with transition
        document.querySelector('.choose-post-type').style.opacity = '0';
        setTimeout(() => {
            document.querySelector('.choose-post-type').style.display = 'none';
        }, 500);

        // Show the form div with transition
        setTimeout(() => {
            document.querySelector('.form-container').style.display = 'flex';
        }, 500);
        setTimeout(() => {
            document.querySelector('.form-container').style.opacity = '1';
        }, 600);
    }

    return (
        <div className="add">
            <div className="choose-post-type">
                <span className="helper" onClick={handleTypeClick}>
                    <h1>Yardım Etmek İstiyorum</h1>
                </span>
                <span className="recipient" onClick={handleTypeClick}>
                    <h1>Yardım İstiyorum</h1>
                </span>
            </div>
            <div className="form-container">
                <form onSubmit={handleClick}>
                    {
                        inputs.helping_or_seeking === 'helper' ? (
                            <p>Yardım etmek istediğiniz kategoriyi seçin</p>
                        ) : (
                            <p>Yardım almak istediğiniz kategoriyi seçin</p>
                        )
                    }
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel>Kategori</InputLabel>
                        <Select
                        value={inputs.category}
                        label="Kategori"
                        onChange= {e => setInputs(inputs => ({ ...inputs, category: e.target.value }))}
                        >
                        <MenuItem value={""}>
                            
                        </MenuItem>
                            <MenuItem value={'hizmet'}>Hizmet</MenuItem>
                            <MenuItem value={'giyim'}>Giyim</MenuItem>
                            <MenuItem value={'ilaç'}>İlaç</MenuItem>
                            <MenuItem value={'erzak'}>Erzak</MenuItem>
                            <MenuItem value={'konaklama'}>Konaklama</MenuItem>
                            <MenuItem value={'lojistik'}>Lojistik</MenuItem>
                        </Select>
                    </FormControl>  
                    <p>Adres</p>
                    <FormGroup row='true'>    
                        <Autocomplete
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            disablePortal
                            id="combo-box"
                            options={cities}
                            sx={{ m:1, minWidth: 200 }}
                            onChange={(event, newValue) => {
                                if (newValue) {
                                    handleCityChange(newValue);
                                    // blank the district input
                                    setInputs(inputs => ({ ...inputs, district: '' }));
                                }
                            }}
                            renderInput={(params) => <TextField {...params} label="Şehir" sx={{ maxHeight:100 }} 
                            value={inputs.city}
                            city_id={inputs.city_id}                                
                            />}
                        />
                        <Autocomplete
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            value={inputs.district}
                            noOptionsText="Önce şehir seçin"
                            id="combo-box"
                            options={
                                districts.filter(district => district.city_id === inputs.city_id)
                            }
                            sx={{ m:1, minWidth: 200 }}
                            onChange={(event, newValue) => {
                                if (newValue) {
                                    setInputs(inputs => ({ ...inputs, district: newValue.label }));
                                }
                            }}
                            renderInput={(params) => <TextField {...params} label="İlçe" sx={{ maxHeight:100 }}
                            />}
                        />
                    </FormGroup>
                    <p>Telefon numaranız paylaşılsın mı?</p>
                    <FormControl sx={{ ml: 1 }}>
                        <RadioGroup
                            row
                            aria-labelledby="demo-radio-buttons-group-label"
                            defaultValue="female"
                            name="radio-buttons-group"
                            value={inputs.show_contact}
                            onChange={e => setInputs(inputs => ({ ...inputs, show_contact: e.target.value }))}
                        >
                            <FormControlLabel value="true" control={<Radio />} label="Evet" />
                            <FormControlLabel value="false" control={<Radio />} label="Hayır" />
                        </RadioGroup>
                    </FormControl>
                    <p>İlan Bilgileri</p>
                    <FormGroup sx={{ m: 1, minWidth: 120 }}>
                    <TextField
                        id="outlined-multiline-static"
                        label="Başlık"
                        multiline
                        rows={1}
                        value={inputs.title}
                        onChange={e => setInputs(inputs => ({ ...inputs, title: e.target.value }))}
                        sx={{ minWidth: 200, maxWidth: 300, mb: 1 }}
                        inputProps={{ maxLength: 32 }}
                    />
                    <TextField
                        id="outlined-multiline-static"
                        label="Açıklama"
                        multiline
                        rows={4}
                        value={inputs.description}
                        onChange={e => setInputs(inputs => ({ ...inputs, description: e.target.value }))}
                        sx={{ minWidth: 200, maxWidth: 500 }}
                        inputProps={{ maxLength: 200 }}
                    />
                    </FormGroup>
                    <Button 
                    variant="contained"
                    onClick={handleClick}
                    sx={{color: 'white', ml:1, borderRadius: 0.7,fontFamily: 'markpro-bold', textTransform: 'none', backgroundColor: '#4A2C8F', '&:hover': {backgroundColor: '#4A2C8F'}}}
                    >GÖNDER</Button>
                </form>
            </div>
        </div>
    )
}

// Data from https://turkiyeapi.cyclic.app/api/v1/provinces?fields=name,id
const cities = [{"label":"Adana","id":1},{"label":"Adıyaman","id":2},{"label":"Afyonkarahisar","id":3},{"label":"Ağrı","id":4},{"label":"Amasya","id":5},{"label":"Ankara","id":6},{"label":"Antalya","id":7},{"label":"Artvin","id":8},{"label":"Aydın","id":9},{"label":"Balıkesir","id":10},{"label":"Bilecik","id":11},{"label":"Bingöl","id":12},{"label":"Bitlis","id":13},{"label":"Bolu","id":14},{"label":"Burdur","id":15},{"label":"Bursa","id":16},{"label":"Çanakkale","id":17},{"label":"Çankırı","id":18},{"label":"Çorum","id":19},{"label":"Denizli","id":20},{"label":"Diyarbakır","id":21},{"label":"Edirne","id":22},{"label":"Elazığ","id":23},{"label":"Erzincan","id":24},{"label":"Erzurum","id":25},{"label":"Eskişehir","id":26},{"label":"Gaziantep","id":27},{"label":"Giresun","id":28},{"label":"Gümüşhane","id":29},{"label":"Hakkari","id":30},{"label":"Hatay","id":31},{"label":"Isparta","id":32},{"label":"Mersin","id":33},{"label":"İstanbul","id":34},{"label":"İzmir","id":35},{"label":"Kars","id":36},{"label":"Kastamonu","id":37},{"label":"Kayseri","id":38},{"label":"Kırklareli","id":39},{"label":"Kırşehir","id":40},{"label":"Kocaeli","id":41},{"label":"Konya","id":42},{"label":"Kütahya","id":43},{"label":"Malatya","id":44},{"label":"Manisa","id":45},{"label":"Kahramanmaraş","id":46},{"label":"Mardin","id":47},{"label":"Muğla","id":48},{"label":"Muş","id":49},{"label":"Nevşehir","id":50},{"label":"Niğde","id":51},{"label":"Ordu","id":52},{"label":"Rize","id":53},{"label":"Sakarya","id":54},{"label":"Samsun","id":55},{"label":"Siirt","id":56},{"label":"Sinop","id":57},{"label":"Sivas","id":58},{"label":"Tekirdağ","id":59},{"label":"Tokat","id":60},{"label":"Trabzon","id":61},{"label":"Tunceli","id":62},{"label":"Şanlıurfa","id":63},{"label":"Uşak","id":64},{"label":"Van","id":65},{"label":"Yozgat","id":66},{"label":"Zonguldak","id":67},{"label":"Aksaray","id":68},{"label":"Bayburt","id":69},{"label":"Karaman","id":70},{"label":"Kırıkkale","id":71},{"label":"Batman","id":72},{"label":"Şırnak","id":73},{"label":"Bartın","id":74},{"label":"Ardahan","id":75},{"label":"Iğdır","id":76},{"label":"Yalova","id":77},{"label":"Karabük","id":78},{"label":"Kilis","id":79},{"label":"Osmaniye","id":80},{"label":"Düzce","id":81}]

export default Create