-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: redecuidar
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `avaliacao`
--

DROP TABLE IF EXISTS `avaliacao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `avaliacao` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `comentario` varchar(255) DEFAULT NULL,
  `data_criacao` datetime(6) DEFAULT NULL,
  `avaliado_id` bigint(20) DEFAULT NULL,
  `avaliador_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKg25gnsdvigpjap9yko9a9pra7` (`avaliado_id`),
  KEY `FKh2pbdfai3lcvfjuqmixyewcb2` (`avaliador_id`),
  CONSTRAINT `FKg25gnsdvigpjap9yko9a9pra7` FOREIGN KEY (`avaliado_id`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `FKh2pbdfai3lcvfjuqmixyewcb2` FOREIGN KEY (`avaliador_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `avaliacao`
--

LOCK TABLES `avaliacao` WRITE;
/*!40000 ALTER TABLE `avaliacao` DISABLE KEYS */;
INSERT INTO `avaliacao` VALUES (1,'profissional muito atenciosa','2025-07-12 23:45:07.000000',5,4),(2,'muito prestativo','2025-07-12 23:45:26.000000',3,4),(4,'pontual, dedicado e com muita paciência','2025-07-12 23:47:20.000000',3,6),(10,'profissional muito bom','2025-07-12 23:57:06.000000',3,4),(39,'Pontual, acessível e educado!','2025-07-13 14:46:57.000000',4,6);
/*!40000 ALTER TABLE `avaliacao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reset_token`
--

DROP TABLE IF EXISTS `reset_token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reset_token` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `token` varchar(255) DEFAULT NULL,
  `validade` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reset_token`
--

LOCK TABLES `reset_token` WRITE;
/*!40000 ALTER TABLE `reset_token` DISABLE KEYS */;
/*!40000 ALTER TABLE `reset_token` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `servicos`
--

DROP TABLE IF EXISTS `servicos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `servicos` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `categoria` enum('CUIDADOS_PESSOAIS','EDUCACAO','OUTROS','SAUDE_FISICA','SAUDE_MENTAL') NOT NULL,
  `data_criacao` datetime(6) DEFAULT NULL,
  `descricao` varchar(500) NOT NULL,
  `disponivel` bit(1) NOT NULL,
  `preco` double NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `usuario_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKo8tspmx72wb9br9fsoqbh596g` (`usuario_id`),
  CONSTRAINT `FKo8tspmx72wb9br9fsoqbh596g` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `servicos`
--

LOCK TABLES `servicos` WRITE;
/*!40000 ALTER TABLE `servicos` DISABLE KEYS */;
/*!40000 ALTER TABLE `servicos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `avaliacao_media` double DEFAULT NULL,
  `bairro` varchar(255) DEFAULT NULL,
  `cep` varchar(255) DEFAULT NULL,
  `cidade` varchar(255) DEFAULT NULL,
  `descricao_servico` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `especialidade` enum('BABA','BARBEIRO_A_DOMICILIO','CUIDADOR','ENFERMEIRO','FAXINEIRO','FISIOTERAPEUTA','MASSAGISTA','NUTRICIONISTA','PSICOLOGO') DEFAULT NULL,
  `estado` varchar(255) DEFAULT NULL,
  `foto_perfil` varchar(255) DEFAULT NULL,
  `nome` varchar(255) NOT NULL,
  `oferece_servico` bit(1) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `telefone` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKkfsp0s1tflm1cwlj8idhqsad0` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,0,NULL,NULL,NULL,NULL,'admin@redecuidar.com',NULL,NULL,NULL,'Administrador',_binary '\0','$2a$10$3x9x.ji7e5yhTZJXXSp1ReWa7aNqzSYiy53r1aKt8HDr/GSDZSkkK','999999999'),(3,0,'Jardim América','65058329','São Luís','Sou cuidador(a) e presto assistência a idosos, pessoas com deficiência ou em recuperação. Ofereço atenção, carinho e auxílio em tarefas do dia a dia, sempre prezando pela segurança e bem-estar.','luan@email.com','CUIDADOR','MA','b323eb86-20f4-4e83-bd92-fb7f5e8b4e57_luan-cuidador.png','Luan',_binary '','$2a$10$XITlnrqdJzJmrYsmSuLQSuBp1fIGbFKINxJz9PGodQvk/wrYEp0LK','98912345678'),(4,0,'Jardim América','65058329','São Luís','Sou barbeiro(a) e atendo no conforto da sua casa. Faço cortes, barba e cuidados pessoais com praticidade, estilo e atenção aos detalhes!','pedro@email.com','BARBEIRO_A_DOMICILIO','MA','47323e6f-1719-4418-92ba-88151d1d22d6_pedro-Barbeiro.png','Pedro Afonso',_binary '','$2a$10$C3bG3HqM9x1aD/PyjLsWe.C37Q.xZ/IwXF3vXtcLVYPkhyHVI5/sy','98987112204'),(5,0,'Cidade Operária','65058233','São Luís','Sou massagista profissional e levo bem-estar até você. Faço massagens relaxantes e terapêuticas, aliviando o estresse e promovendo equilíbrio físico e mental.','poliana@email.com','MASSAGISTA','MA','1706b33e-d1af-4133-a3df-b9e7e62b0d37_poliana-massagista.png','Poliana Silva',_binary '','$2a$10$Y5OuAHdBA87C7dlKwvN28O1MwIK0yPzgl6kEpmnRVPwNhVq11BuEu','98912345678'),(6,0,'Jardim América','65058329','São Luís','Sou enfermeiro e levo atendimento de saúde até sua casa. Realizo curativos, aplico medicamentos e acompanho o paciente em todas as etapas do cuidado com atenção e profissionalismo.','jorge@email.com','ENFERMEIRO','MA','cb7fb75a-7131-42dc-b1cb-4709dca4322f_jorge - enfermeiro.png','Jorge Silveira',_binary '','$2a$10$IfW161UvxDq6ZZ1FrvPVxuxJ8m7f9hB8BJn6eokb7gm5vHraNwb4K','98987112204'),(7,0,'Jardim América','65058329','São Luís','Trabalho como faxineiro e ajudo a manter seu ambiente limpo e organizado. Faço limpeza com capricho e compromisso para garantir mais conforto no seu dia a dia.','jessica@gmail.com','FAXINEIRO','MA','700ba983-c6fd-4275-ab7f-4cbe90280382_jessica- faxineira.png','Jessica Andressa',_binary '','$2a$10$XnzIQIBjGegZYlJiAQygiOPO4lbmDSPTe9aIRPx99NBc5j6i9K4z2','98912345678'),(9,0,'Jardim América','65058329','São Luís','Como psicólogo, ofereço escuta acolhedora e acompanhamento emocional. Trabalho para ajudar as pessoas a enfrentarem seus desafios e a cuidarem da saúde mental com respeito e empatia.','flavia@email.com','PSICOLOGO','MA','08a1cb77-2c0c-49ec-81a3-dd47e5420b7f_flavia -psicologa.png','Flavia Alessandra',_binary '','$2a$10$Mkk7HQjpc2.fRIxk6l5G5umTiOyDTh/zziY/duxdiib.66rWvBfuu','98912345678'),(16,0,'Jardim América','65058329','São Luís','Sou fisioterapeuta e ajudo você na reabilitação motora, alívio de dores e exercícios de fortalecimento. Atendo no domicílio para maior conforto e segurança!!!!','renaneliakim1@gmail.com','FISIOTERAPEUTA','MA','2a882b28-e8a2-4981-9493-6bb956497ec2_renan.jpg','Renã Eliakim Oliveira',_binary '','$2a$10$WmHwpDWHkSodaQK35jYNyOkNe430U.hchFADkD9O6YXgaedCEoLQe','98987112204');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'redecuidar'
--

--
-- Dumping routines for database 'redecuidar'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-13 14:52:38
