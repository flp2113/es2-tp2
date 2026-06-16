import React, { useEffect, useMemo, useState } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PacientesPage from './pages/PacientesPage';
import ProfissionaisPage from './pages/ProfissionaisPage';
import AgendamentosPage from './pages/AgendamentosPage';
import { agendamentoService, pacienteService, profissionalService } from './services/api';

function App() {
  const [pacientes, setPacientes] = useState([]);
  const [profissionais, setProfissionais] = useState([]);
  const [agendamentos, setAgendamentos] = useState([]);

  const carregarDados = async () => {
    const [pacientesRes, profissionaisRes, agendamentosRes] = await Promise.all([
      pacienteService.listar(),
      profissionalService.listar(),
      agendamentoService.listar()
    ]);

    setPacientes(pacientesRes.data);
    setProfissionais(profissionaisRes.data);
    setAgendamentos(agendamentosRes.data);
  };

  useEffect(() => {
    carregarDados().catch((error) => {
      console.error('Falha ao carregar dados da API', error);
    });
  }, []);

  const totals = useMemo(() => ({
    pacientes: pacientes.length,
    profissionais: profissionais.length,
    agendamentos: agendamentos.length
  }), [agendamentos.length, pacientes.length, profissionais.length]);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <p className="brand-kicker">Schedule Clinic</p>
          <h1>Agenda para clínicas de saúde</h1>
          <p className="brand-copy">
            Organize pacientes, profissionais e horários em uma única interface.
          </p>
        </div>

        <nav className="nav-links" aria-label="Navegação principal">
          <Link to="/">Painel</Link>
          <Link to="/pacientes">Pacientes</Link>
          <Link to="/profissionais">Profissionais</Link>
          <Link to="/agendamentos">Agendamentos</Link>
        </nav>

        <div className="sidebar-stats">
          <div>
            <strong>{totals.pacientes}</strong>
            <span>Pacientes</span>
          </div>
          <div>
            <strong>{totals.profissionais}</strong>
            <span>Profissionais</span>
          </div>
          <div>
            <strong>{totals.agendamentos}</strong>
            <span>Agendamentos</span>
          </div>
        </div>
      </aside>

      <main className="content-area">
        <Routes>
          <Route path="/" element={<HomePage pacientes={pacientes} profissionais={profissionais} agendamentos={agendamentos} />} />
          <Route path="/pacientes" element={<PacientesPage pacientes={pacientes} onChange={carregarDados} />} />
          <Route path="/profissionais" element={<ProfissionaisPage profissionais={profissionais} onChange={carregarDados} />} />
          <Route path="/agendamentos" element={<AgendamentosPage agendamentos={agendamentos} pacientes={pacientes} profissionais={profissionais} onChange={carregarDados} />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;