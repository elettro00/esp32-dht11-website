import React from 'react'

function Description({title, dscrpt1, dscrptX, dscrptY, dscrptHover, anim}) {
  return (
    <div className='info' data-aos={anim}>
        <h1>{title}</h1>
        <p>
            {dscrpt1}
        </p>
        <p>
            {dscrptX}
        </p>
        <p>
            {dscrptY}
        </p>
        <p>
            {dscrptHover}
        </p>
    </div>
  )
}

export default Description