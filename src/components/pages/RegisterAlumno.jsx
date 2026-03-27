import '../../styles/pages/registerAlumno.css';
import { useState } from 'react';
import api from '../../api/axiosConfig';
import successIcon from '../../assets/badges/Success.png';
import errorIcon from '../../assets/badges/Error.png';

function RegisterAlumno() {
  const [form, setForm] = useState({
    nombres: '',
    apellidos: '',
    fechaNacimiento: '',
    telefono: '',
    correo: '',
  });
  const [status, setStatus] = useState(null); // null | 'success' | 'error'
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setStatus(null);
  };

  const handleSubmit = async () => {
    const { nombres, apellidos, fechaNacimiento, telefono, correo } = form;
    if (!nombres || !apellidos || !fechaNacimiento || !telefono || !correo) {
      setStatus('error');
      setMensaje('Por favor completa todos los campos.');
      return;
    }
    setLoading(true);
    try {
      await api.post('/api/alumnos', form);
      setStatus('success');
      setMensaje('Alumno Registrado con éxito. Ahora regístralo a un grupo.');
      setForm({ nombres: '', apellidos: '', fechaNacimiento: '', telefono: '', correo: '' });
    } catch (err) {
      setStatus('error');
      setMensaje(err?.response?.data?.mensaje || 'Error al registrar el alumno. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="registrar-container">
        <div className="registrar-form-box">
          <h2 className="registrar-title">Datos del Alumno</h2>

          <div className="registrar-row">
            <div className="registrar-field">
              <label>Nombre (s):</label>
              <input
                type="text"
                name="nombres"
                placeholder="Carlos"
                value={form.nombres}
                onChange={handleChange}
              />
            </div>
            <div className="registrar-field">
              <label>Apellidos:</label>
              <input
                type="text"
                name="apellidos"
                placeholder="Ramírez"
                value={form.apellidos}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="registrar-row">
            <div className="registrar-field">
              <label>Fecha de Nacimiento:</label>
              <input
                type="date"
                name="fechaNacimiento"
                value={form.fechaNacimiento}
                onChange={handleChange}
              />
            </div>
            <div className="registrar-field">
              <label>Teléfono:</label>
              <input
                type="tel"
                name="telefono"
                placeholder="656-123-4567"
                value={form.telefono}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="registrar-field full-width">
            <label>Correo:</label>
            <input
              type="email"
              name="correo"
              placeholder="correo@mail.com"
              value={form.correo}
              onChange={handleChange}
            />
          </div>

          {status === 'success' && (
            <div className="registrar-success">
              <img src={successIcon} alt="éxito" />
              {mensaje}
            </div>
          )}
          {status === 'error' && (
            <div className="registrar-success" style={{ background: '#ffebee', border: '1px solid #ef9a9a', color: '#c62828' }}>
              <img src={errorIcon} alt="error" />
              {mensaje}
            </div>
          )}

          <button className="btn-registrar" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Registrando...' : 'Registrar'}
          </button>
        </div>
      </div>
    </>
  );
}
export default RegisterAlumno;