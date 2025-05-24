import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';
import { FaEye, FaMoneyBillWave, FaHistory, FaLightbulb, FaEnvelope } from 'react-icons/fa'; // Ícones
import './Home.css';

import posto from '../src/assets/posto.jpg';
import image2 from '../src/assets/dd.jpg';
import image3 from '../src/assets/disjuntor.jpg';
import image4 from '../src/assets/lamp.jpg';

const Home = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [direction, setDirection] = useState(0); // 0 = próxima, 1 = anterior

  const images = [posto, image2, image3, image4];

  const nextImage = () => {
    setDirection(0);
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setDirection(1);
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const selectImage = (index) => {
    setDirection(index > currentImage ? 0 : 1);
    setCurrentImage(index);
  };

  // Configuração do swipe
  const handlers = useSwipeable({
    onSwipedLeft: () => nextImage(),
    onSwipedRight: () => prevImage(),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  // Troca automática de imagens
  useEffect(() => {
    const interval = setInterval(() => {
      nextImage();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentImage]);

  // Lista de funcionalidades com ícones
  const features = [
    { icon: <FaEye />, text: 'Visualização da dívida em tempo real.' },
    { icon: <FaMoneyBillWave />, text: 'Pagamento da dívida com valor mínimo definido.' },
    { icon: <FaHistory />, text: 'Histórico de pagamentos detalhado.' },
    { icon: <FaLightbulb />, text: 'Indicadores visuais (LEDs) para status da residência.' },
    { icon: <FaEnvelope />, text: 'Notificações por e-mail sobre dívidas, pagamentos e vazamentos de energia.' },
  ];

  return (
    <div className="home-container">
      <h1>Bem-vindo ao Sistema de Gestão de Energia Pós-Pago</h1>
      <p>
        Este sistema permite gerenciar sua dívida de energia de forma eficiente. Visualize sua dívida, faça pagamentos,
        consulte o histórico de pagamentos e monitore o status da sua residência através dos LEDs indicadores.
      </p>

      <div className="slideshow" {...handlers}>
        <AnimatePresence initial={false} custom={direction}>
          <motion.img
            key={currentImage}
            src={images[currentImage]}
            alt={`Slide ${currentImage + 1}`}
            custom={direction}
            initial={{ opacity: 0, x: direction === 0 ? 100 : -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction === 0 ? -100 : 100 }}
            transition={{ duration: 0.5 }}
          />
        </AnimatePresence>

        <button className="nav-button prev" onClick={prevImage}>&#10094;</button>
        <button className="nav-button next" onClick={nextImage}>&#10095;</button>
      </div>

      <div className="thumbnails">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Thumbnail ${index + 1}`}
            className={index === currentImage ? 'active-thumb' : ''}
            onClick={() => selectImage(index)}
          />
        ))}
      </div>

      <div className="features">
        <h2>Funcionalidades do Sistema</h2>
        <motion.div className="features-grid" initial="hidden" animate="visible" variants={containerVariants}>
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="feature-card"
              variants={itemVariants}
              whileHover={{ scale: 1.05, boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)' }}
            >
              <div className="feature-icon">{feature.icon}</div>
              <p>{feature.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

// Variantes para animação de entrada
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Intervalo entre as animações dos filhos
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default Home;
