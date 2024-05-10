-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 10-05-2024 a las 23:12:46
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `minip01`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `nombres` varchar(255) NOT NULL,
  `apellidos` varchar(255) NOT NULL,
  `direccion` varchar(255) NOT NULL,
  `correo` varchar(255) NOT NULL,
  `dni` varchar(25) NOT NULL,
  `edad` int(4) NOT NULL,
  `fecha_creacion` datetime NOT NULL,
  `telefono` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `user`
--

INSERT INTO `user` (`id`, `nombres`, `apellidos`, `direccion`, `correo`, `dni`, `edad`, `fecha_creacion`, `telefono`) VALUES
(1, 'Gabriel', 'Ferrin', 'Mi casa', 'agferrin@gmail.com', '1234746387', 15, '2024-05-06 09:50:00', '+593-98-341-1576'),
(2, 'David', 'Parrales', 'Su casa', 'david@gmail.com', '123474634', 15, '2024-05-06 00:00:00', '+593-98-341-1576'),
(3, 'Juan', 'Parrales', 'Su casa', 'juan@gmail.com', '123474634', 15, '2024-05-06 00:00:00', '+593-98-341-1576'),
(4, 'Pedro', 'Ferrin', 'Mi casa', 'pedro@gmail.com', '1234746387', 15, '2024-05-06 00:00:00', '+593-98-341-1576'),
(5, 'Daniel', 'Ferrin', 'Mi casa', 'daniel@gmail.com', '1234746387', 15, '2024-05-06 00:00:00', '+593-98-341-1576'),
(6, 'Sergio', 'Parrales', 'Su casa', 'sergio@gmail.com', '123474634', 15, '2024-05-06 00:00:00', '+593-98-341-1576'),
(12, 'Paul', 'Ferrin', 'Mi casa', 'ramiro@dgmail.com', '1234746387', 15, '2024-05-06 00:00:00', '+593-98-341-1576'),
(127, 'Ramiro', 'Parrales', 'Su casa', 'ramiro@gmail.com', '123474634', 15, '2024-05-06 00:00:00', '+593-98-341-1576');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=128;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
