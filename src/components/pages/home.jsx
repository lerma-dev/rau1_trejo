import '../../styles/pages/home.css';
import {Clases} from '../cards/card'

function Home(){
  return(
    <>
      <div className="container-home">
        <h1>Bienvenido a la escuela de Música</h1>

        <h2>Clases Disponibles</h2>
        <Card 
          imagen={require('../../assets/imgs/piano.png')}
          clase='Piano'
          cupoMax={3}
          minAl={0}
          descripcion='Aprende a tocar el piano desde lo básico hast niveles avanzados.'/>
        
        <Card 
          imagen={require('../../assets/imgs/guitar.png')}
          clase='Guitarra'
          cupoMax={12}
          minAl={0}
          descripcion='Domina la guitara acústica y eléctrica con nuestros expertos.'/>

        <Card 
          imagen={require('../../assets/imgs/violin.png')}
          clase='Guitarra'
          cupoMax={12}
          minAl={0}
          descripcion='Aprende la técnica y expresión del violín clásico.'/>
      </div>
    </>
  )
}

export default Home;