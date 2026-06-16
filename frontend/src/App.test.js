import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

jest.mock('./services/api', () => ({
  pacienteService: { listar: jest.fn(() => Promise.resolve({ data: [] })) },
  profissionalService: { listar: jest.fn(() => Promise.resolve({ data: [] })) },
  agendamentoService: { listar: jest.fn(() => Promise.resolve({ data: [] })) }
}));

test('renderiza o painel principal', async () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <App />
    </MemoryRouter>
  );

  expect(await screen.findByText(/schedule clinic/i)).toBeInTheDocument();
  expect(screen.getByText(/agenda para clínicas de saúde/i)).toBeInTheDocument();
});