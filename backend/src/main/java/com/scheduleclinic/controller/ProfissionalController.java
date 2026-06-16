package com.scheduleclinic.controller;

import com.scheduleclinic.model.Profissional;
import com.scheduleclinic.repository.ProfissionalRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/profissionais")
@CrossOrigin(origins = "*")
public class ProfissionalController {

    private final ProfissionalRepository repository;

    public ProfissionalController(ProfissionalRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public ResponseEntity<Profissional> criar(@Valid @RequestBody Profissional profissional) {
        return ResponseEntity.status(HttpStatus.CREATED).body(repository.save(profissional));
    }

    @GetMapping
    public ResponseEntity<List<Profissional>> listar() {
        return ResponseEntity.ok(repository.findAllByOrderByNomeAsc());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscar(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @Valid @RequestBody Profissional dados) {
        return repository.findById(id)
                .map(profissional -> {
                    profissional.setNome(dados.getNome());
                    profissional.setEspecialidade(dados.getEspecialidade());
                    profissional.setTelefone(dados.getTelefone());
                    profissional.setEmail(dados.getEmail());
                    return ResponseEntity.ok(repository.save(profissional));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable Long id) {
        return repository.findById(id)
                .map(profissional -> {
                    repository.delete(profissional);
                    return ResponseEntity.ok(Map.of("mensagem", "Profissional removido"));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}