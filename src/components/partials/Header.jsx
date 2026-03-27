import logo from '../../assets/imgs/musical-note.png';
import notify from '../../assets/imgs/notification.png';
import home from '../../assets/imgs/home.png';
import register_alumno from '../../assets/imgs/register_alumno.png';
import inscripcion from '../../assets/imgs/register_group.png';
import modify from '../../assets/imgs/modify_ins.png';
import reports from '../../assets/imgs/reportes.png';
import '../../styles/partials/header.css';

function Header({setPage, currentPage}) {
  return (
    <header className='header-outer'>
      <div className='header-top'>
        <div className='brand-logo'>
          <img src={logo} alt='logo' />
        </div>
        <h1 className='brand-titulo'>Escuela de Música</h1>
        <button className='btn-notify'>
          <img src={notify} alt='notificaciones' />
        </button>
      </div>

      <nav className='nav-tabs'>
        <ul>
          {/* pestaña home */}
          <li 
            className={currentPage === 'home' ? 'active': ''}
            onClick={() => setPage('home')}>
            <img src={home} alt="" /> 
            Inicio
          </li>
          {/* pestaña register */}
          <li 
            className={currentPage === 'register' ? 'active': ''}
            onClick={() => setPage('register')}>
            <img src={register_alumno} alt="" /> 
            Registrar alumno
          </li>
          {/* pestaña inscripcion */}
          <li 
            className={currentPage === 'inscripcion' ? 'active': ''}
            onClick={() => setPage('inscripcion')}>
            <img src={inscripcion} alt="" /> 
            Inscribir a grupo
          </li>
          {/* pestaña modificar */}
          <li 
            className={currentPage === 'modificar' ? 'active': ''}
            onClick={() => setPage('modificar')}>
            <img src={modify} alt="" /> 
            Modificar o Eliminar Inscripción
          </li>
          {/* pestaña reportes */}
          <li 
            className={currentPage === 'reportes' ? 'active': ''}
            onClick={() => setPage('reportes')}>
            <img src={reports} alt="" /> 
            Reportes
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;