import React, { useState } from 'react';
import { profissionalService } from '../services/api';

const initialForm = {
  nome: '',
  especialidade: '',
  telefone: '',
  email: ''
};

function ProfissionaisPage({ profissionais, onChange }) {
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      await profissionalService.criar(form);
      setForm(initialForm);
      await onChange();
    } finally {
      setSaving(false);
    }
  };

  const remover = async (id) => {
    await profissionalService.remover(id);
    await onChange();
  };

  return (
    <section className="page-card">
      <div className="page-heading">
        <div>
          <span className="section-label">Cadastro</span>
          <h2>Profissionais</h2>
        </div>
        <p>Controle a equipe por especialidade e mantenha o canal de contato atualizado.</p>
      </div>

      <form className="entity-form grid-four" onSubmit={handleSubmit}>
        <label>
          Nome
          <input value={form.nome} onChange={(event) => setForm({ ...form, nome: event.target.value })} />
        </label>
        <label>
          Especialidade
          <input value={form.especialidade} onChange={(event) => setForm({ ...form, especialidade: event.target.value })} />
        </label>
        <label>
          Telefone
          <input value={form.telefone} onChange={(event) => setForm({ ...form, telefone: event.target.value })} />
        </label>
        <label>
          E-mail
          <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
        </label>

        <div className="form-actions full-width">
          <button type="submit" disabled={saving}>{saving ? 'Salvando...' : 'Cadastrar profissional'}</button>
        </div>
      </form>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Especialidade</th>
              <th>Telefone</th>
              <th>E-mail</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {profissionais.map((item) => (
              <tr key={item.id}>
                <td>{item.nome}</td>
                <td>{item.especialidade}</td>
                <td>{item.telefone}</td>
                <td>{item.email}</td>
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

export default ProfissionaisPage;