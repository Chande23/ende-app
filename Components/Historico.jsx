import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Historico = () => {
  const [historico, setHistorico] = useState([]);
  const id = 1; // ID da dívida, pode ser dinâmico conforme necessidade

  const fetchHistorico = async () => {
    try {
      const response = await fetch(`https://ende-api.onrender.com/historico-pagamentos/${id}`);
      const data = await response.json();
      setHistorico(data.historico);
    } catch (error) {
      console.error("Erro ao buscar histórico de pagamentos:", error);
    }
  };

  useEffect(() => {
    fetchHistorico();
  }, []);

  return (
    <div className="historico-container">
      <h2>Histórico de Pagamentos</h2>
      <ul>
        {historico.map((pagamento, index) => (
          <li key={index}>
            <strong>Valor:</strong> {pagamento.valor_pago} Kz -{' '}
            <strong>Data:</strong> {new Date(pagamento.data_pagamento).toLocaleString()}
          </li>
        ))}
      </ul>

      <h3>Evolução dos Pagamentos</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={historico} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="data_pagamento" tickFormatter={(tick) => new Date(tick).toLocaleDateString()} />
          <YAxis />
          <Tooltip formatter={(value) => `${value} Kz`} />
          <Line type="monotone" dataKey="valor_pago" stroke="#8884d8" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Historico;