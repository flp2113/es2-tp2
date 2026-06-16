package com.scheduleclinic.repository;

import com.scheduleclinic.model.Profissional;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProfissionalRepository extends JpaRepository<Profissional, Long> {
    List<Profissional> findAllByOrderByNomeAsc();

    List<Profissional> findByNomeContainingIgnoreCase(String nome);
}