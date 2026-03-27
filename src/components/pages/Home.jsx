import '../../styles/pages/home.css';
import { Clases, Horarios } from '../ui/card'
import api from '../../api/axiosConfig';
import { useState, useRef, useEffect } from 'react';
import pianoImg from '../../assets/imgs/piano.png';
import guitarImg from '../../assets/imgs/guitar.png';
import violinImg from '../../assets/imgs/violin.png';
import clock_purpleImg from '../../assets/imgs/clock-purple.png';
import clock_blueImg from '../../assets/imgs/clock-blue.png';
import register_alumno from '../../assets/imgs/register_alumno.png';
import reports from '../../assets/imgs/reportes.png';

// Imagen por instrumento
const IMAGENES = {
  Piano: pianoImg,
  Guitarra: guitarImg,
  Violin: violinImg,
};

// Descripción por instrumento
const DESCRIPCIONES = {
  Piano: 'Aprende a tocar el piano desde lo básico hasta niveles avanzados.',
  Guitarra: 'Domina la guitara acústica y eléctrica con nuestros expertos.',
  Violin: 'Aprende la técnica y expresión del violín clásico.',
};

function Home(){
  const [grupos, setGrupos] = useState([]);
  const [loadingGrupos, setLoadingGrupos] = useState(true);

  useEffect(() => {
    api.get('/api/grupos')
      .then(res => {
        // Agrupar por instrumento: solo mostrar 1 card por instrumento con el cupo total
        const porInstrumento = {};
        res.data.forEach(g => {
          if (!porInstrumento[g.instrumento]) {
            porInstrumento[g.instrumento] = {
              instrumento: g.instrumento,
              cupoActual: 0,
              cupoMax: 0,
            };
          }
          porInstrumento[g.instrumento].cupoActual += g.cupoActual;
          porInstrumento[g.instrumento].cupoMax    += g.cupoMax;
        });
        setGrupos(Object.values(porInstrumento));
      })
      .catch(() => setGrupos([]))
      .finally(() => setLoadingGrupos(false));
  }, []);

  return(
    <>
      <div className="container-home">
        <div className="home-welcome">
          <h1>Bienvenido a la escuela de Música</h1>
          <p>
            Registra a tus alumnos en nuestra clases de piano, guitarra y víolin. 
            Gestiona grupos y consulta reportes facilmente.
          </p>
        </div>

        <div className="home-layout">
          <div className="home-card">
            <div className='home-title'>
              <img src={register_alumno} alt="register alumno" />
              <h3>Registra y Inscribe Alummos</h3>
            </div>
            <p>
              Inscribe a tus alumnos en nuestra plataforma de escuela de musica y deja que ellos aprendan nuevos intrumentos.
            </p>
          </div>
          <div className="home-card">
            <div className='home-title'>
              <img src={reports} alt="reportes" />
              <h3>Reportes</h3>
            </div>
            <p>
              Consultas todos los reportes por grupo, turno y nombre del alumno.
            </p>
          </div>
        </div>
        
        <div className="home-welcome">
          <h2>Clases Disponibles</h2>
        </div>
        <div className="contenedor-clases">
        {
          loadingGrupos ? (
            <p className='loading-clases'>
              Cargando clases...
            </p>
          )
          :grupos.map(g => (
            <Clases
              key={g.instrumento}
              imagen={IMAGENES[g.instrumento] || pianoImg}
              clase={g.instrumento}
              cupoActual={g.cupoActual}
              cupoMax={g.cupoMax}
              descripcion={DESCRIPCIONES[g.instrumento] || ''}
            />
          ))
        }
        </div>
      
        <div className="home-welcome">
          <h2>Clases Disponibles</h2>
        </div>
        <div className="home-layout">
          <Horarios 
            imagen={clock_purpleImg}
            dias='Martes a Jueves'
            horas='4:00 PM - 6:00 PM'
            descripcion='Clases entre semana para aprovechar las tardes.'/>

          <Horarios 
            imagen={clock_blueImg}
            dias='Sábados'
            horas='10:00 AM - 2:00 PM'
            descripcion='Clases intensivas los fines de semana.'/>
        </div>
      </div>
    </>
  )
}
export default Home;