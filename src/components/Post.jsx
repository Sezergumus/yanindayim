import React from 'react'
import { Card, Button } from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const Post = () => {
  return (
    <Card sx={{ minWidth: 275, maxWidth: 275, borderRadius: 4, boxShadow: 'rgb(0 0 0 / 24%) 0px 3px 8px 10px' }} className='card'>
        <div className="card-category">
          <h3 className='card-category-title'>{post.category}</h3>
        </div>
        <div className="card-main-content">
          <div className="card-header">
            <h2 className='card-title'>Vinç Operatörü</h2>
            <h4 className='card-location'>İstanbul - Beyoğlu</h4>
            <h5 className='card-date'>06.02.2022 / 16:30</h5>
          </div>
          <div className="card-description">
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore molestias magnam porro, perspiciatis placeat dolores excepturi reprehenderit? Sed hic praesentium maiores harum! Repellat quis voluptatem iste fuga aliquid. Ipsa, voluptatum.</p>
          </div>
        </div>
        <Button 
        variant="contained"
        size="large"
        className='card-button'
        endIcon={<ArrowForwardIcon/>}
        sx={{color: 'white', position: 'relative', left: '50%', transform: 'translateX(-50%)', py: 0.8, px: 2.5, borderRadius: 0.7,fontFamily: 'markpro-bold', textTransform: 'none', backgroundColor: '#4A2C8F', '&:hover': {backgroundColor: '#4A2C8F'}}}
        >Detay</Button>
    </Card>  
  )
}

export default Post