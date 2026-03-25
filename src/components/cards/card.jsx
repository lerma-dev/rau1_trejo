import './card.css';

export function Clases({clase, imagen, minAl, cupoMax, descripcion}){
  return(
    <>
      <div className='card-clases'>
        <div className="background-img">
          <img src={imagen} alt='logos' />
        </div>
        <h3>{clase}</h3>
        <p>Cupo: {minAl} - {cupoMax} Alumnos</p>
        <p>{descripcion}</p>
      </div>
    </>
  )
}

export function Horarios({}){
  return(
    <>
      <div className="card-horarios">

      </div>
    </>
  )
}