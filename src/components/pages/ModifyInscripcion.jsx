import '../../styles/pages/modifyInscripcion.css';
import { useState } from 'react';
import api from '../../api/axiosConfig';
import searchIcon from '../../assets/imgs/Search.png';
import successIcon from '../../assets/badges/Success.png';
import warningIcon from '../../assets/badges/Warning.png';
import errorIcon from '../../assets/badges/Error.png';

const CLASES = ['Piano', 'Guitarra', 'Violin'];
const TURNOS = [
  'Lunes a Viernes, 8:00 AM - 10:00 AM',
  'Lunes a Viernes, 4:00 PM - 6:00 PM',
  'Sábado 8 a 1 PM',
  'Martes a Jueves, 5:00 - 7:00 PM',
];

function ModifyInscripcion() {
  const [busqueda, setBusqueda] = useState('');
  const [alumno, setAlumno] = useState(null);
  const [loadingBuscar, setLoadingBuscar] = useState(false);
  const [loadingGuardar, setLoadingGuardar] = useState(false);
  const [alertaBuscar, setAlertaBuscar] = useState(null); // null | 'found' | 'notfound'
  const [alertaGuardar, setAlertaGuardar] = useState(null); // null | 'success' | 'warning' | 'error'
  const [msgGuardar, setMsgGuardar] = useState('');

  // Edición local
  const [claseActual, setClaseActual] = useState('');
  const [turnoActual, setTurnoActual] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [cupoWarning, setCupoWarning] = useState('');

  const handleBuscar = async () => {
    if (!busqueda.trim()) return;
    setLoadingBuscar(true);
    setAlertaBuscar(null);
    setAlumno(null);
    setAlertaGuardar(null);
    try {
      const res = await api.get(`/api/alumnos/buscar?q=${busqueda}`);
      if (res.data && res.data.length > 0) {
        const al = res.data[0];
        setAlumno(al);
        setClaseActual(al.clase || '');
        setTurnoActual(al.turno || '');
        setTelefono(al.telefono || '');
        setCorreo(al.correo || '');
        setCupoWarning('');
        setAlertaBuscar('found');
      } else {
        setAlertaBuscar('notfound');
      }
    } catch {
      setAlertaBuscar('notfound');
    } finally {
      setLoadingBuscar(false);
    }
  };

  const handleClaseChange = async (e) => {
    const nuevaClase = e.target.value;
    setClaseActual(nuevaClase);
    setCupoWarning('');
    if (!nuevaClase) return;
    try {
      // Verificar cupo de la nueva clase en el turno actual
      const res = await api.get(`/api/grupos/cupo?clase=${nuevaClase}&turno=${encodeURIComponent(turnoActual)}`);
      if (res.data.disponible === false) {
        setCupoWarning(`Al cambiar a ${nuevaClase} (${turnoActual}) no hay lugares disponibles.`);
      }
    } catch {
      setCupoWarning('');
    }
  };

  const handleTurnoChange = async (e) => {
    const nuevoTurno = e.target.value;
    setTurnoActual(nuevoTurno);
    setCupoWarning('');
    if (!claseActual || !nuevoTurno) return;
    try {
      const res = await api.get(`/api/grupos/cupo?clase=${claseActual}&turno=${encodeURIComponent(nuevoTurno)}`);
      if (res.data.disponible === false) {
        setCupoWarning(`Al cambiar a ${claseActual} (${nuevoTurno}) no hay lugares disponibles.`);
      }
    } catch {
      setCupoWarning('');
    }
  };

  const handleGuardar = async () => {
    if (!alumno) return;
    if (cupoWarning) {
      setAlertaGuardar('warning');
      setMsgGuardar('Corrige los problemas de cupo antes de guardar.');
      return;
    }
    setLoadingGuardar(true);
    setAlertaGuardar(null);
    try {
      await api.put(`/api/alumnos/${alumno.id}`, { clase: claseActual, turno: turnoActual, telefono, correo });
      setAlertaGuardar('success');
      setMsgGuardar('Cambios guardados correctamente.');
    } catch (err) {
      setAlertaGuardar('error');
      setMsgGuardar(err?.response?.data?.mensaje || 'Error al guardar los cambios.');
    } finally {
      setLoadingGuardar(false);
    }
  };

  const handleEliminar = async () => {
    if (!alumno) return;
    setLoadingGuardar(true);
    try {
      await api.delete(`/api/alumnos/${alumno.id}`);
      setAlumno(null);
      setAlertaBuscar(null);
      setBusqueda('');
      setAlertaGuardar('success');
      setMsgGuardar('Inscripción eliminada correctamente.');
    } catch (err) {
      setAlertaGuardar('error');
      setMsgGuardar(err?.response?.data?.mensaje || 'Error al eliminar la inscripción.');
    } finally {
      setLoadingGuardar(false);
    }
  };

  const handleCancelar = () => {
    setAlumno(null);
    setBusqueda('');
    setAlertaBuscar(null);
    setAlertaGuardar(null);
    setCupoWarning('');
  };

  return (
    <>
      <div className="modificar-container">
        <h2 className="modificar-title">Modificar / Eliminar Inscripción</h2>
        <p className="modificar-subtitle">Busca al alumno para editar o cancelar su registro</p>

        {/* Buscar alumno */}
        <div className="buscar-section">
          <div className="buscar-label">
            <img src={searchIcon} alt="buscar" />
            Buscar Alumno
          </div>
          <div className="buscar-row">
            <input
              type="text"
              placeholder="Nombre o ID del alumno"
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleBuscar()}
            />
            <button className="btn-buscar" onClick={handleBuscar} disabled={loadingBuscar}>
              {loadingBuscar ? '...' : 'Buscar'}
            </button>
          </div>
        </div>

        {alertaBuscar === 'found' && (
          <div className="alert-success">
            <img src={successIcon} alt="ok" />
            Alumno encontrado. Revisa y edita los datos a continuación.
          </div>
        )}
        {alertaBuscar === 'notfound' && (
          <div className="alert-warning">
            <img src={warningIcon} alt="aviso" />
            No se encontró ningún alumno con ese nombre o ID.
          </div>
        )}

        {alertaGuardar === 'success' && !alumno && (
          <div className="alert-success">
            <img src={successIcon} alt="ok" />
            {msgGuardar}
          </div>
        )}

        {/* Datos del alumno */}
        {alumno && (
          <div className="datos-alumno-box">
            <p className="datos-title">Datos del Alumno</p>

            <div className="alumno-header-row">
              <div className="alumno-avatar">{alumno.nombres?.[0] || 'A'}</div>
              <div>
                <p className="alumno-nombre">{alumno.nombres} {alumno.apellidos}</p>
                <p className="alumno-meta">ID: {alumno.codigo} · Ingresó: {alumno.fechaIngreso}</p>
              </div>
              <span className={`badge-status ${alumno.activo ? 'badge-activo' : 'badge-inactivo'}`}>
                {alumno.activo ? 'Activo' : 'Inactivo'}
              </span>
            </div>

            <div className="modificar-grid">
              <div className="mod-field">
                <label>Clase Actual:</label>
                <select value={claseActual} onChange={handleClaseChange}>
                  <option value="">— Selecciona —</option>
                  {CLASES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="mod-field">
                <label>Turno Actual:</label>
                <select value={turnoActual} onChange={handleTurnoChange}>
                  <option value="">— Selecciona —</option>
                  {TURNOS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="mod-field">
                <label>Teléfono:</label>
                <input type="tel" value={telefono} onChange={e => setTelefono(e.target.value)} />
              </div>
              <div className="mod-field">
                <label>Correo:</label>
                <input type="email" value={correo} onChange={e => setCorreo(e.target.value)} />
              </div>
            </div>

            {cupoWarning && (
              <div className="alert-warning-inline">
                <img src={warningIcon} alt="aviso" />
                Validación de cupo máximo: {cupoWarning}
              </div>
            )}
            {alertaGuardar === 'success' && alumno && (
              <div className="alert-success" style={{ marginBottom: 12 }}>
                <img src={successIcon} alt="ok" />
                {msgGuardar}
              </div>
            )}
            {alertaGuardar === 'error' && (
              <div className="alert-warning" style={{ marginBottom: 12 }}>
                <img src={errorIcon} alt="error" />
                {msgGuardar}
              </div>
            )}

            <div className="modificar-actions">
              <button className="btn-eliminar" onClick={handleEliminar} disabled={loadingGuardar}>
                Eliminar Inscripción
              </button>
              <button className="btn-cancelar" onClick={handleCancelar}>Cancelar</button>
              <button className="btn-guardar" onClick={handleGuardar} disabled={loadingGuardar || !!cupoWarning}>
                {loadingGuardar ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
export default ModifyInscripcion;

