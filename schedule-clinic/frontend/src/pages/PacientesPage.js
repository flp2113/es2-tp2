import React, { useState } from 'react';
import { pacienteService } from '../services/api';

const initialForm = {
  nome: '',
  cpf: '',
  telefone: '',
  dataNascimento: ''
};

function PacientesPage({ pacientes, onChange }) {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    try {
      await pacienteService.criar(form);
      setForm(initialForm);
      await onChange();
    } catch (exception) {
      setError('Não foi possível salvar o paciente.');
    } finally {
      setSaving(false);
    }
  };

  const remover = async (id) => {
    await pacienteService.remover(id);
    await onChange();
  };

  return (
    <section className="page-card">
      <div className="page-heading">
        <div>
          <span className="section-label">Cadastro</span>
          <h2>Pacientes</h2>
        </div>
        <p>Registre pacientes com identificação básica e data de nascimento.</p>
      </div>

      <form className="entity-form" onSubmit={handleSubmit}>
        <label>
          Nome
          <input value={form.nome} onChange={(event) => setForm({ ...form, nome: event.target.value })} />
        </label>
        <label>
          CPF
          <input value={form.cpf} onChange={(event) => setForm({ ...form, cpf: event.target.value })} />
        </label>
        <label>
          Telefone
          <input value={form.telefone} onChange={(event) => setForm({ ...form, telefone: event.target.value })} />
        </label>
        <label>
          Nascimento
          <input type="date" value={form.dataNascimento} onChange={(event) => setForm({ ...form, dataNascimento: event.target.value })} />
        </label>

        <div className="form-actions">
          <button type="submit" disabled={saving}>{saving ? 'Salvando...' : 'Cadastrar paciente'}</button>
          {error && <span className="form-error">{error}</span>}
        </div>
      </form>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>CPF</th>
              <th>Telefone</th>
              <th>Nascimento</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {pacientes.map((item) => (
              <tr key={item.id}>
                <td>{item.nome}</td>
                <td>{item.cpf}</td>
                <td>{item.telefone}</td>
                <td>{item.dataNascimento}</td>
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

export default PacientesPage;