import '../../style/ui/card.css';

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

export function Horarios({dias, imagen, horas, descripcion}){
  return(
    <>
      <div className="card-horarios">
        <img src={imagen} alt="reloj" />
        <h1>{dias}</h1>
        <p>{horas}</p>
        <p>{descripcion}</p>
      </div>
    </>
  )
}
