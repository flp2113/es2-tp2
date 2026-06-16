package com.scheduleclinic;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.scheduleclinic.model.Agendamento;
import com.scheduleclinic.model.Paciente;
import com.scheduleclinic.model.Profissional;
import com.scheduleclinic.repository.AgendamentoRepository;
import com.scheduleclinic.repository.PacienteRepository;
import com.scheduleclinic.repository.ProfissionalRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.time.LocalDateTime;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class ApiIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private PacienteRepository pacienteRepository;

    @Autowired
    private ProfissionalRepository profissionalRepository;

    @Autowired
    private AgendamentoRepository agendamentoRepository;

    @BeforeEach
    void limparDados() {
        agendamentoRepository.deleteAll();
        pacienteRepository.deleteAll();
        profissionalRepository.deleteAll();
    }

    @Test
    void deveCriarListarERemoverEntidades() throws Exception {
        Paciente paciente = new Paciente();
        paciente.setNome("Marina Alves");
        paciente.setCpf("123.456.789-10");
        paciente.setTelefone("11999990000");
        paciente.setDataNascimento(LocalDate.of(1992, 4, 8));

        mockMvc.perform(post("/api/pacientes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(paciente)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists());

        Profissional profissional = new Profissional();
        profissional.setNome("Dra. Helena Costa");
        profissional.setEspecialidade("Cardiologia");
        profissional.setTelefone("1133334444");
        profissional.setEmail("helena@example.com");

        mockMvc.perform(post("/api/profissionais")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(profissional)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists());

        Paciente pacienteSalvo = pacienteRepository.findAll().get(0);
        Profissional profissionalSalvo = profissionalRepository.findAll().get(0);

        Agendamento agendamento = new Agendamento();
        agendamento.setDataHora(LocalDateTime.of(2026, 8, 12, 14, 30));
        agendamento.setStatus("CONFIRMADO");
        agendamento.setObservacoes("Retorno de rotina");
        Paciente pacienteRef = new Paciente();
        pacienteRef.setId(pacienteSalvo.getId());
        Profissional profissionalRef = new Profissional();
        profissionalRef.setId(profissionalSalvo.getId());
        agendamento.setPaciente(pacienteRef);
        agendamento.setProfissional(profissionalRef);

        mockMvc.perform(post("/api/agendamentos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(agendamento)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.paciente.nome").value("Marina Alves"))
                .andExpect(jsonPath("$.profissional.nome").value("Dra. Helena Costa"));

        mockMvc.perform(get("/api/pacientes"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));

        mockMvc.perform(get("/api/profissionais"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));

        mockMvc.perform(get("/api/agendamentos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));

        Long agendamentoId = agendamentoRepository.findAll().get(0).getId();
        mockMvc.perform(delete("/api/agendamentos/" + agendamentoId))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/agendamentos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }
}