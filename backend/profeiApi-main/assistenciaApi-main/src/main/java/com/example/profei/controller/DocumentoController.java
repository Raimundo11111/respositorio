package com.example.profei.controller;

import com.example.profei.model.Documento;
import com.example.profei.repository.DocumentoRepository;

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
@RequestMapping("/documentos")
public class DocumentoController {

    private final DocumentoRepository repository;

    public DocumentoController(DocumentoRepository documentoRepository) {
        this.repository = documentoRepository;
    }

    // LISTAR TODOS OS DOCUMENTOS
    @GetMapping
    public List<Documento> findAll() {
        return repository.findAll();
    }

    // BUSCAR DOCUMENTO POR ID
    @GetMapping("/{id}")
    public ResponseEntity<Documento> findById(@PathVariable long id) {
        return repository.findById(id)
                .map(documento -> ResponseEntity.ok().body(documento))
                .orElse(ResponseEntity.notFound().build());
    }

    // CRIAR DOCUMENTO
    @PostMapping
    public Documento create(@RequestBody Documento documento) {
        if (documento.getDataUpload() == null) {
            documento.setDataUpload(java.time.LocalDateTime.now());
        }
        if (documento.getStatus() == null) {
            documento.setStatus("em análise");
        }
        return repository.save(documento);
    }

    // ATUALIZAR DOCUMENTO
    @PutMapping("/{id}")
    public ResponseEntity<Documento> update(
            @PathVariable long id,
            @RequestBody Documento documento) {

        return repository.findById(id)
                .map(record -> {
                    record.setTitulo(documento.getTitulo());
                    record.setTipo(documento.getTipo());
                    record.setCaminhoArquivo(documento.getCaminhoArquivo());
                    record.setStatus(documento.getStatus());
                    record.setUsuario(documento.getUsuario());
                    record.setSetor(documento.getSetor());
                    Documento updated = repository.save(record);
                    return ResponseEntity.ok().body(updated);
                }).orElse(ResponseEntity.notFound().build());
    }

    // DELETAR DOCUMENTO
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable long id) {
        return repository.findById(id)
                .map(record -> {
                    repository.deleteById(id);
                    return ResponseEntity.ok().build();
                }).orElse(ResponseEntity.notFound().build());
    }
}
