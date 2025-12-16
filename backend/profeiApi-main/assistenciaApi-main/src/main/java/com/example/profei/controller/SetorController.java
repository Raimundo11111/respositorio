package com.example.profei.controller;

import com.example.profei.model.Setor;

import com.example.profei.repository.SetorRepository;

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

/**
 *
 * @author R
 */

@RestController
@RequestMapping("/setor")
public class SetorController {

    private final SetorRepository repository;

    public SetorController(SetorRepository setorRepository) {
        this.repository = setorRepository;
    }

    // LISTAR TODOS OS SETORES
    @GetMapping
    public List<Setor> findAll() {
        return repository.findAll();
    }

    // BUSCAR SETOR POR ID
    @GetMapping("/{id}")
    public ResponseEntity<Setor> findById(@PathVariable long id) {
        return repository.findById(id)
                .map(setor -> ResponseEntity.ok().body(setor))
                .orElse(ResponseEntity.notFound().build());
    }

    // CRIAR NOVO SETOR
    @PostMapping
    public Setor create(@RequestBody Setor setor) {
        return repository.save(setor);
    }

    // ATUALIZAR SETOR
    @PutMapping("/{id}")
    public ResponseEntity<Setor> update(
            @PathVariable long id,
            @RequestBody Setor setor) {

        return repository.findById(id)
                .map(record -> {
                    record.setNome(setor.getNome());
                    record.setSigla(setor.getSigla());
                    record.setDescricao(setor.getDescricao());
                    Setor updated = repository.save(record);
                    return ResponseEntity.ok().body(updated);
                }).orElse(ResponseEntity.notFound().build());
    }

    // DELETAR SETOR
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable long id) {
        return repository.findById(id)
                .map(record -> {
                    repository.deleteById(id);
                    return ResponseEntity.ok().build();
                }).orElse(ResponseEntity.notFound().build());
    }
}

