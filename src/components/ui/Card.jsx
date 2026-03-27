import '../../styles/ui/card.css';

export function Clases({clase, imagen, cupoActual = 0, cupoMax, descripcion}){
  const pct = cupoMax > 0 ? Math.round((cupoActual / cupoMax) * 100) : 0;
  return(
    <div className='card-clases'>
      <div className="background-img">
        <img src={imagen} alt='logos' />
      </div>
      <div className="card-info">
        <h3>{clase}</h3>
        <p className="cupo-text">Cupo: {cupoActual} - {cupoMax} Alumnos</p>
        <div className="progress-bar">
          <div className="bar" style={{width: `${pct}%`}}></div>
        </div>
        <p className="descripcion">{descripcion}</p>
      </div>
    </div>
  )
}

export function Horarios({dias, imagen, horas, descripcion}){
  return(
    <div className="card-horarios">
      <img src={imagen} alt="reloj" />
      <div className="card-info">
        <h1>{dias}</h1>
        <p>{horas}</p>
        <p>{descripcion}</p>
      </div>
    </div>
  )
}
