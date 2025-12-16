package com.example.profei;

import com.example.profei.model.Documento;
import com.example.profei.model.FluxoAprovacao;
import com.example.profei.model.Usuario;
import com.example.profei.repository.DocumentoRepository;
import com.example.profei.repository.FluxoAprovacaoRepository;
import com.example.profei.repository.UsuarioRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
public class RepositoryDefaultsTest {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private DocumentoRepository documentoRepository;

    @Autowired
    private FluxoAprovacaoRepository fluxoRepository;

    @Test
    @Transactional
    public void usuarioPrePersistSetsCriadoEm() {
        Usuario u = new Usuario();
        u.setNome("UT");
        u.setEmail("ut@example.com");
        usuarioRepository.save(u);
        assertThat(u.getCriadoEm()).isNotNull();
    }

    @Test
    @Transactional
    public void documentoPrePersistSetsDefaults() {
        Documento d = new Documento();
        d.setTitulo("Doc");
        documentoRepository.save(d);
        assertThat(d.getDataUpload()).isNotNull();
        assertThat(d.getStatus()).isNotNull();
    }

    @Test
    @Transactional
    public void fluxoPrePersistSetsDataAcao() {
        FluxoAprovacao f = new FluxoAprovacao();
        fluxoRepository.save(f);
        assertThat(f.getDataAcao()).isNotNull();
    }
}
