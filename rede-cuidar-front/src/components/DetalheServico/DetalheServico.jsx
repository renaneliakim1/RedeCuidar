import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getServico } from '../../services/servicoService';

const DetalheServico = () => {
  const { id } = useParams();
  const [servico, setServico] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchServico = async () => {
      try {
        const data = await getServico(id);
        setServico(data);
      } catch (err) {
        setError('Erro ao carregar serviço');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchServico();
  }, [id]);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;
  if (!servico) return <div>Serviço não encontrado</div>;

  return (
    <div>
      <h1>{servico.titulo}</h1>
      {/* Restante do seu JSX */}
    </div>
  );
};

export default DetalheServico;