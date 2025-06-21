import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Especialidade = {
  CUIDADOR: 'CUIDADOR',
  BABA: 'BABA',
  ENFERMEIRO: 'ENFERMEIRO',
  FISIOTERAPEUTA: 'FISIOTERAPEUTA',
  MEDICO: 'MEDICO',
  PSICOLOGO: 'PSICOLOGO',
  NUTRICIONISTA: 'NUTRICIONISTA',
  BARBEIRO_A_DOMICILIO: 'BARBEIRO_A_DOMICILIO',
  FAXINEIRO: 'FAXINEIRO'
};

const Perfil = () => {
  const [usuario, setUsuario] = useState(null);
  const [erro, setErro] = useState('');
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState({});

  const [novaFoto, setNovaFoto] = useState(null);
  const [previewFoto, setPreviewFoto] = useState(null);


  useEffect(() => {
    const email = localStorage.getItem("email");

    if (!email || email.trim() === '') {
      setErro("Usuário não está logado.");
      return;
    }

    axios.get(`http://localhost:8080/usuarios/perfil?email=${encodeURIComponent(email)}`, {
      withCredentials: true
    })
      .then(response => {
        setUsuario(response.data);
        setFormData(response.data); // preenche o formulário com os dados
      })
      .catch(error => {
        console.error("Erro ao buscar perfil:", error);
        setErro("Erro ao carregar perfil.");
      });
  }, []);

  const handleSalvar = (e) => {
    e.preventDefault();

    const dadosUsuario = { ...formData };
    delete dadosUsuario.fotoPerfil;

    const data = new FormData();
    data.append('usuario', new Blob([JSON.stringify(dadosUsuario)], { type: 'application/json' }));
    if (novaFoto) {
      data.append('foto', novaFoto);
    }

    axios.put(`http://localhost:8080/usuarios/${usuario.id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true
    })
      .then(response => {
        alert("Dados atualizados com sucesso!");
        setUsuario(response.data);
        setEditando(false);
        setNovaFoto(null);
        setPreviewFoto(null);
      })
      .catch(error => {
        console.error("Erro ao atualizar perfil:", error);
        alert("Erro ao salvar alterações.");
      });
  };


  const handleExcluir = () => {
    if (!window.confirm("Tem certeza que deseja excluir seu perfil? Essa ação não pode ser desfeita.")) return;

    axios.delete(`http://localhost:8080/usuarios/${usuario.id}`, {
      withCredentials: true
    })
      .then(() => {
        alert("Perfil excluído com sucesso!");
        localStorage.clear();
        window.location.href = "/";
      })
      .catch(error => {
        console.error("Erro ao excluir perfil:", error);
        alert("Erro ao excluir perfil.");
      });
  };

  if (erro) {
    return <p style={{ color: 'red', padding: '2rem' }}>{erro}</p>;
  }

  if (!usuario) {
    return <p style={{ padding: '2rem' }}>Carregando perfil...</p>;
  }

  return (
    <div style={{ padding: '2rem' }}>
        <img
          src={
            previewFoto
              ? previewFoto
              : usuario.fotoPerfil
              ? `http://localhost:8080/uploads/fotos-perfil/${usuario.fotoPerfil}`
              : ''
          }
          alt="Foto de perfil"
          style={{
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            objectFit: 'cover',
            marginBottom: '1rem'
          }}
        />

        {editando && (
          <div style={{ marginBottom: '1rem', color: 'blue'  }}>
            <label style={{ cursor: 'pointer' }}>
              <strong>Alterar Foto</strong>
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setNovaFoto(file);
                    setPreviewFoto(URL.createObjectURL(file));
                  }
                }}
              />
            </label>
          </div>
        )}




      <h2>Perfil do Usuário</h2>

      {editando ? (
        <form onSubmit={handleSalvar}>
          <label>Nome:
            <input
              type="text"
              value={formData.nome}
              onChange={e => setFormData({ ...formData, nome: e.target.value })}
            />
          </label><br />

          <label>Email:
            <input type="email" value={formData.email} disabled />
          </label><br />

          <label>Telefone:
            <input
              type="text"
              value={formData.telefone}
              onChange={e => setFormData({ ...formData, telefone: e.target.value })}
            />
          </label><br />

          <label>Endereço:
            <input
              type="text"
              value={formData.endereco || ''}
              onChange={e => setFormData({ ...formData, endereco: e.target.value })}
            />
          </label><br />

          {/* Checkbox oferece serviços */}
          <label>
            <input
              type="checkbox"
              checked={formData.ofereceServico || false}
              onChange={e => setFormData({ ...formData, ofereceServico: e.target.checked })}
            />
            Oferece serviços?
          </label><br />

          {/* Mostrar campos se ofereceServico for true */}
          {formData.ofereceServico && (
            <>
              <label>Especialidade:
                <select
                  value={formData.especialidade || ''}
                  onChange={e => setFormData({ ...formData, especialidade: e.target.value })}
                  required
                >
                  <option value="" disabled>Selecione uma especialidade</option>
                  {Object.entries(Especialidade).map(([key, val]) => (
                    <option key={key} value={val}>
                      {val.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
              </label><br />

              <label>Descrição do Serviço:
                <textarea
                  value={formData.descricaoServico || ''}
                  onChange={e => setFormData({ ...formData, descricaoServico: e.target.value })}
                />
              </label><br />
            </>
          )}

          <button type="submit">Salvar</button>
          <button type="button" onClick={() => setEditando(false)}>Cancelar</button>
        </form>
      ) : (
        <>
          <p><strong>Nome:</strong> {usuario.nome}</p>
          <p><strong>Email:</strong> {usuario.email}</p>
          <p><strong>Telefone:</strong> {usuario.telefone}</p>
          <p><strong>Endereço:</strong> {usuario.endereco}</p>
          {usuario.ofereceServico && (
            <>
              <p><strong>Especialidade:</strong> {usuario.especialidade?.replace(/_/g, ' ')}</p>
              <p><strong>Descrição do Serviço:</strong> {usuario.descricaoServico || "Sem descrição"}</p>
            </>
          )}
          <div style={{ marginTop: '2rem' }}>
            <button onClick={() => setEditando(true)} style={{ marginRight: '1rem' }}>Editar</button>
            <button onClick={handleExcluir} style={{ backgroundColor: 'red', color: 'white' }}>Excluir Perfil</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Perfil;
