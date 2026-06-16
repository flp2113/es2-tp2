package com.scheduleclinic.controller;

import com.scheduleclinic.model.Agendamento;
import com.scheduleclinic.model.Paciente;
import com.scheduleclinic.model.Profissional;
import com.scheduleclinic.repository.AgendamentoRepository;
import com.scheduleclinic.repository.PacienteRepository;
import com.scheduleclinic.repository.ProfissionalRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/agendamentos")
@CrossOrigin(origins = "*")
public class AgendamentoController {

    private final AgendamentoRepository repository;
    private final PacienteRepository pacienteRepository;
    private final ProfissionalRepository profissionalRepository;

    public AgendamentoController(AgendamentoRepository repository,
                                 PacienteRepository pacienteRepository,
                                 ProfissionalRepository profissionalRepository) {
        this.repository = repository;
        this.pacienteRepository = pacienteRepository;
        this.profissionalRepository = profissionalRepository;
    }

    @PostMapping
    public ResponseEntity<?> criar(@Valid @RequestBody Agendamento agendamento) {
        Optional<Agendamento> agendamentoValido = resolverRelacionamentos(agendamento);
        
        if (agendamentoValido.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("mensagem", "Paciente ou profissional inválido"));
        }
        
        Agendamento salvo = repository.save(agendamentoValido.get());
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    @GetMapping
    public ResponseEntity<List<Agendamento>> listar() {
        return ResponseEntity.ok(repository.findAllByOrderByDataHoraAsc());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscar(@PathVariable Long id) {
        return repository.findById(id)
                .map(agendamento -> ResponseEntity.ok().body(agendamento))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @Valid @RequestBody Agendamento dados) {
        Optional<Agendamento> agendamentoExistente = repository.findById(id);
        if (agendamentoExistente.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Optional<Agendamento> relacionamentosValidos = resolverRelacionamentos(dados);
        if (relacionamentosValidos.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("mensagem", "Paciente ou profissional inválido"));
        }

        Agendamento agendamento = agendamentoExistente.get();
        Agendamento valor = relacionamentosValidos.get();

        agendamento.setDataHora(valor.getDataHora());
        agendamento.setStatus(valor.getStatus());
        agendamento.setObservacoes(valor.getObservacoes());
        agendamento.setPaciente(valor.getPaciente());
        agendamento.setProfissional(valor.getProfissional());

        Agendamento atualizado = repository.save(agendamento);
        return ResponseEntity.ok(atualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable Long id) {
        return repository.findById(id)
                .map(agendamento -> {
                    repository.delete(agendamento);
                    return ResponseEntity.ok().body(Map.of("mensagem", "Agendamento removido"));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    private Optional<Agendamento> resolverRelacionamentos(Agendamento agendamento) {
        if (agendamento.getPaciente() == null || agendamento.getPaciente().getId() == null) {
            return Optional.empty();
        }
        if (agendamento.getProfissional() == null || agendamento.getProfissional().getId() == null) {
            return Optional.empty();
        }

        Optional<Paciente> paciente = pacienteRepository.findById(agendamento.getPaciente().getId());
        Optional<Profissional> profissional = profissionalRepository.findById(agendamento.getProfissional().getId());

        if (paciente.isEmpty() || profissional.isEmpty()) {
            return Optional.empty();
        }

        agendamento.setPaciente(paciente.get());
        agendamento.setProfissional(profissional.get());
        return Optional.of(agendamento);
    }
}
