import '../../styles/pages/reportes.css';
import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import pianoImg from '../../assets/imgs/piano.png';
import guitarImg from '../../assets/imgs/guitar.png';
import violinImg from '../../assets/imgs/violin.png';
import peopleImg from '../../assets/imgs/People.png';
import clockPurple from '../../assets/imgs/clock-purple.png';
import customerImg from '../../assets/imgs/Customer.png';

const TAB_GRUPO = 'grupo';
const TAB_TURNO = 'turno';
const TAB_NOMBRE = 'nombre';

const ICONO_MAP = {
  Piano: pianoImg,
  Guitarra: guitarImg,
  Violin: violinImg,
};

function Reportes() {
  const [tab, setTab] = useState(TAB_GRUPO);
  const [stats, setStats] = useState({ totalAlumnos: 0, gruposActivos: 0, gruposEnFormacion: 0 });
  const [grupos, setGrupos] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [alumnos, setAlumnos] = useState([]);
  const [busquedaNombre, setBusquedaNombre] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get('/api/reportes/stats'),
      api.get('/api/reportes/grupos'),
      api.get('/api/reportes/turnos'),
    ]).then(([statsRes, gruposRes, turnosRes]) => {
      setStats(statsRes.data);
      setGrupos(gruposRes.data);
      setTurnos(turnosRes.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleBuscarNombre = async () => {
    if (!busquedaNombre.trim()) return;
    try {
      const res = await api.get(`/api/reportes/alumno?nombre=${busquedaNombre}`);
      setAlumnos(res.data);
    } catch {
      setAlumnos([]);
    }
  };

  const barPct = (actual, max) => max > 0 ? Math.round((actual / max) * 100) : 0;

  return (
    <>
      <div className="reportes-container">
        <h2 className="reportes-title">Reportes</h2>
        <p className="reportes-subtitle">Consulta de reportes por grupos, nombres y por turnos</p>

        {/* Estadísticas */}
        <div className="reportes-stats">
          <div className="stat-card">
            <p className="stat-label">Total de alumnos</p>
            <p className="stat-value purple">{loading ? '...' : stats.totalAlumnos}</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Grupos activos</p>
            <p className="stat-value yellow">{loading ? '...' : stats.gruposActivos}</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Grupos en formación</p>
            <p className="stat-value green">{loading ? '...' : stats.gruposEnFormacion}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="reportes-tabs">
          <button className={`tab ${tab === TAB_GRUPO ? 'active' : ''}`} onClick={() => setTab(TAB_GRUPO)}>
            <img src={pianoImg} alt="" /> por grupo
          </button>
          <button className={`tab ${tab === TAB_TURNO ? 'active' : ''}`} onClick={() => setTab(TAB_TURNO)}>
            <img src={clockPurple} alt="" /> Por turno
          </button>
          <button className={`tab ${tab === TAB_NOMBRE ? 'active' : ''}`} onClick={() => setTab(TAB_NOMBRE)}>
            <img src={customerImg} alt="" /> por nombre
          </button>
        </div>

        {/* Contenido por grupo */}
        {tab === TAB_GRUPO && (
          <div className="reporte-list">
            {loading && <p style={{ color: '#aaa', fontSize: 14, textAlign: 'center' }}>Cargando grupos...</p>}
            {!loading && grupos.length === 0 && (
              <div className="reporte-empty">
                <img src={peopleImg} alt="" />
                <p>No hay grupos registrados.</p>
              </div>
            )}
            {grupos.map(g => (
              <div key={g.id} className="reporte-row">
                <div>
                  <p className="reporte-instrumento">{g.instrumento}</p>
                  <p className="reporte-turno">{g.horario}</p>
                </div>
                <div className="reporte-cupo">
                  <span>{g.cupoActual}/{g.cupoMax}</span>
                  <div className="reporte-bar">
                    <div className="reporte-bar-fill" style={{ width: `${barPct(g.cupoActual, g.cupoMax)}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Contenido por turno */}
        {tab === TAB_TURNO && (
          <div className="reporte-list">
            {loading && <p style={{ color: '#aaa', fontSize: 14, textAlign: 'center' }}>Cargando turnos...</p>}
            {!loading && turnos.length === 0 && (
              <div className="reporte-empty">
                <img src={clockPurple} alt="" />
                <p>No hay información de turnos.</p>
              </div>
            )}
            {turnos.map((t, i) => (
              <div key={i} className="reporte-row">
                <div>
                  <p className="reporte-instrumento">{t.turno}</p>
                  <p className="reporte-turno">{t.grupos} grupo(s)</p>
                </div>
                <div className="reporte-cupo">
                  <span>{t.alumnos} alumnos</span>
                  <div className="reporte-bar">
                    <div className="reporte-bar-fill" style={{ width: `${barPct(t.alumnos, t.capacidadTotal)}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Contenido por nombre */}
        {tab === TAB_NOMBRE && (
          <div>
            <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
              <input
                type="text"
                placeholder="Buscar alumno por nombre"
                value={busquedaNombre}
                onChange={e => setBusquedaNombre(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleBuscarNombre()}
                style={{
                  flex: 1, padding: '11px 14px', border: '1px solid #ccc',
                  borderRadius: 7, fontSize: 14, outline: 'none',
                }}
              />
              <button
                onClick={handleBuscarNombre}
                style={{
                  padding: '11px 22px', background: '#7B2CBF', color: '#fff',
                  border: 'none', borderRadius: 7, fontSize: 14, fontWeight: 'bold', cursor: 'pointer',
                }}
              >
                Buscar
              </button>
            </div>
            <div className="reporte-list">
              {alumnos.length === 0 && (
                <div className="reporte-empty">
                  <img src={customerImg} alt="" />
                  <p>Busca un alumno para ver su información.</p>
                </div>
              )}
              {alumnos.map(al => (
                <div key={al.id} className="reporte-row">
                  <div>
                    <p className="reporte-instrumento">{al.nombres} {al.apellidos}</p>
                    <p className="reporte-turno">ID: {al.codigo} · {al.clase} — {al.turno}</p>
                  </div>
                  <div className="reporte-cupo">
                    <span
                      style={{
                        fontSize: 12, fontWeight: 'bold', padding: '3px 10px',
                        borderRadius: 12,
                        background: al.activo ? '#e8f5e9' : '#ffebee',
                        color: al.activo ? '#2e7d32' : '#c62828',
                      }}
                    >
                      {al.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
export default Reportes;