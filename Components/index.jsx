import React, { useState, useEffect } from 'react';
import './DispositivoPotencia.css';
import endeIMG from '../src/assets/ende.png';
import { FaWhatsapp, FaFacebook, FaTelegram } from 'react-icons/fa';
import { RiCustomerService2Fill } from 'react-icons/ri';

const DispositivoPotencia = () => {
  const [ledVerde, setLedVerde] = useState(false);
  const [ledAmarelo, setLedAmarelo] = useState(false);
  const [ledVermelho, setLedVermelho] = useState(false);
  const [dividaAtual, setDividaAtual] = useState(0);

    // Seus links de redes sociais (substitua pelos seus)
    const socialLinks = {
      whatsapp: "https://wa.me/244932215360", // Substitua SEUNUMERO pelo seu número com código do país
      facebook: "https://www.facebook.com/Chandeky2.0", // Substitua pelo seu username ou link do messenger
      telegram: "https://t.me/Chande_Kayanda" // Substitua pelo seu username do Telegram
    };
  
    // Função para abrir links em nova aba
    const openSocialLink = (url) => {
      window.open(url, '_blank', 'noopener,noreferrer');
    };
  

  const fetchDivida = async () => {
    try {
      const response = await fetch(`https://ende-api.onrender.com/divida/1`);
      const data = await response.json();
      setDividaAtual(data.divida);
      
      if (data.divida <= 20) {
        setLedVerde(true);
        setLedVermelho(false);
      } else {
        setLedVerde(false);
        setLedVermelho(true);
      }
    } catch (error) {
      console.error("Erro ao buscar dívida:", error);
    }
  };

  const verificarIncremento = async () => {
    try {
      const response = await fetch(`https://ende-api.onrender.com/divida/1/incrementada`);
      const data = await response.json();

      if (data.incrementada) {
        // Acende o LED amarelo por 1 minuto
        setLedAmarelo(true);
        
        setTimeout(() => {
          setLedAmarelo(false);
        }, 60000);
      }
    } catch (error) {
      console.error("Erro ao verificar incremento:", error);
    }
  };

  useEffect(() => {
    fetchDivida();
    verificarIncremento();
    
    const intervalo = setInterval(() => {
      fetchDivida();
      verificarIncremento();
    }, 30000);

    return () => clearInterval(intervalo);
  }, []);

  return (
    <div className="dispositivo-container">
      <img src={endeIMG} alt="ENDE Logo" className="logo" />
      <h1 className="titulod">Monitor de Consumo de Energia</h1>
      <div className="lcd-display">
        <p>Dívida: {dividaAtual} Kz</p>
      </div>
      <div className="led-container">
        <div className={`led verde ${ledVerde ? "aceso" : ""}`}
             title="Dívida regular (≤ 20 Kz)"></div>
        <div className={`led amarelo ${ledAmarelo ? "aceso" : ""}`}
             title="Dívida recentemente incrementada"></div>
        <div className={`led vermelho ${ledVermelho ? "aceso" : ""}`}
             title="Dívida elevada (> 20 Kz)"></div>
      </div>
      <p className="descricao">
        O LED Verde acende quando a dívida é menor ou igual que 20 Kzs<br />
        O LED Vermelho acende quando a dívida é maior que 20 Kzs<br />
        O LED Amarelo acende por 1 minuto após cada incremento
      </p>
      
      {/* Nova seção de Contacte-nos */}
      <div className="contact-section">
        <h3>Contacte-nos</h3>
        <div className="social-icons">
          <button 
            onClick={() => openSocialLink(socialLinks.whatsapp)}
            className="social-icon-whatsapp"
            aria-label="WhatsApp"
          >
            <FaWhatsapp /> {/* Ou use um emoji: <span role="img" aria-label="WhatsApp">💬</span> */}
          </button>
          <button 
            onClick={() => openSocialLink(socialLinks.facebook)}
            className="social-icon-facebook"
            aria-label="Facebook"
          >
            <FaFacebook /> {/* Ou use um emoji: <span role="img" aria-label="Facebook">👍</span> */}
          </button>
          <button 
            onClick={() => openSocialLink(socialLinks.telegram)}
            className="social-icon-telegram"
            aria-label="Telegram"
          >
            <FaTelegram /> {/* Ou use um emoji: <span role="img" aria-label="Telegram">📨</span> */}
          </button>
        </div>
      </div>
    </div>
  );
};
export default DispositivoPotencia;