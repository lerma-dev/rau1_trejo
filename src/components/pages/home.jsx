import '../../styles/pages/home.css';
import {Clases, Horarios} from '../ui/card'

function Home(){
  return(
    <>
      <div className="container-home">
        <h1>Bienvenido a la escuela de Música</h1>
        <p>
          Registra a tus alumnos en nuestra clases de piano, guitarra y víolin. 
          Gestiona grupos y consulta reportes facilmente
        </p>

        <h2>Clases Disponibles</h2>
        <Clases
          imagen={require('../../assets/imgs/piano.png')}
          clase='Piano'
          cupoMax={3}
          minAl={0}
          descripcion='Aprende a tocar el piano desde lo básico hast niveles avanzados.'/>
        
        <Clases
          imagen={require('../../assets/imgs/guitar.png')}
          clase='Guitarra'
          cupoMax={12}
          minAl={0}
          descripcion='Domina la guitara acústica y eléctrica con nuestros expertos.'/>

        <Clases 
          imagen={require('../../assets/imgs/violin.png')}
          clase='Guitarra'
          cupoMax={12}
          minAl={0}
          descripcion='Aprende la técnica y expresión del violín clásico.'/>

        <h2>Clases Disponibles</h2>
        <Horarios 
          imagen={require('../../assets/imgs/clock.png')}
          dias='Martes a Jueves'
          descripcion='Clases entre semana para aprovechar las tardes.'/>

        <Horarios 
          imagen={require('../../assets/imgs/clock_1.png')}
          dias='Sabados'
          descripcion='Clases entre semana para aprovechar las tardes.'/>
      </div>
    </>
  )
}
export default Home;