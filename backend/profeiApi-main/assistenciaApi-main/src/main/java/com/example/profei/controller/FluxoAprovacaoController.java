package com.example.profei.controller;

import com.example.profei.model.FluxoAprovacao;
import com.example.profei.repository.FluxoAprovacaoRepository;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/fluxos-aprovacao")
public class FluxoAprovacaoController {

    private final FluxoAprovacaoRepository repository;

    public FluxoAprovacaoController(FluxoAprovacaoRepository fluxoAprovacaoRepository) {
        this.repository = fluxoAprovacaoRepository;
    }

    // LISTAR TODOS OS REGISTROS DO FLUXO
    @GetMapping
    public List<FluxoAprovacao> findAll() {
        return repository.findAll();
    }

    // BUSCAR REGISTRO POR ID
    @GetMapping("/{id}")
    public ResponseEntity<FluxoAprovacao> findById(@PathVariable long id) {
        return repository.findById(id)
                .map(fluxo -> ResponseEntity.ok().body(fluxo))
                .orElse(ResponseEntity.notFound().build());
    }

    // CRIAR NOVO REGISTRO DE FLUXO
    @PostMapping
    public FluxoAprovacao create(@RequestBody FluxoAprovacao fluxo) {
        if (fluxo.getDataAcao() == null) {
            fluxo.setDataAcao(java.time.LocalDateTime.now());
        }
        return repository.save(fluxo);
    }

    // ATUALIZAR REGISTRO DO FLUXO
    @PutMapping("/{id}")
    public ResponseEntity<FluxoAprovacao> update(
            @PathVariable long id,
            @RequestBody FluxoAprovacao fluxo) {

        return repository.findById(id)
                .map(record -> {
                    record.setAcao(fluxo.getAcao());
                    record.setObservacao(fluxo.getObservacao());
                    record.setUsuario(fluxo.getUsuario());
                    record.setDocumento(fluxo.getDocumento());
                    FluxoAprovacao updated = repository.save(record);
                    return ResponseEntity.ok().body(updated);
                }).orElse(ResponseEntity.notFound().build());
    }

    // DELETAR REGISTRO DO FLUXO
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable long id) {
        return repository.findById(id)
                .map(record -> {
                    repository.deleteById(id);
                    return ResponseEntity.ok().build();
                }).orElse(ResponseEntity.notFound().build());
    }
}
