import React from 'react';

function HomePage({ pacientes, profissionais, agendamentos }) {
  const proximos = [...agendamentos]
    .sort((a, b) => new Date(a.dataHora) - new Date(b.dataHora))
    .slice(0, 3);

  return (
    <section className="page-card hero-card">
      <div className="hero-copy">
        <span className="section-label">Painel operacional</span>
        <h2>Visão rápida da rotina da clínica</h2>
        <p>
          O sistema centraliza cadastro e agenda para facilitar a operação diária sem depender de planilhas.
        </p>
      </div>

      <div className="metric-grid">
        <article className="metric">
          <span>Pacientes</span>
          <strong>{pacientes.length}</strong>
        </article>
        <article className="metric">
          <span>Profissionais</span>
          <strong>{profissionais.length}</strong>
        </article>
        <article className="metric">
          <span>Agendamentos</span>
          <strong>{agendamentos.length}</strong>
        </article>
      </div>

      <div className="two-column">
        <div className="subpanel">
          <h3>Próximos agendamentos</h3>
          {proximos.length === 0 ? (
            <p className="empty-state">Nenhum horário cadastrado ainda.</p>
          ) : (
            <ul className="compact-list">
              {proximos.map((item) => (
                <li key={item.id}>
                  <strong>{new Date(item.dataHora).toLocaleString('pt-BR')}</strong>
                  <span>{item.paciente?.nome} com {item.profissional?.nome}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="subpanel accent-panel">
          <h3>Fluxo sugerido</h3>
          <ol className="workflow-list">
            <li>Cadastre pacientes e profissionais.</li>
            <li>Escolha a data, horário e vínculo correto.</li>
            <li>Acompanhe os horários confirmados pelo painel.</li>
          </ol>
        </div>
      </div>
    </section>
  );
}

export default HomePage;