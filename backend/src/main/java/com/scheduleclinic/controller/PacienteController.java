package com.scheduleclinic.controller;

import com.scheduleclinic.model.Paciente;
import com.scheduleclinic.repository.PacienteRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pacientes")
@CrossOrigin(origins = "*")
public class PacienteController {

    private final PacienteRepository repository;

    public PacienteController(PacienteRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public ResponseEntity<Paciente> criar(@Valid @RequestBody Paciente paciente) {
        return ResponseEntity.status(HttpStatus.CREATED).body(repository.save(paciente));
    }

    @GetMapping
    public ResponseEntity<List<Paciente>> listar() {
        return ResponseEntity.ok(repository.findAllByOrderByNomeAsc());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscar(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @Valid @RequestBody Paciente dados) {
        return repository.findById(id)
                .map(paciente -> {
                    paciente.setNome(dados.getNome());
                    paciente.setCpf(dados.getCpf());
                    paciente.setTelefone(dados.getTelefone());
                    paciente.setDataNascimento(dados.getDataNascimento());
                    return ResponseEntity.ok(repository.save(paciente));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable Long id) {
        return repository.findById(id)
                .map(paciente -> {
                    repository.delete(paciente);
                    return ResponseEntity.ok(Map.of("mensagem", "Paciente removido"));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}