import './App.css'
import { useState } from 'react';
import Header from './components/partials/Header';
import Footer from './components/partials/Footer';
import Home from './components/pages/Home';
import RegisterAlumno from './components/pages/RegisterAlumno';
import InscriptionGroup from './components/pages/InscriptionGroup';
import ModifyInscripcion from './components/pages/ModifyInscripcion';
import Reportes from './components/pages/Reportes';

function App() {
  const [page, setPage] = useState('home');
  const renderPage = () => {
    switch(page){
      case 'home':
        return <Home />;
      case 'register':
        return <RegisterAlumno />;
      case 'inscripcion':
        return <InscriptionGroup />;
      case 'modificar':
        return <ModifyInscripcion />;
      case 'reportes':
        return <Reportes />;
      default:
        return <Home />
    }
  }

  return (
    <>
      <div className='app'>
        <Header setPage={setPage} currentPage={page}/>
        <main className='container-app'>
          {renderPage()}
        </main>
        <Footer />
      </div>
    </>
  );
}
export default App;
