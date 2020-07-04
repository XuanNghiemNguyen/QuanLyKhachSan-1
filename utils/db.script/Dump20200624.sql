CREATE DATABASE  IF NOT EXISTS `QLKS` /*!40100 DEFAULT CHARACTER SET utf8 */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `QLKS`;
-- MySQL dump 10.13  Distrib 8.0.20, for Linux (x86_64)
--
-- Host: localhost    Database: QLKS
-- ------------------------------------------------------
-- Server version	8.0.20-0ubuntu0.20.04.1

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
-- Table structure for table `CategoriesRoom`
--

DROP TABLE IF EXISTS `CategoriesRoom`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CategoriesRoom` (
  `idCategoriesRoom` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `name_category_room` varchar(45) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `price_category_room` decimal(8,0) DEFAULT NULL,
  `note_category_room` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `surcharge_rate_category_room` double DEFAULT NULL,
  `room_quantity_category_room` int DEFAULT NULL,
  `max_people_category_room` int DEFAULT NULL,
  PRIMARY KEY (`idCategoriesRoom`),
  UNIQUE KEY `name_category_room_UNIQUE` (`name_category_room`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CategoriesRoom`
--

LOCK TABLES `CategoriesRoom` WRITE;
/*!40000 ALTER TABLE `CategoriesRoom` DISABLE KEYS */;
INSERT INTO `CategoriesRoom` VALUES ('165ec691-35a9-4967-8351-b90a813c4f68','Cao cấp',400000,'',1.5,20,2),('5e8faf79-dfde-463a-9141-c72dec5914f4','Thương gia',1000000,'',2,10,2),('7c6d9781-e7be-496e-a3bc-71f59d261901','Thường',150000,'',0,50,2);
/*!40000 ALTER TABLE `CategoriesRoom` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CustomerTypes`
--

DROP TABLE IF EXISTS `CustomerTypes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CustomerTypes` (
  `idCustomerType` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `name_customer_type` varchar(15) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `factor` double NOT NULL,
  PRIMARY KEY (`idCustomerType`),
  UNIQUE KEY `name_customer_type_UNIQUE` (`name_customer_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CustomerTypes`
--

LOCK TABLES `CustomerTypes` WRITE;
/*!40000 ALTER TABLE `CustomerTypes` DISABLE KEYS */;
/*!40000 ALTER TABLE `CustomerTypes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Customers`
--

DROP TABLE IF EXISTS `Customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Customers` (
  `idCustomer` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `identity_customer` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `name_customer` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `gender_customer` varchar(15) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `address_customer` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `customer_type_id` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  PRIMARY KEY (`idCustomer`),
  UNIQUE KEY `identity_customer_UNIQUE` (`identity_customer`),
  KEY `fk_Customers_1_idx` (`customer_type_id`),
  CONSTRAINT `fk_Customers_1` FOREIGN KEY (`customer_type_id`) REFERENCES `CustomerTypes` (`idCustomerType`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Customers`
--

LOCK TABLES `Customers` WRITE;
/*!40000 ALTER TABLE `Customers` DISABLE KEYS */;
/*!40000 ALTER TABLE `Customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Employees`
--

DROP TABLE IF EXISTS `Employees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Employees` (
  `idEmployee` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `role` varchar(15) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `name_employee` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `address_employee` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  PRIMARY KEY (`idEmployee`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Employees`
--

LOCK TABLES `Employees` WRITE;
/*!40000 ALTER TABLE `Employees` DISABLE KEYS */;
/*!40000 ALTER TABLE `Employees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `LetterRoom`
--

DROP TABLE IF EXISTS `LetterRoom`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `LetterRoom` (
  `id` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `customer_id` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `day_arrival` datetime DEFAULT NULL,
  `day_leaving` datetime DEFAULT NULL,
  `room_id` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `people_counts` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_LetterRoom_1_idx` (`room_id`),
  KEY `fk_LetterRoom_2_idx` (`customer_id`),
  CONSTRAINT `fk_LetterRoom_1` FOREIGN KEY (`room_id`) REFERENCES `Rooms` (`idRoom`),
  CONSTRAINT `fk_LetterRoom_2` FOREIGN KEY (`customer_id`) REFERENCES `Customers` (`idCustomer`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `LetterRoom`
--

LOCK TABLES `LetterRoom` WRITE;
/*!40000 ALTER TABLE `LetterRoom` DISABLE KEYS */;
/*!40000 ALTER TABLE `LetterRoom` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Orders`
--

DROP TABLE IF EXISTS `Orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Orders` (
  `idOrder` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `letter_id` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `total_price` decimal(10,0) DEFAULT NULL,
  `employee_id` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `created_day` datetime DEFAULT NULL,
  PRIMARY KEY (`idOrder`),
  KEY `fk_Orders_1_idx` (`employee_id`),
  KEY `fk_Orders_2_idx` (`letter_id`),
  CONSTRAINT `fk_Orders_1` FOREIGN KEY (`employee_id`) REFERENCES `Employees` (`idEmployee`),
  CONSTRAINT `fk_Orders_2` FOREIGN KEY (`letter_id`) REFERENCES `LetterRoom` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Orders`
--

LOCK TABLES `Orders` WRITE;
/*!40000 ALTER TABLE `Orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `Orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Rooms`
--

DROP TABLE IF EXISTS `Rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Rooms` (
  `idRoom` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `name_room` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `category_id` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `status` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `is_reserved` tinyint DEFAULT NULL,
  `note_room` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idRoom`),
  UNIQUE KEY `name_UNIQUE` (`name_room`),
  KEY `fk_Rooms_1` (`category_id`),
  CONSTRAINT `fk_Rooms_1` FOREIGN KEY (`category_id`) REFERENCES `CategoriesRoom` (`idCategoriesRoom`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Rooms`
--

LOCK TABLES `Rooms` WRITE;
/*!40000 ALTER TABLE `Rooms` DISABLE KEYS */;
INSERT INTO `Rooms` VALUES ('00bffd5f-9874-47b1-9910-61372fda9e6a','P013','5e8faf79-dfde-463a-9141-c72dec5914f4','used',1,NULL),('085f56a7-3dec-406f-8a14-4a60b9460c19','P003','165ec691-35a9-4967-8351-b90a813c4f68','used',1,NULL),('1b5a6b63-a83e-464c-a360-25f483b54998','P025','7c6d9781-e7be-496e-a3bc-71f59d261901','used',1,NULL),('25067bd2-dd5c-4a30-b997-0a30c0473de8','P001','165ec691-35a9-4967-8351-b90a813c4f68','used',1,NULL),('28cebece-1d1c-4cc9-a148-80da88c6982b','P019','5e8faf79-dfde-463a-9141-c72dec5914f4','used',1,NULL),('32b29211-9d2a-41aa-a664-6e7902802d6a','P021','7c6d9781-e7be-496e-a3bc-71f59d261901','used',1,NULL),('32e13804-52c3-4923-946b-95799f360f97','P011','5e8faf79-dfde-463a-9141-c72dec5914f4','used',1,NULL),('3630c702-df49-4860-88c5-be2c4f046110','P024','7c6d9781-e7be-496e-a3bc-71f59d261901','used',1,NULL),('408108a7-891b-49f6-9162-08aa2e677002','P014','5e8faf79-dfde-463a-9141-c72dec5914f4','used',1,NULL),('43f163cd-b95b-452f-a445-5b95624f9459','P002','165ec691-35a9-4967-8351-b90a813c4f68','used',1,NULL),('465eb9cb-2e28-4615-9211-b5caa0b87bd0','P030','7c6d9781-e7be-496e-a3bc-71f59d261901','used',1,NULL),('53e7dbcf-913e-460e-b501-d66a9b78b026','P018','5e8faf79-dfde-463a-9141-c72dec5914f4','used',1,NULL),('57b6fc89-93e7-413d-8d6c-b6df172d8b53','P029','7c6d9781-e7be-496e-a3bc-71f59d261901','used',1,NULL),('5abc0680-0236-48bd-8aad-e9ee697dad19','P026','7c6d9781-e7be-496e-a3bc-71f59d261901','used',1,NULL),('6269a53e-1b91-4b7d-9fb7-818c46b2ab83','P028','7c6d9781-e7be-496e-a3bc-71f59d261901','used',1,NULL),('751cf511-c4a0-48a8-a86f-6430f30ccaf5','P027','7c6d9781-e7be-496e-a3bc-71f59d261901','used',1,NULL),('788c77d2-9587-4392-8afc-26c574f75003','P005','165ec691-35a9-4967-8351-b90a813c4f68','used',1,NULL),('87a02b45-87fe-4966-9aba-4af29bca8caa','P016','5e8faf79-dfde-463a-9141-c72dec5914f4','used',1,NULL),('9d7123a4-ae3e-4676-9505-f83b423eeb85','P006','165ec691-35a9-4967-8351-b90a813c4f68','used',1,NULL),('af8dbd9b-d56d-4dd9-bf1f-439f547ab724','P012','5e8faf79-dfde-463a-9141-c72dec5914f4','used',1,NULL),('b6b2333f-ace9-476e-be9c-a82e76535c4f','P020','5e8faf79-dfde-463a-9141-c72dec5914f4','used',1,NULL),('bd0ef615-88b3-4039-9480-9551a0d47123','P023','7c6d9781-e7be-496e-a3bc-71f59d261901','used',1,NULL),('c7f71683-185f-43e6-981f-838c36dd2bff','P010','165ec691-35a9-4967-8351-b90a813c4f68','used',1,NULL),('ce727d29-8b7e-42e3-956b-5127700b729b','P004','165ec691-35a9-4967-8351-b90a813c4f68','used',1,NULL),('d0e9db88-31f4-4b5d-86c8-e750652ed16a','P015','5e8faf79-dfde-463a-9141-c72dec5914f4','used',1,NULL),('d0ee3295-167c-41d6-9ff9-fd7a7a677892','P022','7c6d9781-e7be-496e-a3bc-71f59d261901','used',1,NULL),('da0c6532-1761-4266-8e9c-f87803a2ab27','P008','165ec691-35a9-4967-8351-b90a813c4f68','used',1,NULL),('da592192-9b63-4bd5-890a-ae0f7d2278a1','P009','165ec691-35a9-4967-8351-b90a813c4f68','used',1,NULL),('e2eb82b8-d7b1-444d-80b0-6335116d756a','P017','5e8faf79-dfde-463a-9141-c72dec5914f4','used',1,NULL),('f2b136bd-6ec1-426b-ac16-bc871b3b91e1','P007','165ec691-35a9-4967-8351-b90a813c4f68','used',1,NULL);
/*!40000 ALTER TABLE `Rooms` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-06-24 20:43:05
