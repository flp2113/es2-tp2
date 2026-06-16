package com.scheduleclinic.repository;

import com.scheduleclinic.model.Agendamento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {
    List<Agendamento> findAllByOrderByDataHoraAsc();
}