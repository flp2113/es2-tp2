package com.scheduleclinic.repository;

import com.scheduleclinic.model.Paciente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PacienteRepository extends JpaRepository<Paciente, Long> {
    List<Paciente> findAllByOrderByNomeAsc();

    List<Paciente> findByNomeContainingIgnoreCase(String nome);
}