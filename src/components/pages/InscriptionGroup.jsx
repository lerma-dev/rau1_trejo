import '../../styles/pages/inscriptionGroup.css';
import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import pianoImg from '../../assets/imgs/piano.png';
import guitarImg from '../../assets/imgs/guitar.png';
import violinImg from '../../assets/imgs/violin.png';
import infoIcon from '../../assets/badges/Info.png';
import warningIcon from '../../assets/badges/Warning.png';
import successIcon from '../../assets/badges/Success.png';

const ICONO_MAP = {
  Piano: { img: pianoImg, cls: 'piano-icon' },
  Guitarra: { img: guitarImg, cls: 'guitarra-icon' },
  Violin: { img: violinImg, cls: 'violin-icon' },
};

function InscriptionGroup() {
  const [grupos, setGrupos] = useState([]);
  const [grupoSeleccionado, setGrupoSeleccionado] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [resultados, setResultados] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);
  const [loadingGrupos, setLoadingGrupos] = useState(true);
  const [loadingBuscar, setLoadingBuscar] = useState(false);
  const [loadingConfirmar, setLoadingConfirmar] = useState(false);
  const [inscripcionExito, setInscripcionExito] = useState(false);

  useEffect(() => {
    api.get('/api/grupos')
      .then(res => setGrupos(res.data))
      .catch(() => setGrupos([]))
      .finally(() => setLoadingGrupos(false));
  }, []);

  const handleSeleccionarGrupo = (grupo) => {
    if (grupo.cupoActual >= grupo.cupoMax) return;
    setGrupoSeleccionado(grupo);
    setResultados([]);
    setSeleccionados([]);
    setBusqueda('');
    setInscripcionExito(false);
  };

  const handleBuscar = async () => {
    if (!busqueda.trim()) return;
    setLoadingBuscar(true);
    try {
      const res = await api.get(`/api/alumnos/buscar?q=${busqueda}`);
      setResultados(res.data);
    } catch {
      setResultados([]);
    } finally {
      setLoadingBuscar(false);
    }
  };

  const handleAgregar = (alumno) => {
    if (seleccionados.find(a => a.id === alumno.id)) return;
    setSeleccionados([...seleccionados, alumno]);
  };

  const handleQuitar = (id) => {
    setSeleccionados(seleccionados.filter(a => a.id !== id));
  };

  const cupoDisponible = grupoSeleccionado
    ? grupoSeleccionado.cupoMax - grupoSeleccionado.cupoActual
    : 0;
  const cupoResultante = grupoSeleccionado
    ? grupoSeleccionado.cupoActual + seleccionados.length
    : 0;
  const llegaraAlMax = cupoResultante >= (grupoSeleccionado?.cupoMax || 0);

  const handleConfirmar = async () => {
    if (!grupoSeleccionado || seleccionados.length === 0) return;
    setLoadingConfirmar(true);
    try {
      await api.post('/api/inscripciones', {
        grupoId: grupoSeleccionado.id,
        alumnosIds: seleccionados.map(a => a.id),
      });
      setInscripcionExito(true);
      setSeleccionados([]);
      setResultados([]);
      setBusqueda('');
      // Recargar grupos para actualizar cupos
      const res = await api.get('/api/grupos');
      setGrupos(res.data);
      setGrupoSeleccionado(null);
    } catch {
      // manejo de error sin alert nativo
    } finally {
      setLoadingConfirmar(false);
    }
  };

  const stepDone = grupoSeleccionado !== null;
  const stepActive = seleccionados.length > 0;
  return (
    <>
      <div className="inscribir-container">
        {/* Stepper */}
        <div className="inscribir-steps">
          <div className={`step ${stepDone ? 'done' : 'active'}`}>
            <span>{stepDone ? '✓' : '1'}</span>
            Seleccionar grupo
          </div>
          <div className="step-line" />
          <div className={`step ${stepActive ? 'done' : stepDone ? 'active' : ''}`}>
            <span>2</span>
            Agregar Alumno
          </div>
          <div className="step-line" />
          <div className={`step ${inscripcionExito ? 'done' : ''}`}>
            <span>3</span>
            Confirmar
          </div>
        </div>

        {inscripcionExito && (
          <div className="inscripcion-success">
            <img src={successIcon} alt="éxito" style={{ width: 22, marginRight: 8 }} />
            ¡Inscripción realizada con éxito!
          </div>
        )}

        {/* Paso 1 */}
        <div className="inscribir-section">
          <p className="inscribir-paso-title">Paso 1 — Seleccionar Grupo</p>
          {loadingGrupos ? (
            <p style={{ color: '#aaa', fontSize: 14 }}>Cargando grupos...</p>
          ) : grupos.map(grupo => {
            const lleno = grupo.cupoActual >= grupo.cupoMax;
            const icono = ICONO_MAP[grupo.instrumento] || ICONO_MAP['Violin'];
            const selec = grupoSeleccionado?.id === grupo.id;
            return (
              <div
                key={grupo.id}
                className={`grupo-row ${selec ? 'grupo-seleccionado' : ''} ${lleno ? 'grupo-lleno' : ''}`}
                onClick={() => handleSeleccionarGrupo(grupo)}
              >
                <div className={`clase-icon-sm ${icono.cls}`}>
                  <img src={icono.img} alt={grupo.instrumento} />
                </div>
                <div className="grupo-info">
                  <p className="grupo-nombre">{grupo.instrumento} — {grupo.nombre}</p>
                  <p className="grupo-horario">{grupo.horario}</p>
                </div>
                <div className="grupo-cupo-info">
                  <span>{grupo.cupoActual}/{grupo.cupoMax}</span>
                  {lleno
                    ? <span className="badge badge-lleno">Cupo Lleno</span>
                    : selec
                      ? <span className="badge badge-seleccionado">Seleccionado</span>
                      : <span className="badge badge-disponible">Disponible</span>
                  }
                </div>
              </div>
            );
          })}
        </div>

        {/* Paso 2 */}
        {grupoSeleccionado && (
          <div className="inscribir-section">
            <p className="inscribir-paso-title">
              Paso 2 — Alumnos en {grupoSeleccionado.instrumento} — {grupoSeleccionado.nombre}
            </p>
            <div className="buscar-row">
              <input
                type="text"
                placeholder="Buscar Alumno por nombre o ID"
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleBuscar()}
              />
              <button className="btn-buscar" onClick={handleBuscar} disabled={loadingBuscar}>
                {loadingBuscar ? '...' : 'Buscar'}
              </button>
            </div>

            {resultados.length > 0 && (
              <>
                <p className="resultados-label">Resultados</p>
                {resultados.map(al => (
                  <div key={al.id} className="alumno-resultado-row">
                    <span className="alumno-nombre">{al.nombres} {al.apellidos}</span>
                    <span className="alumno-id">· {al.codigo}</span>
                    <button className="btn-agregar" onClick={() => handleAgregar(al)}>Agregar</button>
                  </div>
                ))}
              </>
            )}

            {seleccionados.length > 0 && (
              <div className="seleccionados-box">
                <p className="resultados-label">Seleccionados para inscribir ({seleccionados.length})</p>
                {seleccionados.map(al => (
                  <div key={al.id} className="seleccionado-row">
                    <div className="alumno-avatar">{al.nombres[0]}</div>
                    <div>
                      <span className="alumno-nombre">{al.nombres} {al.apellidos}</span>
                      <span className="alumno-id">{al.codigo}</span>
                    </div>
                    <button className="btn-quitar" onClick={() => handleQuitar(al.id)}>Quitar</button>
                  </div>
                ))}
                <div className="cupo-info-banner">
                  <img src={infoIcon} alt="info" />
                  Cupo disponible: Al agregar {seleccionados.length} alumno(s), el grupo quedaría en {cupoResultante}/{grupoSeleccionado.cupoMax}
                  {llegaraAlMax && ' — Llegando al cupo máximo.'}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Paso 3 Resumen */}
        {grupoSeleccionado && seleccionados.length > 0 && (
          <div className="inscribir-section resumen-box">
            <p className="inscribir-paso-title">Paso 3 — Resumen de la inscripción</p>
            <p><strong>Grupo:</strong> {grupoSeleccionado.instrumento} — {grupoSeleccionado.nombre}</p>
            <p><strong>Turno:</strong> {grupoSeleccionado.horario}</p>
            <p><strong>Alumnos a inscribir:</strong> {seleccionados.map(a => `${a.nombres} ${a.apellidos}`).join(', ')}</p>
            <p><strong>Cupo resultante:</strong> {cupoResultante}/{grupoSeleccionado.cupoMax}{llegaraAlMax ? ' (máximo alcanzado)' : ''}</p>
            {llegaraAlMax && (
              <div className="cupo-warning-banner">
                <img src={warningIcon} alt="aviso" />
                Al confirmar, este grupo alcanzará su cupo máximo y se bloqueará automático
              </div>
            )}
          </div>
        )}

        {/* Acciones */}
        <div className="inscribir-actions">
          <button className="btn-cancelar" onClick={() => { setGrupoSeleccionado(null); setSeleccionados([]); setResultados([]); }}>
            Cancelar
          </button>
          <button
            className="btn-confirmar"
            disabled={!grupoSeleccionado || seleccionados.length === 0 || loadingConfirmar}
            onClick={handleConfirmar}
          >
            {loadingConfirmar ? 'Confirmando...' : 'Confirmar Inscripción'}
          </button>
        </div>
      </div>
    </>
  );
}
export default InscriptionGroup;
