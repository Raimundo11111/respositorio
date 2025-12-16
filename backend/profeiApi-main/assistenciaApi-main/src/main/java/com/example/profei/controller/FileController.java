package com.example.profei.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Collections;
import java.util.Map;
import java.util.UUID;

import java.io.InputStream;
import java.nio.file.NoSuchFileException;

import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.profei.model.Documento;
import com.example.profei.model.Usuario;
import com.example.profei.repository.AuthTokenRepository;
import com.example.profei.repository.DocumentoRepository;
import com.example.profei.repository.UsuarioRepository;

@RestController
@RequestMapping("/files")
public class FileController {

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(FileController.class);

    private final Path uploadDir = Paths.get("uploads");

    private final AuthTokenRepository tokenRepository;
    private final DocumentoRepository documentoRepository;
    private final UsuarioRepository usuarioRepository;

    public FileController(AuthTokenRepository tokenRepository, DocumentoRepository documentoRepository, UsuarioRepository usuarioRepository) throws IOException {
        this.tokenRepository = tokenRepository;
        this.documentoRepository = documentoRepository;
        this.usuarioRepository = usuarioRepository;
        Files.createDirectories(uploadDir);
    }

    @PostMapping("/upload")
    public ResponseEntity<?> upload(@RequestHeader(name = "Authorization", required = false) String authorization,
                                    @RequestParam("file") MultipartFile file,
                                    @RequestParam(name = "titulo", required = false) String titulo,
                                    @RequestParam(name = "tipo", required = false) String tipo) throws IOException {
        try {
            log.info("/files/upload called. authPresent={}, fileName={}, fileSize={}", authorization != null, file==null?null:file.getOriginalFilename(), file==null?0:file.getSize());
            // validar token
            if (authorization == null || !authorization.startsWith("Bearer ")) {
                log.warn("Upload rejected: missing Authorization header");
                return ResponseEntity.status(401).body(Map.of("error","Faça login para enviar arquivos"));
            }
            String token = authorization.substring(7);
            var opt = tokenRepository.findByToken(token);
            if (opt.isEmpty()) {
                log.warn("Upload rejected: token not found");
                return ResponseEntity.status(401).body(Map.of("error","Token inválido"));
            }
            Usuario user = opt.get().getUsuario();

            if (file == null || file.isEmpty()) {
                log.warn("Upload rejected: arquivo vazio");
                return ResponseEntity.badRequest().body(Map.of("error","Arquivo vazio"));
            }

            String original = StringUtils.cleanPath(file.getOriginalFilename());
            String filename = System.currentTimeMillis() + "_" + UUID.randomUUID().toString() + "_" + original;
            Path target = uploadDir.resolve(filename);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
            String caminho = "/uploads/" + filename;

            Documento doc = new Documento();
            doc.setTitulo(titulo != null ? titulo : original);
            doc.setTipo(tipo != null ? tipo : "DESCONHECIDO");
            doc.setCaminhoArquivo(caminho);
            doc.setStatus("ENVIADO");
            doc.setUsuario(user);
            documentoRepository.save(doc);

            log.info("Upload successful: file saved={}, documentoId={}", filename, doc.getId());
            return ResponseEntity.ok(Map.of("caminhoArquivo", caminho, "documentoId", doc.getId()));
        } catch (IOException ioe) {
            log.error("IO error during upload", ioe);
            return ResponseEntity.status(500).body(Map.of("error","Erro ao gravar arquivo"));
        } catch (Exception ex) {
            log.error("Unexpected error during upload", ex);
            return ResponseEntity.status(500).body(Map.of("error", ex.getMessage()));
        }
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<?> download(@RequestHeader(name = "Authorization", required = false) String authorization,
                                      @PathVariable("id") Long id) throws IOException {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(Map.of("error","unauthorized"));
        }
        String token = authorization.substring(7);
        var opt = tokenRepository.findByToken(token);
        if (opt.isEmpty()) return ResponseEntity.status(401).body(Map.of("error","invalid token"));

        var optDoc = documentoRepository.findById(id);
        if (optDoc.isEmpty()) return ResponseEntity.status(404).body(Map.of("error","documento not found"));
        Documento doc = optDoc.get();
        String caminho = doc.getCaminhoArquivo();
        if (caminho == null || caminho.isBlank()) return ResponseEntity.status(404).body(Map.of("error","arquivo not found"));

        // caminho esperado: /uploads/filename
        String filename = Paths.get(caminho).getFileName().toString();
        Path filePath = uploadDir.resolve(filename).normalize();
        if (!Files.exists(filePath)) return ResponseEntity.status(404).body(Map.of("error","arquivo not found"));

        String contentType = Files.probeContentType(filePath);
        if (contentType == null) contentType = "application/octet-stream";

        InputStream is = Files.newInputStream(filePath);
        InputStreamResource resource = new InputStreamResource(is);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.parseMediaType(contentType))
                .body(resource);
    }
}
