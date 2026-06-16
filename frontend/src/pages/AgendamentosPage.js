import React, { useMemo, useState } from 'react';
import { agendamentoService } from '../services/api';

const initialForm = {
  dataHora: '',
  status: 'CONFIRMADO',
  observacoes: '',
  pacienteId: '',
  profissionalId: ''
};

function AgendamentosPage({ agendamentos, pacientes, profissionais, onChange }) {
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  const canSubmit = useMemo(() => pacientes.length > 0 && profissionais.length > 0, [pacientes.length, profissionais.length]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      await agendamentoService.criar({
        dataHora: form.dataHora,
        status: form.status,
        observacoes: form.observacoes,
        paciente: { id: Number(form.pacienteId) },
        profissional: { id: Number(form.profissionalId) }
      });
      setForm(initialForm);
      await onChange();
    } finally {
      setSaving(false);
    }
  };

  const remover = async (id) => {
    await agendamentoService.remover(id);
    await onChange();
  };

  return (
    <section className="page-card">
      <div className="page-heading">
        <div>
          <span className="section-label">Agenda</span>
          <h2>Agendamentos</h2>
        </div>
        <p>Vincule um paciente a um profissional e registre o horário do atendimento.</p>
      </div>

      <form className="entity-form grid-four" onSubmit={handleSubmit}>
        <label>
          Data e hora
          <input type="datetime-local" value={form.dataHora} onChange={(event) => setForm({ ...form, dataHora: event.target.value })} />
        </label>
        <label>
          Status
          <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
            <option value="CONFIRMADO">CONFIRMADO</option>
            <option value="AGUARDANDO">AGUARDANDO</option>
            <option value="CANCELADO">CANCELADO</option>
          </select>
        </label>
        <label>
          Paciente
          <select value={form.pacienteId} onChange={(event) => setForm({ ...form, pacienteId: event.target.value })}>
            <option value="">Selecione</option>
            {pacientes.map((item) => <option key={item.id} value={item.id}>{item.nome}</option>)}
          </select>
        </label>
        <label>
          Profissional
          <select value={form.profissionalId} onChange={(event) => setForm({ ...form, profissionalId: event.target.value })}>
            <option value="">Selecione</option>
            {profissionais.map((item) => <option key={item.id} value={item.id}>{item.nome}</option>)}
          </select>
        </label>
        <label className="full-width">
          Observações
          <textarea value={form.observacoes} onChange={(event) => setForm({ ...form, observacoes: event.target.value })} rows="3" />
        </label>

        <div className="form-actions full-width">
          <button type="submit" disabled={saving || !canSubmit}>{saving ? 'Salvando...' : 'Cadastrar agendamento'}</button>
          {!canSubmit && <span className="form-error">Cadastre ao menos um paciente e um profissional.</span>}
        </div>
      </form>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Data e hora</th>
              <th>Paciente</th>
              <th>Profissional</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {agendamentos.map((item) => (
              <tr key={item.id}>
                <td>{new Date(item.dataHora).toLocaleString('pt-BR')}</td>
                <td>{item.paciente?.nome}</td>
                <td>{item.profissional?.nome}</td>
                <td>{item.status}</td>
                <td>
                  <button className="ghost-button" type="button" onClick={() => remover(item.id)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default AgendamentosPage;