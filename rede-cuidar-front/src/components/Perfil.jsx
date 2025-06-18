import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Perfil = () => {
  const [usuario, setUsuario] = useState(null);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const email = localStorage.getItem("email");

    if (!email || email.trim() === '') {
      setErro("Usuário não está logado.");
      return;
    }

    axios.get(`http://localhost:8080/usuarios/perfil?email=${encodeURIComponent(email)}`)
      .then(response => {


        setUsuario(response.data);
        console.log(response.data);  // para ver os dados recebidos
      })
      .catch(error => {
        console.error("Erro ao buscar perfil:", error);
        setErro("Erro ao carregar perfil.");
      });
  }, []);

  if (erro) {
    return <p style={{ color: 'red', padding: '2rem' }}>{erro}</p>;
  }

  if (!usuario) {
    return <p style={{ padding: '2rem' }}>Carregando perfil...</p>;
  }

  // Desestruturação para facilitar o uso
  const { nome, email, telefone, ofereceServico, especialidade,descricaoServico,endereco  } = usuario;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Perfil do Usuário</h2>
      <p><strong>Nome:</strong> {nome}</p>
      <p><strong>Email:</strong> {email}</p>
      <p><strong>Telefone:</strong> {telefone}</p>
      <p><strong>Endereço:</strong> {endereco}</p>

      {ofereceServico && (
         <>
          <p><strong>Especialidade:</strong> {especialidade}</p>
          <p><strong>Descrição do Serviço:</strong> {descricaoServico || "Sem descrição"}</p>
        </>
      )}
    </div>
  );
};

export default Perfil;
